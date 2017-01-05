import * as types from './actionTypes';

export const setUserName = (userName) => {
  return {
    type: types.setUserName,
    userName
  };
};
