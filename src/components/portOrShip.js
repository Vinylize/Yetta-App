import React, { Component, PropTypes } from 'react';
import {
  Text,
  View,
  TouchableHighlight,
  Dimensions
} from 'react-native';
import {
  portNavigatorRoute,
  shipNavigatorRoute
} from '../navigator/navigatorRoutes';

const HEIGHT = Dimensions.get('window').height;

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'yellow',
    flexDirection: 'row',
    height: HEIGHT
  },
  button: {
    flex: 1,
    height: HEIGHT,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#ececec'
  }
};

export default class PortOrShip extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableHighlight
          style={[styles.button, {backgroundColor: '#ff6666'}]}
          onPress={() => this.props.navigator.push(portNavigatorRoute())}
        >
          <Text style={styles.text}>Port</Text>
        </TouchableHighlight>
        <TouchableHighlight
          style={[styles.button, {backgroundColor: '#42dcf4'}]}
          onPress={() => this.props.navigator.push(shipNavigatorRoute())}
        >
          <Text style={styles.text}>Ship</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

PortOrShip.propTypes = {
  navigator: PropTypes.any
};
