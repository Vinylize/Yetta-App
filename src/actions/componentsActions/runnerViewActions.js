import * as types from './../actionTypes';

export const setRefRunnerView = (refRunnerView) => {
  return {
    type: types.setRefRunnerView,
    refRunnerView
  };
};
