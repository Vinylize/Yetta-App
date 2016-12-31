import Home from './../components/home';

import HomeRoute from './../routes/homeRoute';

export function homeNavigatorRoute() {
  return {
    // Home is a Relay.Container
    Component: Home,
    queryConfig: new HomeRoute(),
  };
}
