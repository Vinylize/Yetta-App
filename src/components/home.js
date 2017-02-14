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
  TouchableOpacity,
  Animated
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
      toggle: false,
      longitude: undefined,
      latitude: undefined,
      menuClicked: false,
      shrinkValue: new Animated.Value(1),
      markerTest: false
    };
  }

  componentDidMount() {
    // if (this.state.first) {
    //   firebase.auth().onAuthStateChanged((user) => {
    //     if (user) {
    //       // firebase.auth().getToken().then(console.log);
    //       this.props.navigator.push(portOrShipNavigatorRoute());
    //     } else {
    //       // TBD
    //     }
    //   });
    // }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { longitude, latitude } = position.coords;
        this.setState({
          longitude: longitude,
          latitude: latitude
        });
      },
      (error) => {
        console.log(JSON.stringify(error));
      },
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
  }

  renderMap() {
    if (Platform.OS === 'ios') {
      return (
        <VinylMapIOS
          style={{flex: 1}}
          onPress={(e) => {
            console.log(e.nativeEvent);
          }}
          onMarkerPress={(e) => {
            console.log(e.nativeEvent);
          }}
        />
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
        height: 30,
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
              height: 31 - 5,
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

  renderLocationBtn() {
    return (
      <TouchableOpacity
        style={{
          position: 'absolute',
          right: 26,
          bottom: 80,
          height: 25,
          width: 25,
          borderRadius: 20,
          backgroundColor: '#2E3031',
          shadowOffset: {height: 1, width: 1},
          shadowOpacity: 0.2
        }}
        activeOpacity={0.8}
        onPress={() => {
          const { latitude, longitude } = this.state;
          vmm.animateToLocation(String(latitude), String(longitude));
        }}
      >

      </TouchableOpacity>
    )
  }

  renderMenu() {
    const { menuClicked } = this.state;
    return (
      <TouchableOpacity
        style={{
          position: 'absolute',
          left: 20,
          top: 46,
          backgroundColor: 'transparent',
          width: 24,
          height: 20
        }}
        onPress={() => {
          LayoutAnimation.easeInEaseOut();
          this.setState({menuClicked: !menuClicked});
          if (this.state.menuClicked) {
            this.animateBack();
          } else {
            this.animateShrink();
          }
        }}
        activeOpacity={1}
      >
        <View style={(menuClicked) ? {
          position: 'absolute',
          left: 0,
          top: 0,
          width: 15,
          height: 3,
          backgroundColor: '#2E3031',
          transform: [{rotate: '45deg'}]
          } : {
          position: 'absolute',
          left: 0,
          top: 0,
          width: 24,
          height: 3,
          backgroundColor: '#2E3031',
        }}/>
        <View style={(menuClicked) ? {
          position: 'absolute',
          left: 9,
          top: 0,
          width: 15,
          height: 3,
          backgroundColor: '#2E3031',
          transform: [{rotate: '-45deg'}]
          } : {
          position: 'absolute',
          left: 0,
          top: 7,
          width: 24,
          height: 3,
          backgroundColor: '#2E3031',
        }}/>
        <View style={(menuClicked) ? {
          position: 'absolute',
          left: 4.5,
          top: 12,
          width: 15,
          height: 3,
          backgroundColor: '#2E3031',
          transform: [{rotate: '90deg'}]
          } : {
          position: 'absolute',
          left: 0,
          top: 14,
          width: 24,
          height: 3,
          backgroundColor: '#2E3031',
        }}/>
      </TouchableOpacity>
    )
  }

  animateShrink() {
    this.state.shrinkValue.setValue(1);
    Animated.timing(
      this.state.shrinkValue,
      {
        toValue: 0.7,
        duration: 100
      }
    ).start();
  }

  animateBack() {
    this.state.shrinkValue.setValue(0.7);
    Animated.timing(
      this.state.shrinkValue,
      {
        toValue: 1,
        duration: 100
      }
    ).start();
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#2E3031'}}>
        <Animated.View style={(this.state.menuClicked) ? {
          flex: 1, left: 20, transform: [{scale: this.state.shrinkValue}]
          } : {flex: 1, transform: [{scale: this.state.shrinkValue}]}}>
          {this.renderMap()}
          {this.renderMenu()}
          {this.renderSwitch()}
          {this.renderSearchBar()}
          {this.renderLocationBtn()}
          <TouchableOpacity
            style={{
              position: 'absolute',
              right: 20,
              bottom: 20,
              height: 40,
              width: 40,
              borderRadius: 50,
              backgroundColor: 'white',
              shadowOffset: {height: 1, width: 2},
              shadowOpacity: 0.23
            }}
            onPress={() => {
              const { markerTest, latitude, longitude } = this.state;
              if (markerTest) {
                vmm.updateMarker(String(latitude), String(longitude));
              } else {
                vmm.updateMarker(String(latitude + 1), String(longitude + 1));
                vmm.addMarker(String(latitude - 0.5), String(longitude), 'testing marker 01');
              }
              this.setState({markerTest: !markerTest});
            }}
          />
        </Animated.View>
      </View>
    );
  }
}

Home.propTypes = {
  navigator: PropTypes.any
};
