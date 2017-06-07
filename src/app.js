import React, { Component } from 'react';
import {
  Alert,
  DeviceEventEmitter,
  PushNotificationIOS,
  Platform
} from 'react-native';
import { Provider } from 'react-redux';
import HockeyApp from 'react-native-hockeyapp';
import store from './store';
import AppWithNavigationState from './navigator/navigatorRoutes';

import * as YettaServerAPIauth from './service/YettaServerAPI/auth';

// [start redux actions]
import { setRunnerNotification } from './actions/pushNotificationActions';
import { foundRunnerAndUpdateOrder } from './actions/orderStatusActions';
import {
  setWaitingNewOrder,
  setIdVerified,
  setIsWaitingForJudge
} from './actions/runnerStatusActions';
import { setIsRunner } from './actions/userStatusActions';
// [end redux actions]

const SHOULD_BE_RUNNER = true;
const SHOULD_BE_ORDER = false;

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

    PushNotificationIOS.getInitialNotification()
      .then(res => {
        __DEV__ && console.log(res); // eslint-disable-line no-undef
        Alert.alert(String(res));
      });
  }

  componentWillUnmount() {
    PushNotificationIOS.removeEventListener('register', console.log);
    PushNotificationIOS.removeEventListener('registrationError', console.log);
    PushNotificationIOS.removeEventListener('notification', console.log);
  }

  receivedRemoteNotificationAndroid(data) {
    // runnerNotification must be structured same as what iOS does
    if (data && data.fcm && data.type === 'NEW_ORDER') {
      this.changeUserModeIfNeeded(SHOULD_BE_RUNNER);
      const message = {
        title: data.fcm.title,
        body: data.fcm.body
      };
      const chunk = { message, data };
      const newArr = store.getState().pushNotification.runnerNotification.concat(chunk);
      store.dispatch(setRunnerNotification(newArr));
    } else if (data && data.type === 'CATCH_ORDER') {
      this.changeUserModeIfNeeded(SHOULD_BE_ORDER);
      store.dispatch(foundRunnerAndUpdateOrder(data.data));
    } else if (data && data.type === 'ADMIN_DISAPPROVE_RUNNER') {
      this.changeUserModeIfNeeded(SHOULD_BE_RUNNER);
    } else if (data && data.type === 'ADMIN_APPROVE_RUNNER') {
      this.changeUserModeIfNeeded(SHOULD_BE_RUNNER);
    }
  }

  receivedRemoteNotificationIOS(notification) {
    notification.finish(PushNotificationIOS.FetchResult.NewData);

    const message = notification.getMessage();
    const data = notification.getData();
    let tappedByUser = false;

    __DEV__ && console.log(message); // eslint-disable-line no-undef
    __DEV__ && console.log(data); // eslint-disable-line no-undef

    if (data.tappedByUser && data.tappedByUser === 1) {
      // user tapped push notification from app in background
      tappedByUser = true;
    }
    if (data && data.type === 'NEW_ORDER') {
      if (tappedByUser === true) {
        this.changeUserModeIfNeeded(SHOULD_BE_RUNNER);
        this.showNewOrder();
      }
      // todo: reducing size of chunk may improve performance
      const chunk = { message, data };
      const newArr = store.getState().pushNotification.runnerNotification.concat(chunk);
      store.dispatch(setRunnerNotification(newArr));
    } else if (data && data.type === 'CATCH_ORDER') {
      if (tappedByUser === true) {
        this.changeUserModeIfNeeded(SHOULD_BE_ORDER);
      }
      store.dispatch(foundRunnerAndUpdateOrder(data.data));
    } else if (data && data.type === 'ADMIN_DISAPPROVE_RUNNER') {
      if (tappedByUser === true) {
        this.changeUserModeIfNeeded(SHOULD_BE_RUNNER);
        this.showIdVerificationView();
      }
    } else if (data && data.type === 'ADMIN_APPROVE_RUNNER') {
      if (tappedByUser === true) {
        this.changeUserModeIfNeeded(SHOULD_BE_RUNNER);
        this.showRunnerProfile();
      }
    }
  }

  changeUserModeIfNeeded(shouldBeRunner) {
    const USER_MODE_RUNNER = 1;
    const USER_MODE_ORDER = 0;

    const { isRunner } = store.getState().userStatus;
    console.log(isRunner, shouldBeRunner);
    if (isRunner !== shouldBeRunner) {
      __DEV__ && console.log('changing user mode'); // eslint-disable-line no-undef
      store.dispatch(setIsRunner(shouldBeRunner));
      const USER_MODE = (shouldBeRunner === true) ? USER_MODE_RUNNER : USER_MODE_ORDER;
      YettaServerAPIauth.userSetMode(USER_MODE)
        .catch(console.log);
    }
  }

  showNewOrder() {
    store.dispatch(setWaitingNewOrder(true));
  }

  showIdVerificationView() {
    store.dispatch(setIdVerified(false));
    store.dispatch(setIsWaitingForJudge(false));
    store.dispatch(setWaitingNewOrder(false));
  }

  showRunnerProfile() {
    store.dispatch(setIdVerified(true));
    store.dispatch(setIsWaitingForJudge(false));
    store.dispatch(setWaitingNewOrder(false));
  }

  render() {
    return (
      <Provider store={store}>
        <AppWithNavigationState/>
      </Provider>
    );
  }
}
