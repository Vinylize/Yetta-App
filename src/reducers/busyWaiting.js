import * as types from './../actions/actionTypes';
import update from 'react-addons-update';

const initialState = {
  /**
   * GoogleMapsAPI placeDetails
   */
  busyWaitingPlaceDetailAPI: false,
  /**
   * GoogleMapsAPI geocoding
   */
  busyWaitingGeocodingAPI: false
};

const busyWaiting = (state = initialState, action = {}) => {
  switch (action.type) {
  case types.setBusyWaitingPlaceDetailAPI:
    return update(state, {
      busyWaitingPlaceDetailAPI: { $set: action.busyWaitingPlaceDetailAPI }
    });
  case types.setBusyWaitingGeocodingAPI:
    return update(state, {
      busyWaitingGeocodingAPI: { $set: action.busyWaitingGeocodingAPI }
    });
  default:
    return state;
  }
};

export default busyWaiting;
