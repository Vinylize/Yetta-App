import * as types from './../actions/actionTypes';

const initialState = {
  runnerNotification: [],

  /**
   * becomes true by checking initialNotification on cold start
   */
  launchedByUserTapPushNotif: {
    status: false,
    notification: undefined
  }
};

const pushNotification = (state = initialState, action = {}) => {
  switch (action.type) {
  case types.setRunnerNotification:
    return {...state, runnerNotification: action.runnerNotification };
  case types.setLaunchedByUserTapPushNotif:
    return {...state, launchedByUserTapPushNotif: action.launchedByUserTapPushNotif };
  case types.resetLaunchedByUserTapPushNotif:
    return {...state,
      launchedByUserTapPushNotif: {
        status: false,
        notification: undefined
      }
    };
  default:
    return state;
  }
};

export default pushNotification;
