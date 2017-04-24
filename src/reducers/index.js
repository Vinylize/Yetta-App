import {combineReducers} from 'redux';
import authReducer from './auth';
import createOrderReducer from './createOrder';
import userStatusReducer from './userStatus';
import busyWaitingReducer from './busyWaiting';

export default combineReducers({
  auth: authReducer,
  createOrder: createOrderReducer,
  userStatus: userStatusReducer,
  busyWaiting: busyWaitingReducer
});
