import React, { Component } from 'react';
import { Provider } from 'react-redux';
import store from './store';
import { View, NativeModules, TouchableOpacity, Platform } from 'react-native';
import AllLayout from './containers/allLayout';

export default class Vinyl extends Component {
  render() {
    return (
      <Provider store={store}>
        <AllLayout/>
      </Provider>
      // <View style={{flex: 1, backgroundColor: 'white'}}>
      //   {(Platform.OS === 'ios') ?
      //     <VinylMapIOS style={{flex: 1}}/> :
      //     <VinylMapAndroid style={{flex: 1}}/>
      //   }
      //   <TouchableOpacity
      //     style={{
      //       position: 'absolute',
      //       top: 100,
      //       left: 40,
      //       borderRadius: 5,
      //       height: 50,
      //       width: 50,
      //       backgroundColor: 'red'
      //     }}
      //     onPress={() => {
      //       // this.map.addEvent('asdf');
      //       // console.log(this.map);
      //       const { longitude, latitude } = this.state;
      //       console.log(longitude, latitude);
      //       // vmm.moveMap(String(latitude), String(longitude));
      //       // vmm.animateToLocation(String(latitude), String(longitude));
      //     }}
      //   />
      //   <TouchableOpacity
      //     style={{
      //       position: 'absolute',
      //       top: 100,
      //       right: 40,
      //       borderRadius: 5,
      //       height: 50,
      //       width: 50,
      //       backgroundColor: '#ececec'
      //     }}
      //     onPress={() => {
      //       const { longitude, latitude, toggle } = this.state;
      //       if (toggle) {
      //         console.log("asdf");
      //         // vmm.updateMarker(String(latitude), String(longitude));
      //       } else {
      //         console.log("asdffff");
      //         // vmm.updateMarker(String(latitude + 1), String(longitude + 1));
      //       }
      //       this.setState({toggle: !toggle});
      //     }}
      //   />
      // </View>
    );
  }
}
