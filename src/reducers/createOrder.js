import * as types from './../actions/actionTypes';

const initialState = {
  node: []
};

const createOrder = (state = initialState, action = {}) => {
  switch (action.type) {
  case types.setNode:
    return {...state, node: action.node };
  default:
    return state;
  }
};

export default createOrder;
