import {combineReducers} from 'redux';
import authReducer from './auth';
import createOrderReducer from './createOrder';

export default combineReducers({
  auth: authReducer,
  createOrder: createOrderReducer
});
