import * as types from '../../actions/actionTypes';
import update from 'react-addons-update';

const initialState = {
  // intention: avoid unnecessary geocoding from placeAutocomplete API prediction
  cameraWillMoveByPlaceDetailAPI: false,

  // indicates if searchBar is expanded
  searchBarExpanded: false,

  // current camera position on map
  mapCameraPos: {lat: undefined, lon: undefined},

  // determines should ApproveCard be shown
  showApproveAddressCard: false,

  // address texts on ApproveCard
  searchedAddressTextView: {
    // header address to be appeared bold
    firstAddressToken: '',
    // detailed address to be appeared smaller
    addressTextView: ''
  },

  // user's current location
  currentLocation: {lat: undefined, lon: undefined}
};

const home = (state = initialState, action = {}) => {
  switch (action.type) {
  case types.setCameraWillMoveByPlaceDetailAPI: {
    return update(state, {cameraWillMoveByPlaceDetailAPI: {$set: action.cameraWillMoveByPlaceDetailAPI}});}
  case types.setSearchBarExpanded: {
    return update(state, {searchBarExpanded: { $set: action.searchBarExpanded }});}
  case types.setMapCameraPos: {
    return update(state, {mapCameraPos: { $set: action.mapCameraPos }});}
  case types.setShowApproveAddressCard: {
    return update(state, {showApproveAddressCard: { $set: action.showApproveAddressCard }});}
  case types.setSearchedAddressTextView: {
    return update(state, {searchedAddressTextView: { $set: action.searchedAddressTextView }});}
  case types.setCurrentLocation: {
    return update(state, {currentLocation: { $set: action.currentLocation }});}
  default:
    return state;
  }
};

export default home;
