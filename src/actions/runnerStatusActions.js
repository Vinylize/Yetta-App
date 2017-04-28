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
