import Home from './../components/home';
import Login from './../components/login';
import Map from './../components/map';
import Register from './../components/register';
import Port from './../components/port';
import Ship from './../components/ship';
import PortOrShip from './../components/portOrShip';

export function homeNavigatorRoute() {
  return {
    Component: Home
  };
}

export function loginNavigatorRoute() {
  return {
    Component: Login
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
    Component: Port
  };
}

export function shipNavigatorRoute() {
  return {
    Component: Ship
  };
}

export function portOrShipNavigatorRoute() {
  return {
    Component: PortOrShip
  };
}
