import React, { Component, PropTypes } from 'react';
import {
  Alert,
  TextInput,
  View,
  Image,
  LayoutAnimation,
  Keyboard,
  PanResponder,
  Dimensions,
  Animated,
  Easing,
  Text,
  TouchableOpacity,
  ListView
} from 'react-native';
import {APIKEY} from './../utils';

const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;

export default class Experimental extends Component {
  constructor() {
    super();
    this.state = {
      moving: false,
      skew: new Animated.Value(0)
    };
  }

  componentWillMount() {
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: this.handlePanResponderGrant.bind(this),
      onPanResponderMove: this.handlePanResponderMove.bind(this),
      onPanResponderRelease: this.handlePanResponderRelease.bind(this)
    });
  }

  handlePanResponderGrant () {
    //this.refView.setNativeProps({style: {transform: [{scale: 0.4}]}});
  }

  handlePanResponderMove (e, gestureState) {
    const {dx, dy} = gestureState;
    const y = `${dx}deg`;
    const x = `${dy}deg`;
    this.refView.setNativeProps({style: {transform: [{skewY: x}]}});

  }

  handlePanResponderRelease (e, gestureState) {
    const {dx, dy} = gestureState;
    console.log(dy);
    this.state.skew.setValue(dy);
    Animated.timing(
      this.state.skew,
      {
        toValue: 0,
        duration: 1000,
        easing: Easing.linear
      }
    ).start(() => {
    });
  }

  rotate(deg) {
    const rad = (Math.PI / 180) * deg;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    return [

    ];
  }

  render() {
    const skew = this.state.skew.interpolate({
      inputRange: [0, 100],
      outputRange: ['0deg', '100deg']
    });
    const width = 100;
    const height = 50;
    return (
      <Animated.View
        ref={component => this.refView = component}
        style={{
          position: 'absolute',
          left: WIDTH / 2 - width / 2,
          top: HEIGHT / 2 - height / 2,
          width: width,
          height: height,
          backgroundColor: "grey",
          shadowOffset: {height: 1, width: 2},
          shadowOpacity: 0.5,
          transform: [{perspective: 850}, {rotateX: "50deg"}]

        }}
        {...this.panResponder.panHandlers}
      >

      </Animated.View>
    );
  }
}
