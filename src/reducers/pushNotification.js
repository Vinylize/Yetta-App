import * as types from './../actions/actionTypes';
import update from 'react-addons-update';

const initialState = {
  runnerNotification: []
};

const pushNotification = (state = initialState, action = {}) => {
  switch (action.type) {
  case types.setRunnerNotification:
    return update(state, {
      runnerNotification: { $set: action.runnerNotification }
    });
  default:
    return state;
  }
};

export default pushNotification;
