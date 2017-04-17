import * as types from '../actions/actionTypes';
import update from 'react-addons-update';

const initialState = {
  user: {}
};

const auth = (state = initialState, action = {}) => {
  switch (action.type) {
  case types.setUser: {
    return update(state, {
      user: { $set: action.user }
    });
  }
  default:
    return state;
  }
};

export default auth;
