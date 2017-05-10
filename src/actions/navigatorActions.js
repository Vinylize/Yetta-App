import * as types from './actionTypes';

export const setNavigator = (navigator) => {
  return {
    type: types.setNavigator,
    navigator
  };
};
