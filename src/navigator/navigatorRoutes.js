import Home from './../components/home';
import Login from './../components/login';
import Register from './../components/register';

import HomeRoute from './../routes/homeRoute';
import LoginRoute from './../routes/loginRoute';
import RegisterRoute from './../routes/registerRoute';

export function homeNavigatorRoute() {
  return {
    // Home is a Relay.Container
    Component: Home,
    queryConfig: new HomeRoute()
  };
}

export function loginNavigatorRoute() {
  return {
    // Home is a Relay.Container
    Component: Login,
    queryConfig: new LoginRoute()
  };
}

export function registerNavigatorRoute() {
  return {
    // Home is a Relay.Container
    Component: Register,
    queryConfig: new RegisterRoute()
  };
}
