import React, { Component } from 'react';
import { Provider } from 'react-redux';
import store from './store';
import AllLayout from './containers/allLayout';

export default class Yetta extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <Provider store={store}>
        <AllLayout/>
      </Provider>
    );
  }
}
