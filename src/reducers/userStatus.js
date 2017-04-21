import * as types from './../actions/actionTypes';
import update from 'react-addons-update';

const initialState = {
  /**
   * user is runner if true and vice versa
   */
  isRunner: false
};

const userStatus = (state = initialState, action = {}) => {
  switch (action.type) {
  case types.setUserMode:
    return update(state, {
      isRunner: { $set: action.isRunner }
    });
  default:
    return state;
  }
};

export default userStatus;
