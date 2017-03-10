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
import MatrixMath from 'react-native/Libraries/Utilities/MatrixMath';

const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;

const styles = {
  rectangle: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 100,
    height: 100,
    zIndex: 100
  }
};

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
    const origin = {x: 0, y: 0, z: -50};
    let matrix = this.rotateX(dx, dy);
    this.transformOrigin(matrix, origin);
    this.refView.setNativeProps({style: {transform: [{perspective: 1000}, {matrix: matrix}]}});

    matrix = this.rotateX(dx + 180, dy);
    this.transformOrigin(matrix, origin);
    this.refViewBack.setNativeProps({style: {transform: [{perspective: 1000}, {matrix: matrix}]}});

    matrix = this.rotateX(dx + 90, dy);
    this.transformOrigin(matrix, origin);
    this.refViewRight.setNativeProps({style: {transform: [{perspective: 1000}, {matrix: matrix}]}});

    matrix = this.rotateX(dx - 90, dy);
    this.transformOrigin(matrix, origin);
    this.refViewLeft.setNativeProps({style: {transform: [{perspective: 1000}, {matrix: matrix}]}});

    matrix = this.rotateWithoutY(dx, dy - 90);
    this.transformOrigin(matrix, origin);
    this.refViewTop.setNativeProps({style: {transform: [{perspective: 1000}, {matrix: matrix}]}});

    matrix = this.rotateWithoutY(-dx, dy + 90);
    this.transformOrigin(matrix, origin);
    this.refViewBottom.setNativeProps({style: {transform: [{perspective: 1000}, {matrix: matrix}]}});
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

  transformOrigin(matrix, origin) {
    const { x, y, z } = origin;

    const translate = MatrixMath.createIdentityMatrix();
    MatrixMath.reuseTranslate3dCommand(translate, x, y, z);
    MatrixMath.multiplyInto(matrix, translate, matrix);

    const untranslate = MatrixMath.createIdentityMatrix();
    MatrixMath.reuseTranslate3dCommand(untranslate, -x, -y, -z);
    MatrixMath.multiplyInto(matrix, matrix, untranslate);
  }

  rotateX(dx, dy) {
    const radX = (Math.PI / 180) * dy;
    const cosX = Math.cos(radX);
    const sinX = Math.sin(radX);

    const radY = (Math.PI / 180) * -dx;
    const cosY= Math.cos(radY);
    const sinY = Math.sin(radY);

    return [
      cosY, sinX * sinY, cosX * sinY, 0,
      0, cosX, -sinX, 0,
      -sinY, cosY * sinX, cosX * cosY, 0,
      0, 0, 0, 1
    ];
  }

  rotateWithoutY(dx, dy) {
    const radX = (Math.PI / 180) * dx;
    const cosX = Math.cos(radX);
    const sinX = Math.sin(radX);

    const radY = (Math.PI / 180) * dy;
    const cosY= Math.cos(radY);
    const sinY = Math.sin(radY);

    return [
      cosX, -cosY * sinX, sinX * sinY, 0,
      sinX, cosX * cosY, -sinY * cosX, 0,
      0, sinY, cosY, 0,
      0, 0, 0, 1
    ];
  }

  renderLeft(color) {
    return (
      <Animated.View
        ref={component => this.refViewRight = component}
        style={[styles.rectangle, (color) ? {backgroundColor: color} : null]}
        {...this.panResponder.panHandlers}
      />
    )
  }

  renderRight(color) {
    return (
      <Animated.View
        ref={component => this.refViewLeft = component}
        style={[styles.rectangle, (color) ? {backgroundColor: color} : null]}
        {...this.panResponder.panHandlers}
      />
    )
  }

  renderFront(color) {
    return (
      <Animated.View
        ref={component => this.refView = component}
        style={[styles.rectangle, (color) ? {backgroundColor: color} : null]}
        {...this.panResponder.panHandlers}
      />
    )
  }

  renderBack(color) {
    return (
      <Animated.View
        ref={component => this.refViewBack = component}
        style={[styles.rectangle, (color) ? {backgroundColor: color} : null]}
        {...this.panResponder.panHandlers}
      />
    )
  }

  renderTop(color) {
    return (
      <Animated.View
        ref={component => this.refViewTop = component}
        style={[styles.rectangle, (color) ? {backgroundColor: color} : null]}
        {...this.panResponder.panHandlers}
      />
    )
  }

  renderBottom(color) {
    return (
      <Animated.View
        ref={component => this.refViewBottom = component}
        style={[styles.rectangle, (color) ? {backgroundColor: color} : null]}
        {...this.panResponder.panHandlers}
      />
    )
  }

  render() {
    const skew = this.state.skew.interpolate({
      inputRange: [0, 100],
      outputRange: ['0deg', '100deg']
    });
    const width = 100;
    const height = 100;
    return (
      <View style={{
        position: 'absolute',
        left: WIDTH / 2 - width / 2,
        top: HEIGHT / 2 - height / 2,
        width: width,
        height: height,
        backgroundColor: "transparent"
      }}>
        {this.renderFront('#4c72e0')}
        {this.renderBack('#8697df')}
        {this.renderLeft('#b5bce2')}
        {this.renderRight('#e5afb9')}
        {this.renderTop('#de7c92')}
        {this.renderBottom('#d1426b')}
      </View>
    );
  }
}
