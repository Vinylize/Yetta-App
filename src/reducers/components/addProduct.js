import * as types from './../../actions/actionTypes';

const initialState = {
  /**
   * list of the products to be shown on AddProduct component
   */
  productList: []
};

const addProduct = (state = initialState, action = {}) => {
  switch (action.type) {
  case types.addProduct:
    return {...state, productList: [...state.productList, action.newProduct]};
  case types.deleteProduct:
    return {...state,
      productList: state.productList.filter((el, index) => index !== action.index)};
  case types.resetProductList:
    return {...state, productList: []};
  case types.changeProductName:
    return {...state,
      productList: state.productList.map((el, index) => {
        if (index === action.index) {
          return {
            ...el,
            name: action.name
          };
        }
        return el;
      })};
  case types.changeProductNum:
    return {...state,
      productList: state.productList.map((el, index) => {
        if (index === action.index) {
          return {
            ...el,
            cnt: action.cnt
          };
        }
        return el;
      })
    };
  default:
    return state;
  }
};

export default addProduct;
