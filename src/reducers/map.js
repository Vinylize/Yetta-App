import * as types from './../actions/actionTypes';

const initialState = {
  /**
   * type is one of these: 'node', 'dest'
   * id is tapped marker ID which is either node id or user id
   */
  markerTapped: {
    type: undefined,
    id: undefined
  }
};

const map = (state = initialState, action = {}) => {
  switch (action.type) {
  case types.setMarkerTapped:
    return {...state, markerTapped: action.markerTapped };
  case types.resetMarkerTapped:
    return {...state, markerTapped: {type: undefined, id: undefined}};
  default:
    return state;
  }
};

export default map;
