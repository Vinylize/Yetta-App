import React, { Component, PropTypes } from 'react';
import {
  DeviceEventEmitter,
  PushNotificationIOS,
  Platform,
  AlertIOS
} from 'react-native';
import { Provider } from 'react-redux';
import HockeyApp from 'react-native-hockeyapp';
import store from './store';
import AllLayout from './containers/allLayout';

export default class Yetta extends Component {
  constructor() {
    super();
  }

  componentWillMount() {
    const HOCKEY_APP_ID = 'ec0ff0ab93cd4efb8c92add8c17bb819';
    HockeyApp.configure(HOCKEY_APP_ID, true);
    if (Platform.OS === 'android') {
      // todo: research how to remove these listeners from DeviceEventEmitter for possible memory leaks
      DeviceEventEmitter.addListener('FCMNotificationReceived', async(data) => {
        console.log(data);
      });
    } else {
      PushNotificationIOS.addEventListener('register', console.log);
      PushNotificationIOS.addEventListener('registrationError', console.log);
      PushNotificationIOS.addEventListener('notification', this.receivedRemoteNotification);
    }
  }

  componentDidMount() {
    HockeyApp.start();
    HockeyApp.checkForUpdate();
    const { initialNotification } = this.props;
    if (initialNotification) {
      AlertIOS.alert(JSON.stringify(initialNotification));
    }
  }

  componentWillUnmount() {
    PushNotificationIOS.removeEventListener('register', console.log);
    PushNotificationIOS.removeEventListener('registrationError', console.log);
    PushNotificationIOS.removeEventListener('notification', console.log);
  }

  receivedRemoteNotification(notification) {
    console.log(notification);
    console.log(notification.getMessage());
    console.log(notification.getData());
    AlertIOS.alert(
      notification.getMessage()
    );
    notification.finish(PushNotificationIOS.FetchResult.NewData);
  }

  render() {
    return (
      <Provider store={store}>
        <AllLayout/>
      </Provider>
    );
  }
}

Yetta.propTypes = {
  initialNotification: PropTypes.any
};
