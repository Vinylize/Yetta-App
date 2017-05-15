import * as types from './../actions/actionTypes';

const initialState = {
  /**
   * runner is waiting for new delivery around
   */
  waitingNewOrder: false,
  onDelivery: false,
  idVerified: false,
  isWaitingForJudge: false
};

const runnerStatus = (state = initialState, action = {}) => {
  switch (action.type) {
  case types.setWaitingNewOrder:
    return {...state, waitingNewOrder: action.waitingNewOrder};
  case types.setOnDelivery:
    return {...state, onDelivery: action.onDelivery};
  case types.setIdVerified:
    return {...state, idVerified: action.idVerified};
  case types.setIsWaitingForJudge:
    return {...state, isWaitingForJudge: action.isWaitingForJudge};
  default:
    return state;
  }
};

export default runnerStatus;
