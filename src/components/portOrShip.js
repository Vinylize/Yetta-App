import React, { Component, PropTypes } from 'react';
import {
  Text,
  View,
  TouchableHighlight,
  Dimensions,
  LayoutAnimation
} from 'react-native';
import Map from './map';

const HEIGHT = Dimensions.get('window').height;
const SCENE_CONSTANT = {
  PORT: 'PORT',
  SHIP: 'SHIP',
  MAP: 'MAP',
  LIST: 'LIST'
};

const styles = {
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  button: {
    flex: 1,
    height: 40,
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
    this.state = {
      portOrShip: SCENE_CONSTANT.PORT,
      clicked: false
    };
  }

  shouldComponentUpdate(nextState) {
    if (this.state.portOrShip !== nextState.portOrShip) {
      return true;
    }
    if (this.state.clicked !== nextState.clicked) {
      return true;
    }
    return false;
  }

  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }

  renderHeader() {
    return (
      <View style={styles.container}>
        <TouchableHighlight
          style={[styles.button, {backgroundColor: '#ff6666', height: (this.state.clicked) ? 40 : HEIGHT}]}
          onPress={() => {
            this.setState({portOrShip: SCENE_CONSTANT.PORT});
            if (!this.state.clicked) {
              LayoutAnimation.easeInEaseOut();
              this.setState({clicked: true});
            }
          }}
        >
          <Text style={styles.text}>Port</Text>
        </TouchableHighlight>
        <TouchableHighlight
          style={[styles.button, {backgroundColor: '#42dcf4', height: (this.state.clicked) ? 40 : HEIGHT}]}
          onPress={() => {
            this.setState({portOrShip: SCENE_CONSTANT.SHIP});
            if (!this.state.clicked) {
              LayoutAnimation.easeInEaseOut();
              this.setState({clicked: true});
            }
          }}
        >
          <Text style={styles.text}>Ship</Text>
        </TouchableHighlight>
      </View>
    );
  }

  handleBtnListOrMap() {
    const currentScene = (this.state.listOrMap === SCENE_CONSTANT.MAP) ? SCENE_CONSTANT.LIST : SCENE_CONSTANT.MAP;
    this.setState({currentScene});
  }

  renderBody() {
    return (
      <View style={{flex: 1}}>
        <Map
          currentScene={this.state.portOrShip}
          handleBtnSwitch={this.handleBtnListOrMap.bind(this)}
        />
      </View>
    );
  }

  render() {
    return (
      <View style={{flex: 1, flexDirection: 'column'}}>
        {this.renderHeader()}
        {this.renderBody()}
      </View>
    );
  }
}

PortOrShip.propTypes = {
  navigator: PropTypes.any
};
