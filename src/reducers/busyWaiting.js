import * as types from './../actions/actionTypes';
import update from 'react-addons-update';

const initialState = {
  busyWaitingPlaceDetailAPI: false
};

const busyWaiting = (state = initialState, action = {}) => {
  switch (action.type) {
  case types.setBusyWaitingPlaceDetailAPI:
    return update(state, {
      busyWaitingPlaceDetailAPI: { $set: action.busyWaitingPlaceDetailAPI }
    });
  default:
    return state;
  }
};

export default busyWaiting;
