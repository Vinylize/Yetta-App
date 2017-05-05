import * as types from '../../actions/actionTypes';

const initialState = {
  cardAppeared: false
};

const bottomCardView = (state = initialState, action = {}) => {
  switch (action.type) {
  case types.setCardAppeared: {
    return {...state, cardAppeared: action.cardAppeared};}
  default:
    return state;
  }
};

export default bottomCardView;
