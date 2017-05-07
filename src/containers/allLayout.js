import {
  Navigator,
  DeviceEventEmitter,
  PushNotificationIOS,
  Platform
} from 'react-native';
import React, { PropTypes } from 'react';
import { loginNavigatorRoute } from '../navigator/navigatorRoutes';
import { connect } from 'react-redux';

// [start redux actions]
import { setRunnerNotification } from './../actions/pushNotificationActions';
import { foundRunnerAndUpdateOrder } from './../actions/orderStatusActions';
// [end redux actions]

const renderScene = (route, navigator) => {
  const { Component } = route;
  console.log('from allLayout: ', route);
  return (
    <Component
      navigator={navigator}
    />
  );
};

const configureScene = (route) => {
  const { sceneConfig } = route;
  return (sceneConfig) ? sceneConfig : Navigator.SceneConfigs.HorizontalSwipeJump;
};

class All extends React.Component {
  constructor(props) {
    super(props);
    this.receivedRemoteNotificationAndroid = this.receivedRemoteNotificationAndroid.bind(this);
    this.receivedRemoteNotificationIOS = this.receivedRemoteNotificationIOS.bind(this);
  }

  componentWillMount() {
    if (Platform.OS === 'android') {
      // todo: research how to remove these listeners from DeviceEventEmitter for possible memory leaks
      DeviceEventEmitter.addListener('FCMNotificationReceived', async(data) => this.receivedRemoteNotificationAndroid(data));
    } else {
      PushNotificationIOS.addEventListener('register', console.log);
      PushNotificationIOS.addEventListener('registrationError', console.log);
      PushNotificationIOS.addEventListener('notification', this.receivedRemoteNotificationIOS);
    }
  }

  componentDidMount() {
    console.log(this.props.runnerNotification);
  }

  componentWillUnmount() {
    PushNotificationIOS.removeEventListener('register', console.log);
    PushNotificationIOS.removeEventListener('registrationError', console.log);
    PushNotificationIOS.removeEventListener('notification', console.log);
  }

  receivedRemoteNotificationAndroid(data) {
    // runnerNotification must be structured same as what iOS does
    if (data && data.fcm && data.type === 'NEW_ORDER') {
      const message = {
        title: data.fcm.title,
        body: data.fcm.body
      };
      const chunk = { message, data };
      const newArr = this.props.runnerNotification.concat(chunk);
      this.props.setRunnerNotification(newArr);
    } else if (data && data.type === 'CATCH_ORDER') {
      this.props.foundRunnerAndUpdateOrder(data.data);
    }
  }

  receivedRemoteNotificationIOS(notification) {
    notification.finish(PushNotificationIOS.FetchResult.NewData);

    const message = notification.getMessage();
    const data = notification.getData();

    if (data && data.type === 'NEW_ORDER') {
      // todo: reducing size of chunk may improve performance
      const chunk = { message, data };
      const newArr = this.props.runnerNotification.concat(chunk);
      this.props.setRunnerNotification(newArr);
    } else if (data && data.type === 'CATCH_ORDER') {
      this.props.foundRunnerAndUpdateOrder(data.data);
    }
  }

  render() {
    const initialRoute = loginNavigatorRoute();
    return (
      <Navigator
        initialRoute={initialRoute}
        renderScene={renderScene}
        configureScene={configureScene}
      />
    );
  }
}

All.propTypes = {
  // reducers/pushNotification
  setRunnerNotification: PropTypes.func,
  runnerNotification: PropTypes.any,

  // reducers/orderStatus
  foundRunnerAndUpdateOrder: PropTypes.func
};

function mapStateToProps(state) {
  return {
    runnerNotification: state.pushNotification.runnerNotification,
    orderStatusList: state.orderStatus.orderStatusList
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    setRunnerNotification: (isRunner) => dispatch(setRunnerNotification(isRunner)),
    foundRunnerAndUpdateOrder: (catchOrderId) => dispatch(foundRunnerAndUpdateOrder(catchOrderId))
  };
};

const AllLayout = connect(mapStateToProps, mapDispatchToProps)(All);

export default AllLayout;
