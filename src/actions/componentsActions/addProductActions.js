import * as types from './../actionTypes';

export const addProduct = (newProduct) => {
  return {
    type: types.addProduct,
    newProduct
  };
};

export const deleteProduct = (index) => {
  return {
    type: types.deleteProduct,
    index
  };
};

export const resetProductList = () => {
  return {
    type: types.resetProductList
  };
};

export const changeProductName = (name, index) => {
  return {
    type: types.changeProductName,
    name,
    index
  };
};

export const changeProductNum = (cnt, index) => {
  return {
    type: types.changeProductNum,
    cnt,
    index
  };
};
