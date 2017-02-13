import React, { Component, PropTypes } from 'react';
import {
  Text,
  View,
  Dimensions,
  LayoutAnimation,
  Keyboard,
  PanResponder,
  Platform,
  NativeModules,
  TextInput,
  TouchableOpacity
} from 'react-native';
import * as firebase from 'firebase';
import {
  portOrShipNavigatorRoute
} from '../navigator/navigatorRoutes';
import VinylMapAndroid from './VinylMapAndroid';
import VinylMapIOS from './VinylMapIOS';
let vmm = NativeModules.VinylMapManager;

const styles = {
  container: {
    flex: 1
  }
};

const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;

export default class Home extends Component {
  constructor() {
    super();
    this.state = {
      text: '',
      toggle: false
    };
  }

  componentDidMount() {
    if (this.state.first) {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          // firebase.auth().getToken().then(console.log);
          this.props.navigator.push(portOrShipNavigatorRoute());
        } else {
          // TBD
        }
      });
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { longitude, latitude } = position.coords;
        this.setState({
          center: {
            longitude,
            latitude
          },
          gotUserLocation: true
        });
      },
      (error) => {
        console.log(JSON.stringify(error));
        this.setState({gotUserLocation: true});
      },
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
  }

  renderMap() {
    if (Platform.OS === 'ios') {
      return (
        <VinylMapIOS style={{flex: 1}}/>
      )
    }
    return (
      <VinylMapAndroid style={{flex: 1}}/>
    )
  }

  renderSearchBar() {
    return (
      <View style={{
        position: 'absolute',
        left: (WIDTH - WIDTH * 0.8) / 2,
        top: 100,
        width: WIDTH * 0.8,
        height: 40,
        backgroundColor: 'white',
        shadowOffset: {height: 1, width: 1},
        shadowOpacity: 0.2,
        flexDirection: 'row'
      }}>
        <View style={{flex: 1}}>

        </View>
        <View style={{flex: 10}}>
          <TextInput
            style={{height: 40, borderColor: 'gray', borderWidth: 0}}
            onChangeText={(text) => this.setState({text})}
            value={this.state.text}
          />
        </View>
      </View>
    )
  }

  renderSwitch() {
    const { toggle } = this.state;
    return (
      <View style={{
        position: 'absolute',
        left: (WIDTH - WIDTH * 0.5) / 2,
        top: 40,
        width: WIDTH * 0.5,
        height: 35,
        backgroundColor: '#75797a',
        borderRadius: 20,
        shadowOffset: {height: 1, width: 1},
        shadowOpacity: 0.2
      }}>
        <TouchableOpacity
          style={{
            flex: 1,
            justifyContent: 'center',
            flexDirection: 'row'
          }}
          onPress={() => {
            LayoutAnimation.easeInEaseOut();
            this.setState({toggle: !toggle});
          }}
          activeOpacity={1}
        >
          <View style={[{
              position: 'absolute',
              top: 2,
              width: WIDTH * 0.25,
              height: 31,
              backgroundColor: 'white',
              borderRadius: 20,
          }, (toggle) ? {right: 4} : {left: 4}]}/>
          <View style={{
            flex: 1,
            backgroundColor: 'transparent',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Text style={{color: (toggle) ? 'white' : '#75797a'}}>Port</Text>
          </View>
          <View style={{
            flex: 1,
            backgroundColor: 'transparent',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Text style={{color: (toggle) ? '#75797a' : 'white'}}>Ship</Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderMap()}
        {this.renderSwitch()}
        {this.renderSearchBar()}
      </View>
    );
  }
}

Home.propTypes = {
  navigator: PropTypes.any
};
