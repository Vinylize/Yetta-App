import * as types from '../../actions/actionTypes';

const initialState = {
  cardAppeared: false,

  // currently viewing bottom card number
  currentFocusedCardIndex: 0
};

const bottomCardView = (state = initialState, action = {}) => {
  switch (action.type) {
  case types.setCardAppeared: {
    return {...state, cardAppeared: action.cardAppeared};}
  case types.setCurrentFocusedCardIndex: {
    return {...state, currentFocusedCardIndex: action.currentFocusedCardIndex};}
  default:
    return state;
  }
};

export default bottomCardView;
