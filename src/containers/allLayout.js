import { Navigator } from 'react-native';
import React from 'react';
import { homeNavigatorRoute } from '../navigator/navigatorRoutes';
import { connect } from 'react-redux';

const renderScene = (route, navigator) => {
  const { Component } = route;
  return (
    <Component
      navigator={navigator}
    />
  );
};

class All extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const initialRoute = homeNavigatorRoute();
    return (
      <Navigator
        initialRoute={initialRoute}
        renderScene={renderScene}
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
