import { Navigator } from 'react-native';
import Home from './../components/home';
import Login from './../components/login';
import Profile from './../components/profile';
import Register from './../components/register';
import PhoneVerification from './../components/phoneVerification';
import CreateOrderLayout from './../containers/createOrderLayout';
import Setting from './../components/settings/setting';
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
