import { Navigator } from 'react-native';
import React from 'react';
import { loginNavigatorRoute } from '../navigator/navigatorRoutes';
import { connect } from 'react-redux';

const renderScene = (route, navigator) => {
  const { Component } = route;
  console.log('from allLayout: ', route);
  return (
    <Component
      navigator={navigator}
      func={route.func}
      coordinate={route.coordinate}
    />
  );
};

const configureScene = (route) => {
  const { sceneConfig } = route;
  return (sceneConfig) ? sceneConfig : Navigator.SceneConfigs.HorizontalSwipeJump;
};

class All extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const initialRoute = loginNavigatorRoute();
    return (
      <Navigator
        initialRoute={initialRoute}
        renderScene={renderScene}
        configureScene={configureScene}
      />
    );
  }
}

function mapStateToProps() {
  return {};
}

const mapDispatchToProps = () => {
  return {};
};

const AllLayout = connect(
  mapStateToProps,
  mapDispatchToProps
)(All);

export default AllLayout;
