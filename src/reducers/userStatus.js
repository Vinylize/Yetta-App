import * as types from './../actions/actionTypes';

const initialState = {
  /**
   * user is runner if true and vice versa
   */
  isRunner: false
};

const userStatus = (state = initialState, action = {}) => {
  switch (action.type) {
  case types.setIsRunner:
    return {...state, isRunner: action.isRunner };
  default:
    return state;
  }
};

export default userStatus;
