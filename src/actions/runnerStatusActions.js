import * as types from './actionTypes';

export const setWaitingNewOrder = (waitingNewOrder) => {
  return {
    type: types.setWaitingNewOrder,
    waitingNewOrder
  };
};
