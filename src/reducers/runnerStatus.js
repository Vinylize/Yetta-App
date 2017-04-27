import * as types from './../actions/actionTypes';
import update from 'react-addons-update';

const initialState = {
  /**
   * runner is waiting for new delivery around
   */
  waitingNewOrder: false
};

const runnerStatus = (state = initialState, action = {}) => {
  switch (action.type) {
  case types.setWaitingNewOrder:
    return update(state, {
      waitingNewOrder: { $set: action.waitingNewOrder }
    });
  default:
    return state;
  }
};

export default runnerStatus;
