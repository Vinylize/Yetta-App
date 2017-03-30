import { Navigator } from 'react-native';
import Home from './../components/home';
import Login from './../components/login';
import Register from './../components/register';
import PhoneVerification from './../components/phoneVerification';
import CreateOrder from '../components/createOrder/createOrder';

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

export function createOrderNavigatorRoute(handleCreateOrderDone) {
  console.log('from routes: ', handleCreateOrderDone);
  return {
    Component: CreateOrder,
    func: {handleCreateOrderDone},
    sceneConfig
  };
}
