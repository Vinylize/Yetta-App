import * as types from './actionTypes';

export const setWaitingNewOrder = (waitingNewOrder) => {
  return {
    type: types.setWaitingNewOrder,
    waitingNewOrder
  };
};

export const setOnDelivery = (onDelivery) => {
  return {
    type: types.setOnDelivery,
    onDelivery
  };
};

export const setIdVerified = (idVerified) => {
  return {
    type: types.setIdVerified,
    idVerified
  };
};

export const setIsWaitingForJudge = (isWaitingForJudge) => {
  return {
    type: types.setIsWaitingForJudge,
    isWaitingForJudge
  };
};

export const setRunnerCompletePurchasingItems = (runnerCompletePurchasingItems) => {
  return {
    type: types.setRunnerCompletePurchasingItems,
    runnerCompletePurchasingItems
  };
};

export const setRunnerCompleteDelivery = (runnerCompleteDelivery) => {
  return {
    type: types.setRunnerCompleteDelivery,
    runnerCompleteDelivery
  };
};
