import React from 'react';
import { Navigator } from 'react-native';
import Relay from 'react-relay';
import { homeNavigatorRoute } from './navigator/navigatorRoutes';

export function setNetworkLayer() {
  let options = {};

  // Access Token
  const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ODY3OWVmYTgwZjRkZjE3NDU5YTYwYzciLCJuYW1lIjoieWZkc2FuZyIsImVtYWlsIjoiZmRzc2Rkc2Zkc0BuYXZlci5jb20iLCJpYXQiOjE0ODMxODU5MTR9.CqqvCh-EWsLaWitw7fXa_H3-n7EpUTz2vAR5sqn0bGw';
  options.headers = {
    Authorization: authToken,
  };
  Relay.injectNetworkLayer(
    new Relay.DefaultNetworkLayer('http://220.76.27.58:5001/graphql', options)
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
