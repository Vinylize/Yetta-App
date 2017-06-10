import React, { Component } from 'react';
import {
  DeviceEventEmitter,
  NativeModules,
  PushNotificationIOS,
  Platform
} from 'react-native';
import { Provider } from 'react-redux';
import HockeyApp from 'react-native-hockeyapp';
import store from './store';
import AppWithNavigationState from './navigator/navigatorRoutes';

// [start redux actions]
import { setLaunchedByUserTapPushNotif } from './actions/pushNotificationActions';

import * as PushNotificationActions from './actions/pushNotificationActions';

export default class Yetta extends Component {
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
      DeviceEventEmitter.addListener('FCMNotificationReceived', async(data) => PushNotificationActions.receivedRemoteNotificationAndroid(data));
    } else if (Platform.OS === 'ios') {
      PushNotificationIOS.addEventListener('register', console.log);
      PushNotificationIOS.addEventListener('registrationError', console.log);
      PushNotificationIOS.addEventListener('notification', PushNotificationActions.receivedRemoteNotificationIOS);
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

    if (Platform.OS === 'ios') {
      PushNotificationIOS.getInitialNotification()
        .then(notification => {
          __DEV__ && console.log(notification); // eslint-disable-line no-undef
          if (notification) {
            // res is not null when app launched by user tapping push notification
            store.dispatch(setLaunchedByUserTapPushNotif({
              status: true,
              notification: notification
            }));
          }
        });
    } else if (Platform.OS === 'android') {
      /**
       * getting initial notification on app start from background/killed is implemented differently.
       * for Android, receivedRemoteNotificationAndroid will take care normally but payload includes opened_from_tray
       * as key and "1" as value only when app launched from app start from user tapping push notification.
       */
      const AndroidYettaFCMManager = NativeModules.YettaFCMManager;
      AndroidYettaFCMManager.getInitialNotification()
        .then(notification => {
          __DEV__ && console.log(notification); // eslint-disable-line no-undef
          if (notification && notification.opened_from_tray === 1 && notification.fcm && notification.fcm.action) {
            // todo:
          }
        })
        .catch(err => {
          __DEV__ && console.log(err); // eslint-disable-line no-undef
        });
    }
  }

  componentWillUnmount() {
    PushNotificationIOS.removeEventListener('register', console.log);
    PushNotificationIOS.removeEventListener('registrationError', console.log);
    PushNotificationIOS.removeEventListener('notification', console.log);
  }

  render() {
    return (
      <Provider store={store}>
        <AppWithNavigationState/>
      </Provider>
    );
  }
}
