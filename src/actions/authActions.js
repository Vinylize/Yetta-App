import * as types from './actionTypes';

export const setUser = (user) => {
  return {
    type: types.setUser,
    user
  };
};
