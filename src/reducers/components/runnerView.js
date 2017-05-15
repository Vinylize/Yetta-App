import * as types from './../../actions/actionTypes';

const initialState = {
  /**
   *
   */
  refRunnerView: undefined
};

const runnerView = (state = initialState, action = {}) => {
  switch (action.type) {
  case types.setRefRunnerView: {
    return {...state, refRunnerView: action.refRunnerView};}
  default:
    return state;
  }
};

export default runnerView;
