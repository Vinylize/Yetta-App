import * as types from './../actions/actionTypes';

const initialState = {
  nodeList: [],
  stagedNode: {},
  stagedDestination: {},
  // todo: this is not being used, delete this or addProduct.productList
  stagedItems: [],
  destinationLocation: {lat: undefined, lon: undefined}
};

const createOrder = (state = initialState, action = {}) => {
  switch (action.type) {
  case types.setNodeList:
    return {...state, nodeList: action.nodeList };
  case types.setStagedDestination:
    return {
      ...state,
      stagedDestination: action.dest
    };
  case types.setStagedNode:
    return {
      ...state,
      stagedNode: action.node
    };
  case types.addStagedItem:
    return {
      ...state,
      stagedItems: [...state.stagedItems, {...action.item, id: state.stagedItems.length}]
    };
  case types.deleteStagedItem:
    return {
      ...state,
      stagedItems: state.stagedItems.filter(el => el.id !== action.id)
    };
  case types.increaseStagedItemCount:
    return {
      ...state,
      stagedItems: state.stagedItems.map(item => {
        if (action.id === item.id) {
          item.cnt = item.cnt + 1;
        }
        return item;
      })
    };
  case types.decreaseStagedItemCount:
    return {
      ...state,
      stagedItems: state.stagedItems.map(item => {
        if (action.id === item.id && item.cnt > 1) {
          item.cnt = item.cnt - 1;
        }
        return item;
      })
    };
  case types.discardOrder:
    return {
      ...state,
      stagedNode: {},
      stagedDestination: {},
      stagedItems: []
    };
  case types.setDestinationLocation:
    return {
      ...state,
      destinationLocation: action.destinationLocation
    };
  default:
    return state;
  }
};

export default createOrder;
