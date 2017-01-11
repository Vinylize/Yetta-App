import React, { Component, PropTypes } from 'react';
import {
  AsyncStorage,
  Alert,
  Text,
  TextInput,
  View,
  TouchableHighlight
} from 'react-native';
import {
  portOrShipNavigatorRoute
} from '../navigator/navigatorRoutes';

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5
  },
  textInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginLeft: 24,
    marginRight: 24,
    marginBottom: 5,
    padding: 10
  }
};

export default class Login extends Component {
  constructor() {
    super();
    this.state = {
      password: undefined,
      userEmail: undefined,
      registerOnProgress: false
    };
  }

  shouldComponentUpdate(nextState) {
    if (this.state.password !== nextState.password) {
      return true;
    }
    if (this.state.userEmail !== nextState.userEmail) {
      return true;
    }
    if (this.state.registerOnProgress !== nextState.registerOnProgress) {
      return true;
    }
    return false;
  }

  handleLoginButton() {
    if (this.state.userEmail && this.state.password) {
      console.log(this.state);
      // login(this.state.userEmail, this.state.password)
      //   .then(data => {
      //     if (data && data.accessToken) {
      //       return data.accessToken;
      //     }
      //     throw Error(data);
      //   })
      //   .then(token => AsyncStorage.setItem('accessToken', token))
      //   .then(() => this.props.navigator.push(portOrShipNavigatorRoute()))
      //   .catch(console.log);
      this.props.navigator.push(portOrShipNavigatorRoute());
    }
    else {
      Alert.alert(
        'OMG, TYPE SOMETHING'
      );
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.textInput}
          onChangeText={(text) => this.setState({password: text})}
          value={this.state.password}
          placeholder={'password'}
          placeholderTextColor={'#f78585'}
        />
        <TextInput
          style={styles.textInput}
          onChangeText={(text) => this.setState({userEmail: text})}
          value={this.state.userEmail}
          placeholder={'email'}
          placeholderTextColor={'#f78585'}
        />
        <TouchableHighlight onPress={this.handleLoginButton.bind(this)}>
          <Text>Login</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

Login.propTypes = {
  navigator: PropTypes.any
};
