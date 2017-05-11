import * as types from './../actionTypes';
import store from './../../store';
import {
  Animated,
  Dimensions
} from 'react-native';
const WIDTH = Dimensions.get('window').width;

export const setMenuAppeared = (menuAppeared) => {
  return {
    type: types.setMenuAppeared,
    menuAppeared
  };
};

export const animateMenuAppear = (dx) => {
  const { animMenu } = store.getState().menu;
  if (dx) {
    animMenu.setValue(dx);
  }
  Animated.timing(
    animMenu,
    {
      toValue: 0,
      duration: 500
    }
  ).start(() => store.dispatch(setMenuAppeared(true)));
};

export const animateMenuHide = (dx) => {
  const { animMenu } = store.getState().menu;
  if (dx) {
    animMenu.setValue(dx);
  }
  Animated.timing(
    animMenu,
    {
      toValue: -WIDTH,
      duration: 500
    }
  ).start(() => store.dispatch(setMenuAppeared(false)));
};
