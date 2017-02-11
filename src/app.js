import React, { Component } from 'react';
import { Provider } from 'react-redux';
import store from './store';
import AllLayout from './containers/allLayout';
import VinylMap from './components/VinylMapAndroid';
import { View, NativeModules, TouchableOpacity } from 'react-native';
// let vmm = NativeModules.VinylMapManager;

export default class Vinyl extends Component {
  constructor() {
    super();
    this.state = {
      longitude: undefined,
      latitude: undefined,
      toggle: false
    };
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { longitude, latitude } = position.coords;
        this.state.longitude = longitude;
        this.state.latitude = latitude;
      },
      (error) => {
        console.log(JSON.stringify(error));
      },
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
  }

  render() {
    return (
      // <Provider store={store}>
      //   <AllLayout/>
      // </Provider>
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <VinylMap
          style={{flex: 1}}
        />
        <TouchableOpacity
          style={{
            position: 'absolute',
            top: 100,
            left: 40,
            borderRadius: 5,
            height: 50,
            width: 50,
            backgroundColor: 'red'
          }}
          onPress={() => {
            // this.map.addEvent('asdf');
            // console.log(this.map);
            const { longitude, latitude } = this.state;
            console.log(longitude, latitude);
            // vmm.moveMap(String(latitude), String(longitude));
            // vmm.animateToLocation(String(latitude), String(longitude));
          }}
        />
        <TouchableOpacity
          style={{
            position: 'absolute',
            top: 100,
            right: 40,
            borderRadius: 5,
            height: 50,
            width: 50,
            backgroundColor: '#ececec'
          }}
          onPress={() => {
            const { longitude, latitude, toggle } = this.state;
            if (toggle) {
              console.log("asdf");
              // vmm.updateMarker(String(latitude), String(longitude));
            } else {
              console.log("asdffff");
              // vmm.updateMarker(String(latitude + 1), String(longitude + 1));
            }
            this.setState({toggle: !toggle});
          }}
        />
      </View>
    );
  }
}
