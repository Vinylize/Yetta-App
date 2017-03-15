import React, { Component } from 'react';
import {
  DeviceEventEmitter
} from 'react-native';
import { Provider } from 'react-redux';
import store from './store';
import AllLayout from './containers/allLayout';

export default class Vinyl extends Component {
  componentWillMount() {
    DeviceEventEmitter.addListener('FCMNotificationReceived', async(data) => {
      console.log(data);
    });
  }

  render() {
    return (
      <Provider store={store}>
        <AllLayout/>
      </Provider>
    );
  }
}
