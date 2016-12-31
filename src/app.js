import React from 'react';
import { Navigator } from 'react-native';
import Relay from 'react-relay';
import { homeNavigatorRoute } from './navigator/navigatorRoutes';

export function setNetworkLayer() {
  let options = {};

  // Access Token
  const authToken = '';
  options.headers = {
    Authorization: authToken,
  };
  Relay.injectNetworkLayer(
    new Relay.DefaultNetworkLayer('http://localhost:5001/graphql', options)
  );
}

export function renderRelayScene(route, navigator) {
  const { Component, queryConfig } = route;
  return (
    <Relay.RootContainer
      Component={Component}
      route={queryConfig}
      renderFetched={(data) => {
        return (
          <Component
            navigator={navigator}
            {...data}
          />
        );
      }}

    />
  );
}

export default class Vinyl extends React.Component {
  componentDidMount() {
    setNetworkLayer();
  }

  render() {
    const initialRoute = homeNavigatorRoute();
    return (
      <Navigator
        initialRoute={initialRoute}
        renderScene={renderRelayScene}
      />
    );
  }
}
