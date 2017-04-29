import React, { Component } from 'react';
import { Provider } from 'react-redux';
import HockeyApp from 'react-native-hockeyapp';
import store from './store';
import AllLayout from './containers/allLayout';

export default class Yetta extends Component {
  constructor() {
    super();
  }

  componentWillMount() {
    const HOCKEY_APP_ID = 'ec0ff0ab93cd4efb8c92add8c17bb819';
    HockeyApp.configure(HOCKEY_APP_ID, true);
  }

  componentDidMount() {
    HockeyApp.start();
    HockeyApp.checkForUpdate();
  }

  render() {
    return (
      <Provider store={store}>
        <AllLayout/>
      </Provider>
    );
  }
}
