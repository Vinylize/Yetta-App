import * as types from './actionTypes';

export const setIsRunner = (isRunner) => {
  return {
    type: types.setIsRunner,
    isRunner
  };
};
