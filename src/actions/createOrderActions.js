import * as types from './actionTypes';

export const setStagedNode = (id, name, addr) => {
  return {
    type: types.setStagedNode,
    node: {id, name, addr}
  };
};

export const setStagedDestination = (n1, n2, lat, lon) => {
  return {
    type: types.setStagedDestination,
    dest: {n1, n2, lat, lon}
  };
};

export const addStagedItem = (item) => {
  return {
    type: types.addStagedItem,
    item
  };
};

export const deleteStagedItem = (id) => {
  return {
    type: types.deleteStagedItem,
    id
  };
};

export const increseStagedItemCount = (id) => {
  return {
    type: types.increaseStagedItemCount,
    id
  };
};

export const decreaseStagedItemCont = (id) => {
  return {
    type: types.decreaseStagedItemCount,
    id
  };
};

export const discardOrder = () => {
  return {
    type: types.discardOrder
  };
};

