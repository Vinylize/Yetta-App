import React, { Component, PropTypes } from 'react';
import {
  DeviceEventEmitter,
  PushNotificationIOS,
  Platform,
  AlertIOS
} from 'react-native';
import { Provider } from 'react-redux';
import store from './store';
import AllLayout from './containers/allLayout';

export default class Vinyl extends Component {
  constructor() {
    super();
  }

  componentWillMount() {
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
    console.log(notification.getMessage());
    AlertIOS.alert(
      notification.getMessage().title,
      notification.getMessage().body,
      [{
        text: 'Dismiss',
        onPress: null
      }]
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

Vinyl.propTypes = {
  initialNotification: PropTypes.any
};
