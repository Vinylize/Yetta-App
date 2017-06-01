import {combineReducers} from 'redux';
import authReducer from './auth';
import createOrderReducer from './createOrder';
import userStatusReducer from './userStatus';
import runnerStatusReducer from './runnerStatus';
import busyWaitingReducer from './busyWaiting';
import pushNotificationReducer from './pushNotification';
import homeReducer from './components/home';
import bottomCardViewReducer from './components/bottomCardView';
import orderStatusReducer from './orderStatus';
import addProductReducer from './components/addProduct';
import navigatorReducer from './navigator';
import menuReducer from './components/menu';
import runnerViewReducer from './components/runnerView';
import mapReducer from './map';

export default combineReducers({
  auth: authReducer,
  createOrder: createOrderReducer,
  userStatus: userStatusReducer,
  runnerStatus: runnerStatusReducer,
  busyWaiting: busyWaitingReducer,
  pushNotification: pushNotificationReducer,
  home: homeReducer,
  bottomCardView: bottomCardViewReducer,
  orderStatus: orderStatusReducer,
  addProduct: addProductReducer,
  navigator: navigatorReducer,
  menu: menuReducer,
  runnerView: runnerViewReducer,
  map: mapReducer
});
