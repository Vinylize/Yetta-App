import * as types from './../actionTypes';

export const setCameraWillMoveByPlaceDetailAPI = (cameraWillMoveByPlaceDetailAPI) => {
  return {
    type: types.setCameraWillMoveByPlaceDetailAPI,
    cameraWillMoveByPlaceDetailAPI
  };
};

export const setSearchBarExpanded = (searchBarExpanded) => {
  return {
    type: types.setSearchBarExpanded,
    searchBarExpanded
  };
};

export const setMapCameraPos = (mapCameraPos) => {
  return {
    type: types.setMapCameraPos,
    mapCameraPos
  };
};

export const setShowApproveAddressCard = (showApproveAddressCard) => {
  return {
    type: types.setShowApproveAddressCard,
    showApproveAddressCard
  };
};

export const setSearchedAddressTextView = (searchedAddressTextView) => {
  return {
    type: types.setSearchedAddressTextView,
    searchedAddressTextView
  };
};

export const setCurrentLocation = (currentLocation) => {
  return {
    type: types.setCurrentLocation,
    currentLocation
  };
};

export const setBusyOnWaitingNewRunner = (busyOnWaitingNewRunner) => {
  return {
    type: types.setBusyOnWaitingNewRunner,
    busyOnWaitingNewRunner
  };
};
