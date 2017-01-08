import { Navigator } from 'react-native';
import Home from './../components/home';
import Login from './../components/login';
import Map from './../components/map';
import Register from './../components/register';
import Port from './../components/port';
import Ship from './../components/ship';
import PortOrShip from './../components/portOrShip';

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

export function mapNavigatorRoute() {
  return {
    Component: Map
  };
}

export function portNavigatorRoute() {
  return {
    Component: Port,
    sceneConfig
  };
}

export function shipNavigatorRoute() {
  return {
    Component: Ship,
    sceneConfig
  };
}

export function portOrShipNavigatorRoute() {
  return {
    Component: PortOrShip,
    sceneConfig
  };
}
