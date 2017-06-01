import * as types from './../actions/actionTypes';

const initialState = {
  /**
   * runner is waiting for new delivery around
   */
  waitingNewOrder: false,
  onDelivery: false,
  idVerified: false,
  isWaitingForJudge: false,

  /**
   * becomes true when runner tap 구매완료 button and should be reset to false after connection is done
   */
  runnerCompletePurchasingItems: false,
  /**
   * becomes true when runner tap 배달완료 button and should be reset to false after connection is done
   */
  runnerCompleteDelivery: false
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
  case types.setRunnerCompletePurchasingItems:
    return {...state, runnerCompletePurchasingItems: action.runnerCompletePurchasingItems};
  case types.setRunnerCompleteDelivery:
    return {...state, runnerCompleteDelivery: action.runnerCompleteDelivery};
  default:
    return state;
  }
};

export default runnerStatus;
