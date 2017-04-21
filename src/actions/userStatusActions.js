import * as types from './actionTypes';

export const setUserMode = (isRunner) => {
  return {
    type: types.setUserMode,
    isRunner
  };
};
