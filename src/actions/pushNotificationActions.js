import * as types from './actionTypes';
import store from './../store';
import {
  PushNotificationIOS
} from 'react-native';

// [start redux actions]
import { foundRunnerAndUpdateOrder } from './../actions/orderStatusActions';
import {
  setWaitingNewOrder,
  setIdVerified,
  setIsWaitingForJudge
} from './../actions/runnerStatusActions';
import { setIsRunner } from './../actions/userStatusActions';
// [end redux actions]

import * as YettaServerAPIauth from './../service/YettaServerAPI/auth';

const SHOULD_BE_RUNNER = true;
const SHOULD_BE_ORDER = false;

export const setRunnerNotification = (runnerNotification) => {
  return {
    type: types.setRunnerNotification,
    runnerNotification
  };
};

export const setLaunchedByUserTapPushNotif = (launchedByUserTapPushNotif) => {
  return {
    type: types.setLaunchedByUserTapPushNotif,
    launchedByUserTapPushNotif
  };
};

export const resetLaunchedByUserTapPushNotif = () => {
  return {
    type: types.resetLaunchedByUserTapPushNotif
  };
};

const changeUserModeIfNeeded = (shouldBeRunner) => {
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
};

const showNewOrder = () => {
  store.dispatch(setWaitingNewOrder(true));
};

const showIdVerificationView = () => {
  store.dispatch(setIdVerified(false));
  store.dispatch(setIsWaitingForJudge(false));
  store.dispatch(setWaitingNewOrder(false));
};

const showRunnerProfile = () => {
  store.dispatch(setIdVerified(true));
  store.dispatch(setIsWaitingForJudge(false));
  store.dispatch(setWaitingNewOrder(false));
};

export const receivedRemoteNotificationIOS = (notification) => {
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
  if (store.getState().pushNotification.launchedByUserTapPushNotif.status === true) {
    tappedByUser = true;
  }

  if (data && data.type === 'NEW_ORDER') {
    if (tappedByUser === true) {
      changeUserModeIfNeeded(SHOULD_BE_RUNNER);
      showNewOrder();
    }
    // todo: reducing size of chunk may improve performance
    const chunk = { message, data };
    const newArr = store.getState().pushNotification.runnerNotification.concat(chunk);
    store.dispatch(setRunnerNotification(newArr));
  } else if (data && data.type === 'CATCH_ORDER') {
    if (tappedByUser === true) {
      changeUserModeIfNeeded(SHOULD_BE_ORDER);
    }
    store.dispatch(foundRunnerAndUpdateOrder(data.data));
  } else if (data && data.type === 'ADMIN_DISAPPROVE_RUNNER') {
    if (tappedByUser === true) {
      changeUserModeIfNeeded(SHOULD_BE_RUNNER);
      showIdVerificationView();
    }
  } else if (data && data.type === 'ADMIN_APPROVE_RUNNER') {
    if (tappedByUser === true) {
      changeUserModeIfNeeded(SHOULD_BE_RUNNER);
      showRunnerProfile();
    }
  }
  store.dispatch(resetLaunchedByUserTapPushNotif());
};

export const receivedRemoteNotificationAndroid = (data) => {
  __DEV__ && console.log(data); // eslint-disable-line no-undef

  let tappedByUser = false;

  if (data && data.opened_from_tray === '1' && data.type !== null) {
    // user tapped push notification from app in background/killed
    // opened_from_tray can be '1' even if there was nothing to receive
    tappedByUser = true;
  }

  if (data && data.type === 'NEW_ORDER') {
    if (tappedByUser === true) {
      changeUserModeIfNeeded(SHOULD_BE_RUNNER);
      showNewOrder();
    }
    // todo: fcm information may not needed anymore. remove
    if (data && data.fcm) {
      const message = {
        title: data.fcm.title,
        body: data.fcm.body
      };
      const chunk = { message, data };
      const newArr = store.getState().pushNotification.runnerNotification.concat(chunk);
      store.dispatch(setRunnerNotification(newArr));
    }
  } else if (data && data.type === 'CATCH_ORDER') {
    if (tappedByUser === true) {
      changeUserModeIfNeeded(SHOULD_BE_ORDER);
    }
    changeUserModeIfNeeded(SHOULD_BE_ORDER);
    store.dispatch(foundRunnerAndUpdateOrder(data.data));
  } else if (data && data.type === 'ADMIN_DISAPPROVE_RUNNER') {
    if (tappedByUser === true) {
      changeUserModeIfNeeded(SHOULD_BE_RUNNER);
      showIdVerificationView();
    }
  } else if (data && data.type === 'ADMIN_APPROVE_RUNNER') {
    if (tappedByUser === true) {
      changeUserModeIfNeeded(SHOULD_BE_RUNNER);
      showRunnerProfile();
    }
  }
  store.dispatch(resetLaunchedByUserTapPushNotif());
};
