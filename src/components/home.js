import React, { Component, PropTypes } from 'react';
import Relay from 'react-relay';
import {
  Text,
  View,
  TouchableHighlight
} from 'react-native';
import * as navigatorRoutes from './../navigator/navigatorRoutes';

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center'
  },
  textLogin: {
    fontSize: 20,
    textAlign: 'center'
  },
  textRegister: {
    fontSize: 20,
    textAlign: 'center'
  },
};

export class Home extends Component {
  constructor() {
    super();
    this.renderTop = this.renderTop.bind(this);
    this.renderBottom = this.renderBottom.bind(this);
  }

  handleLogin() {
    const newRoute = navigatorRoutes.loginNavigatorRoute();
    this.props.navigator.push(newRoute);
  }

  handleRegister() {
    const newRoute = navigatorRoutes.registerNavigatorRoute();
    this.props.navigator.push(newRoute);
  }

  renderTop() {
    return (
      <View style={{flex:6, backgroundColor: 'yellow', justifyContent: 'center'}}>
        <Text style={styles.welcome}>
          Hello!
        </Text>
      </View>
    )
  }

  renderBottom() {
    return (
      <View style={{flex:2}}>
        <TouchableHighlight
          style={{flex:1, backgroundColor: '#e2462b', justifyContent: 'center'}}
          onPress={this.handleLogin.bind(this)}>
          <Text style={styles.textLogin}>
            Login
          </Text>
        </TouchableHighlight>
        <TouchableHighlight
          style={{flex:1, backgroundColor: '#2b3ee5', justifyContent: 'center'}}
          onPress={this.handleRegister.bind(this)}>
          <Text style={styles.textRegister}>
            Register
          </Text>
        </TouchableHighlight>
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderTop()}
        {this.renderBottom()}
      </View>
    );
  }
}

export default Relay.createContainer(Home, {
  initialVariables: {
  },
  fragments: {
  }
});