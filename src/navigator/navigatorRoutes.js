import { Navigator } from 'react-native';
import Home from './../components/home';
import Login from './../components/login';
import Profile from './../components/profile';
import Register from './../components/register';
import PhoneVerification from './../components/phoneVerification';
import PaymentInfo from './../components/paymentInfo/paymentInfo';
import CreateOrderLayout from './../containers/createOrderLayout';
import Setting from './../components/settings/setting';
import OrderHistory from './../components/orderHistory/orderHistory';
import RunnerHistory from './../components/runnerHistory/runnerHistory';
const sceneConfig = Navigator.SceneConfigs.FloatFromBottom;

export function homeNavigatorRoute() {
  return {
    Component: Home,
    sceneConfig
  };
}

export function loginNavigatorRoute() {
  return {
    Component: Login,
    sceneConfig
  };
}

export function registerNavigatorRoute() {
  return {
    Component: Register
  };
}

export function phoneVerificationNavigatorRoute() {
  return {
    Component: PhoneVerification,
    sceneConfig
  };
}

export function createOrderNavigatorRoute(handleCreateOrderDone, latitude, longitude) {
  return {
    Component: CreateOrderLayout,
    func: {handleCreateOrderDone},
    coordinate: {latitude, longitude},
    sceneConfig
  };
}

export function paymentInfoNavigatorRoute() {
  return {
    Component: PaymentInfo,
    sceneConfig
  };
}

export function profileNavigatorRoute() {
  return {
    Component: Profile,
    sceneConfig
  };
}

export function settingsNavigatorRoute() {
  return {
    Component: Setting,
    sceneConfig
  };
}

export function orderHistoryNavigatorRoute() {
  return {
    Component: OrderHistory,
    sceneConfig
  };
}

export function runnerHistoryNavigatorRoute() {
  return {
    Component: RunnerHistory,
    sceneConfig
  };
}
