import * as types from './actionTypes';

export const setBusyWaitingPlaceDetailAPI = (busyWaitingPlaceDetailAPI) => {
  return {
    type: types.setBusyWaitingPlaceDetailAPI,
    busyWaitingPlaceDetailAPI
  };
};

export const setBusyWaitingGeocodingAPI = (busyWaitingGeocodingAPI) => {
  return {
    type: types.setBusyWaitingGeocodingAPI,
    busyWaitingGeocodingAPI
  };
};

export const setBusyWaitingUserCreateOrder = (busyWaitingUserCreateOrder) => {
  return {
    type: types.setBusyWaitingUserCreateOrder,
    busyWaitingUserCreateOrder
  };
};

export const setBusyWaitingUserModeSwitch = (busyWaitingUserModeSwitch) => {
  return {
    type: types.setBusyWaitingUserModeSwitch,
    busyWaitingUserModeSwitch
  };
};
