import * as types from './actionTypes';

export const setNode = (node) => {
  return {
    type: types.setNode,
    node
  };
};
