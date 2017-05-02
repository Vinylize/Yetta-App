import * as types from './../actionTypes';
import store from './../../store';
import {
  Animated,
  Easing
} from 'react-native';
import {
  expandedCardHeight,
  cardInitBottom
} from './../../components/home';

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

export const animateCardAppear = () => {
  const { animatedCardBottomVal } = store.getState().home;
  animatedCardBottomVal.setValue(-expandedCardHeight);
  Animated.timing(
    animatedCardBottomVal,
    {
      toValue: cardInitBottom,
      duration: 100,
      easing: Easing.linear
    }
  ).start();
};
