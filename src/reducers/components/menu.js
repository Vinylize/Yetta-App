import * as types from './../../actions/actionTypes';
import { Animated } from 'react-native';
import { menuWidth } from './../../components/menu';

const initialState = {
  /**
   * list of the products to be shown on AddProduct component
   */
  animMenu: new Animated.Value(-menuWidth),
  /**
   * true when animateMenuAppear completely done,
   * false when animateMenuHide completely done
   */
  menuAppeared: false
};

const menu = (state = initialState, action = {}) => {
  switch (action.type) {
  case types.setMenuAppeared: {
    return {...state, menuAppeared: action.menuAppeared};}
  default:
    return state;
  }
};

export default menu;
