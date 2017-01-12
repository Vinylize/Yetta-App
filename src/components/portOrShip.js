import React, { Component, PropTypes } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  LayoutAnimation
} from 'react-native';
import Map from './map';

const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;

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
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#ececec',
    alignSelf: 'center'
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
    let { clicked, portOrShip } = this.state;
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: '#ff6666',
              height: (clicked) ? 40 : HEIGHT,
              flex: (clicked && portOrShip === SCENE_CONSTANT.PORT) ? 3 : 1
            }
          ]}
          onPress={() => {
            LayoutAnimation.easeInEaseOut();
            this.setState({portOrShip: SCENE_CONSTANT.PORT});
            if (!this.state.clicked) {
              this.setState({clicked: true});
            }
          }}
          activeOpacity={1}
        >
          <Text style={styles.text}>Port</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: '#42dcf4',
              height: (clicked) ? 40 : HEIGHT,
              flex: (clicked && portOrShip === SCENE_CONSTANT.SHIP) ? 3 : 1
            }
          ]}
          onPress={() => {
            LayoutAnimation.easeInEaseOut();
            this.setState({portOrShip: SCENE_CONSTANT.SHIP});
            if (!this.state.clicked) {
              this.setState({clicked: true});
            }
          }}
          activeOpacity={1}
        >
          <Text style={styles.text}>Ship</Text>
        </TouchableOpacity>
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
