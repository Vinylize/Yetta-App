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
