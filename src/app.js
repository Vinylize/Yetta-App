import React, { Component } from 'react';
import {
  DeviceEventEmitter,
  PushNotificationIOS,
  Platform
} from 'react-native';
import { Provider } from 'react-redux';
import HockeyApp from 'react-native-hockeyapp';
import store from './store';
import AppWithNavigationState from './navigator/navigatorRoutes';
// [start redux actions]
import { setRunnerNotification } from './actions/pushNotificationActions';
import { foundRunnerAndUpdateOrder } from './actions/orderStatusActions';
// [end redux actions]

export default class Yetta extends Component {
  constructor(props) {
    super(props);
    this.receivedRemoteNotificationAndroid = this.receivedRemoteNotificationAndroid.bind(this);
    this.receivedRemoteNotificationIOS = this.receivedRemoteNotificationIOS.bind(this);
  }

  componentWillMount() {
    const HOCKEY_APP_ID = Platform.OS === 'android' ?
      'a2b9cda775f044ebb66dd827eb98c03f' :
      '411aaad8c63f4b3f9fec01711be479c7';
    /* eslint-disable no-undef */
    if (!__DEV__) {
      HockeyApp.configure(HOCKEY_APP_ID, true);
    }
    /* eslint-enable no-undef */

    // [start adding FCM listeners]
    if (Platform.OS === 'android') {
      // todo: research how to remove these listeners from DeviceEventEmitter for possible memory leaks
      DeviceEventEmitter.addListener('FCMNotificationReceived', async(data) => this.receivedRemoteNotificationAndroid(data));
    } else if (Platform.OS === 'ios') {
      PushNotificationIOS.addEventListener('register', console.log);
      PushNotificationIOS.addEventListener('registrationError', console.log);
      PushNotificationIOS.addEventListener('notification', this.receivedRemoteNotificationIOS);
    }
    // [end adding FCM listeners]
  }

  componentDidMount() {
    /* eslint-disable no-undef */
    if (!__DEV__) {
      HockeyApp.start();
      HockeyApp.checkForUpdate();
    }
    /* eslint-enable no-undef */
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
      const newArr = store.getState().pushNotification.runnerNotification.concat(chunk);
      store.dispatch(setRunnerNotification(newArr));
    } else if (data && data.type === 'CATCH_ORDER') {
      store.dispatch(foundRunnerAndUpdateOrder(data.data));
    }
  }

  receivedRemoteNotificationIOS(notification) {
    notification.finish(PushNotificationIOS.FetchResult.NewData);

    const message = notification.getMessage();
    const data = notification.getData();

    if (data && data.type === 'NEW_ORDER') {
      // todo: reducing size of chunk may improve performance
      const chunk = { message, data };
      const newArr = store.getState().pushNotification.runnerNotification.concat(chunk);
      store.dispatch(setRunnerNotification(newArr));
    } else if (data && data.type === 'CATCH_ORDER') {
      store.dispatch(foundRunnerAndUpdateOrder(data.data));
    }
  }

  render() {
    return (
      <Provider store={store}>
        <AppWithNavigationState/>
      </Provider>
    );
  }
}
