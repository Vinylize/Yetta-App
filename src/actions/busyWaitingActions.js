import * as types from './actionTypes';

export const setBusyWaitingPlaceDetailAPI = (busyWaitingPlaceDetailAPI) => {
  return {
    type: types.setBusyWaitingPlaceDetailAPI,
    busyWaitingPlaceDetailAPI
  };
};
