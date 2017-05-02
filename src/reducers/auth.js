import * as types from '../actions/actionTypes';

const initialState = {
  user: {}
};

const auth = (state = initialState, action = {}) => {
  switch (action.type) {
  case types.setUser: {
    return {
      ...state,
      user: action.user
    };
  }
  default:
    return state;
  }
};

export default auth;
