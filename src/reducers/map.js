import * as types from './../actions/actionTypes';

const initialState = {
  /**
   * show becomes true when node marker tapped on map
   * id is tapped marker node ID
   */
  markerNodeTapped: {
    show: false,
    id: undefined
  }
};

const map = (state = initialState, action = {}) => {
  switch (action.type) {
  case types.setMarkerNodeTapped:
    return {...state, markerNodeTapped: action.markerNodeTapped };
  default:
    return state;
  }
};

export default map;
