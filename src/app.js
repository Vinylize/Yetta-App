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
    const HOCKEY_APP_ID = Platform.OS === 'android' ?
      'a2b9cda775f044ebb66dd827eb98c03f' :
      '411aaad8c63f4b3f9fec01711be479c7';
    /* eslint-disable no-undef */
    if (!__DEV__) {
      HockeyApp.configure(HOCKEY_APP_ID, true);
    }
    /* eslint-enable no-undef */
  }

  componentDidMount() {
    /* eslint-disable no-undef */
    if (!__DEV__) {
      HockeyApp.start();
      HockeyApp.checkForUpdate();
    }
    /* eslint-enable no-undef */
  }

  render() {
    return (
      <Provider store={store}>
        <AllLayout/>
      </Provider>
    );
  }
}
