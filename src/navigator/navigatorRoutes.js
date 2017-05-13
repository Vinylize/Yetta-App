import { Navigator } from 'react-native';
import Home from './../components/home';
import Login from './../components/login';
import Profile from './../components/profile';
import Register from './../components/register';
import PhoneVerification from './../components/phoneVerification';
import PaymentInfo from './../components/paymentInfo/paymentInfo';
import CreateOrder from './../components/createOrder/createOrder';
import Setting from './../components/settings/setting';
import OrderHistory from './../components/orderHistory/orderHistory';
import RunnerHistory from './../components/runnerHistory/runnerHistory';
import Splash from './../components/splash';

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

export function createOrderNavigatorRoute() {
  return {
    Component: CreateOrder,
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

export function splashNavigatorRoute() {
  return {
    Component: Splash,
    sceneConfig
  };
}
