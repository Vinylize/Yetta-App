import * as types from '../actions/actionTypes';
import update from 'react-addons-update';

const initialState = {
  userName: ''
};

const auth = (state = initialState, action = {}) => {
  switch (action.type) {
  case types.setUserName: {
    return update(state, {
      userName: { $set: action.userName }
    });
  }
  default:
    return state;
  }
};

export default auth;
