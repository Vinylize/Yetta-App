import React, { Component, PropTypes } from 'react';
import {
  Alert,
  Text,
  TextInput,
  View,
  Keyboard,
  TouchableOpacity
} from 'react-native';
import { URL } from './../utils';

const Lokka = require('lokka').Lokka;
const Transport = require('lokka-transport-http').Transport;

const client = new Lokka({
  transport: new Transport(URL)
});

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
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
    marginLeft: 24,
    marginRight: 24,
    marginBottom: 12,
    padding: 10,
    borderRadius: 4,
    backgroundColor: 'white',
    shadowOffset: {height: 0.2, width: 0.2},
    shadowOpacity: 0.2
  },
  registerBtn: {
    height: 0,
    width: 0,
    marginTop: 20,
    opacity: 0.9
  },
  registerBtnActive: {
    height: 70,
    width: 70,
    marginTop: 20,
    opacity: 0.9
  }
};

export default class Register extends Component {
  constructor() {
    super();
    this.state = {
      userName: undefined,
      password: undefined,
      userEmail: undefined
    };
  }

  registerHelper(email, name, password) {
    client.mutate(`{
      createUser(
        input:{
          email: "${email}",
          name: "${name}",
          password: "${password}"
        }
      ) {
        result
      }
    }`
    ).then(response => {
      // todo: handle errors on register
      console.log(response);
    }).catch((error) => {
      const { rawError } = error;
      if (rawError) {
        const { message } = rawError[0];
        Alert.alert(
          message
        );
      }
      // console.log(error);
    });
  }

  register(email, name, password) {
    return new Promise(resolve => {
      resolve(this.registerHelper(email, name, password));
    });
  }

  handleRegisterButton() {
    const { userName, password, userEmail } = this.state;
    if (userName && password && userEmail) {
      this.register(userEmail, userName, password);
      // todo: determine what to do after register completion
      // this.props.goToLogin();
    } else {
      Alert.alert(
        'OMG, TYPE SOMETHING'
      );
    }
  }

  checkTextInputAllFilled() {
    let { userName, password, userEmail } = this.state;
    return (userName && password && userEmail);
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.textInput}
          onChangeText={(text) => this.setState({userEmail: text})}
          value={this.state.userEmail}
          placeholder={'email'}
          onSubmitEditing={Keyboard.dismiss}
        />
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
          onSubmitEditing={Keyboard.dismiss}
        />
        <TouchableOpacity
          style={styles.textInput}
          onPress={this.handleRegisterButton.bind(this)}
        >
          <Text>register</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

Register.propTypes = {
  navigator: PropTypes.any,
  goToLogin: PropTypes.func
};
