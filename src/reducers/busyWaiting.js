import * as types from './../actions/actionTypes';

const initialState = {
  /**
   * GoogleMapsAPI placeDetails
   */
  busyWaitingPlaceDetailAPI: false,
  /**
   * GoogleMapsAPI geocoding
   */
  busyWaitingGeocodingAPI: false,
  /**
   * busy on waiting response from userCreateOrder mutation
   */
  busyWaitingUserCreateOrder: false,
  /**
   * busy on waiting user mode switch between order/runner
   */
  busyWaitingUserModeSwitch: false,
  /**
   * busy on querying NodeList from findStore component
   */
  busyWaitingQueryNodeList: false
};

const busyWaiting = (state = initialState, action = {}) => {
  switch (action.type) {
  case types.setBusyWaitingPlaceDetailAPI:
    return {...state, busyWaitingPlaceDetailAPI: action.busyWaitingPlaceDetailAPI };
  case types.setBusyWaitingGeocodingAPI:
    return {...state, busyWaitingGeocodingAPI: action.busyWaitingGeocodingAPI };
  case types.setBusyWaitingUserCreateOrder:
    return {...state, busyWaitingUserCreateOrder: action.busyWaitingUserCreateOrder };
  case types.setBusyWaitingUserModeSwitch:
    return {...state, busyWaitingUserModeSwitch: action.busyWaitingUserModeSwitch};
  case types.setBusyWaitingQueryNodeList:
    return {...state, busyWaitingQueryNodeList: action.busyWaitingQueryNodeList};
  default:
    return state;
  }
};

export default busyWaiting;
