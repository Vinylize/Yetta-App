import * as types from './../actions/actionTypes';
import update from 'react-addons-update';

const initialState = {
  node: []
};

const createOrder = (state = initialState, action = {}) => {
  switch (action.type) {
  case types.setNode:
    return update(state, {
      node: { $set: action.node }
    });
  default:
    return state;
  }
};

export default createOrder;
