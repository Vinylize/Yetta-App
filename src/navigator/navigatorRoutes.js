import Home from './../components/home';
import Login from './../components/login';
import Map from './../components/map';
import Register from './../components/register';

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
