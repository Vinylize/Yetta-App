import * as types from './actionTypes';
import store from './../store';

export const setMarkerNodeTapped = (markerNodeTapped) => {
  return {
    type: types.setMarkerNodeTapped,
    markerNodeTapped
  };
};

export const onClickMarkerNode = (id) => {
  store.dispatch(setMarkerNodeTapped({
    show: true,
    id: id
  }));
};
