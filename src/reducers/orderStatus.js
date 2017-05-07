import * as types from './../actions/actionTypes';

const initialState = {
  /**
   * list of order status
   * bottomCardView will be rendered upon this
   * structure:
   * orderStatusList: [{
        foundRunner: boolean,
        id: string,
        data: object
      }]
   */
  orderStatusList: []
};

const orderStatus = (state = initialState, action = {}) => {
  switch (action.type) {
  case types.setOrderStatusList:
    return {...state, orderStatusList: action.orderStatusList};
  case types.addNewOrder:
    return {
      ...state,
      orderStatusList: [...state.orderStatusList, action.newOrder]
    };
  case types.deleteOrder:
    return {
      ...state,
      orderStatusList: state.orderStatusList.filter(el => el.id !== action.id)
    };
  case types.foundRunnerAndUpdateOrder:
    return {
      ...state,
      orderStatusList: state.orderStatusList.map(el => {
        if (el.id === action.catchOrderId) {
          return {...el, foundRunner: true};
        }
        return el;
      })
    };
  default:
    return state;
  }
};

export default orderStatus;
