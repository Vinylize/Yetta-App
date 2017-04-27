import React, { Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import {
  Image,
  Text,
  View,
  Dimensions,
  StyleSheet,
  LayoutAnimation,
  UIManager
} from 'react-native';

// const Lokka = require('lokka').Lokka;
// const Transport = require('lokka-transport-http').Transport;
//
// const client = new Lokka({
//   transport: new Transport(URL)
// });

const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;

UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

const styles = {
  container: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: WIDTH,
    height: HEIGHT,
    backgroundColor: '#f9f9f9',
    elevation: 50,
    zIndex: 1
  }
};

export default class RunnerView extends Component {
  constructor() {
    super();
  }

  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }

  render() {
    return (
      <View style={[styles.container,
        {top: (this.props.isRunner) ? 0 : HEIGHT}]}>

      </View>
    );
  }
}

RunnerView.propTypes = {
  navigator: PropTypes.any,
  isRunner: PropTypes.bool.isRequired
};
