import * as types from './../actions/actionTypes';

const initialState = {
  /**
   * runner is waiting for new delivery around
   */
  waitingNewOrder: false,
  onDelivery: false,
  idVerified: false
};

const runnerStatus = (state = initialState, action = {}) => {
  switch (action.type) {
  case types.setWaitingNewOrder:
    return {...state, waitingNewOrder: action.waitingNewOrder};
  case types.setOnDelivery:
    return {...state, onDelivery: action.onDelivery};
  case types.setIdVerified:
    return {...state, idVerified: action.idVerified};
  default:
    return state;
  }
};

export default runnerStatus;
