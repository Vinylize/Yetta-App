import * as types from './../actions/actionTypes';

const initialState = {
  navigator: undefined
};

const navigator = (state = initialState, action = {}) => {
  switch (action.type) {
  case types.setNavigator:
    return {...state, navigator: action.navigator };
  default:
    return state;
  }
};

export default navigator;
