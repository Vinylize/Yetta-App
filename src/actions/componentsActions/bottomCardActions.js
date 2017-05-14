import * as types from './../actionTypes';
import store from './../../store';
import {
  Animated,
  Dimensions,
  Easing
} from 'react-native';
// constants
const HEIGHT = Dimensions.get('window').height;
export const expandedCardHeight = HEIGHT * 0.43;
const cardHeight = 90;
const cardInitBottom = -expandedCardHeight + cardHeight;

export const setCardAppeared = (cardAppeared) => {
  return {
    type: types.setCardAppeared,
    cardAppeared
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
  ).start(() => {
    store.dispatch(setCardAppeared(true));
  });
};

export const setCurrentFocusedCardIndex = (currentFocusedCardIndex) => {
  return {
    type: types.setCurrentFocusedCardIndex,
    currentFocusedCardIndex
  };
};
