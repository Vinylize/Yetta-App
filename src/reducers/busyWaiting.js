import * as types from './../actions/actionTypes';

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
    return {...state, busyWaitingPlaceDetailAPI: action.busyWaitingPlaceDetailAPI };
  case types.setBusyWaitingGeocodingAPI:
    return {...state, busyWaitingGeocodingAPI: action.busyWaitingGeocodingAPI };
  default:
    return state;
  }
};

export default busyWaiting;
