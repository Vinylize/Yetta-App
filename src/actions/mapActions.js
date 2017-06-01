import * as types from './actionTypes';

export const setMarkerTapped = (markerTapped) => {
  return {
    type: types.setMarkerTapped,
    markerTapped
  };
};

export const resetMarkerTapped = () => {
  return {
    type: types.resetMarkerTapped
  };
};
