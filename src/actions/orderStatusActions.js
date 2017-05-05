import * as types from './actionTypes';

export const setOrderStatusList = (orderStatusList) => {
  return {
    type: types.setOrderStatusList,
    orderStatusList
  };
};

export const addNewOrder = (newOrder) => {
  return {
    type: types.addNewOrder,
    newOrder
  };
};

export const deleteOrder = (id) => {
  return {
    type: types.deleteOrder,
    id
  };
};
