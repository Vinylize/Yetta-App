import React, { Component, PropTypes } from 'react';
import Relay from 'react-relay';
import {
  Alert,
  Text,
  TextInput,
  View,
  TouchableHighlight
} from 'react-native';
import { register } from './../auth/auth';

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
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
    borderWidth: 1
  }
};

export class Register extends Component {
  static propTypes = {
    Users: PropTypes.Object
  };

  constructor() {
    super();
    this.state = {
      userName: undefined,
      password: undefined,
      userEmail: undefined
    }
  }

  handleRegisterButton() {
    if (this.state.userName && this.state.password && this.state.userEmail) {
      register(this.state.userEmail, this.state.userName, this.state.password);
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
          onChangeText={(text) => this.setState({userName: text})}
          value={this.state.userName}
          placeholder={'type your name!'}
        />
        <TextInput
          style={styles.textInput}
          onChangeText={(text) => this.setState({password: text})}
          value={this.state.password}
          placeholder={'password'}
        />
        <TextInput
          style={styles.textInput}
          onChangeText={(text) => this.setState({userEmail: text})}
          value={this.state.userEmail}
          placeholder={'email'}
        />
        <TouchableHighlight onPress={this.handleRegisterButton.bind(this)}>
          <Text>Register</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

export default Relay.createContainer(Register, {
  initialVariables: {
    orderBy: null
  },
  fragments: {
    Users: () => {
      return Relay.QL `
          fragment on User {
              _id,
              email,
              name,
              createdAt
          }
      `;
    }
  }
});
