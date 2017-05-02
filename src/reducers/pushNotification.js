import * as types from './../actions/actionTypes';

const initialState = {
  runnerNotification: []
};

const pushNotification = (state = initialState, action = {}) => {
  switch (action.type) {
  case types.setRunnerNotification:
    return {...state, runnerNotification: action.runnerNotification };
  default:
    return state;
  }
};

export default pushNotification;
