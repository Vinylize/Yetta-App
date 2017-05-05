import {combineReducers} from 'redux';
import authReducer from './auth';
import createOrderReducer from './createOrder';
import userStatusReducer from './userStatus';
import runnerStatusReducer from './runnerStatus';
import busyWaitingReducer from './busyWaiting';
import pushNotificationReducer from './pushNotification';
import homeReducer from './components/home';
import bottomCardViewReducer from './components/bottomCardView';

export default combineReducers({
  auth: authReducer,
  createOrder: createOrderReducer,
  userStatus: userStatusReducer,
  runnerStatus: runnerStatusReducer,
  busyWaiting: busyWaitingReducer,
  pushNotification: pushNotificationReducer,
  home: homeReducer,
  bottomCardView: bottomCardViewReducer
});
