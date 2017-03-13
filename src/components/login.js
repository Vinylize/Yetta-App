import React, { Component, PropTypes } from 'react';
import {
  Text,
  TextInput,
  View,
  Keyboard,
  TouchableOpacity
} from 'react-native';
import * as firebase from 'firebase';
import { URL, handleError, handleFirebaseSignInError } from './../utils';
import {
  registerNavigatorRoute,
  homeNavigatorRoute,
  phoneVerificationNavigatorRoute
} from './../navigator/navigatorRoutes';
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

  componentWillMount() {
    this.fireBaseListener = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log('found user');
        firebase.auth().getToken().then(console.log);
        // this.props.navigator.push(portOrShipNavigatorRoute());
        // remove this listener after login
        this.fireBaseListener && this.fireBaseListener();
        this.props.navigator.replace(homeNavigatorRoute());
      } else {
        // TBD
      }
    });
  }

  checkLoginBtnEnabled() {
    return (this.state.userEmail && this.state.password);
  }

  // observeShipLocation() {
  //   firebase.database().ref('/userProperties/coordinate').child('voMxBx91EYPx5wWpnS70f9sYQTC2').on('value',
  //   (childSnapshot, prevChildKey) => console.log(childSnapshot.val(), prevChildKey));
  // }

  checkIfPhoneValid(token) {
    console.log(token);
    client._transport._httpOptions.headers = {
      authorization: token
    };
    return client.query(`{
      viewer{
        isPhoneValid,
        email,
        name
      }
    }`);
  }

  login(email, password) {
    return firebase.auth().signInWithEmailAndPassword(email, password)
      .then(this.getToken.bind(this))
      .catch(handleFirebaseSignInError);
  }

  getToken() {
    firebase.auth().currentUser.getToken()
      .then(this.checkIfPhoneValid.bind(this))
      .then(res => res.viewer.isPhoneValid)
      .then(this.navigateScene.bind(this))
      .catch(handleError);
  }

  navigateScene(valid) {
    if (valid === true) {
      this.props.navigator.replace(homeNavigatorRoute());
    } else {
      this.props.navigator.push(phoneVerificationNavigatorRoute());
    }
  }

  handleLoginButton() {
    if (this.checkLoginBtnEnabled()) {
      this.login(this.state.userEmail, this.state.password);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          ref='inputEmail'
          style={styles.textInput}
          onChangeText={(text) => this.setState({userEmail: text})}
          value={this.state.userEmail}
          placeholder={'email'}
          onSubmitEditing={Keyboard.dismiss}
        />
        <TextInput
          ref='inputPassword'
          style={styles.textInput}
          onChangeText={(text) => this.setState({password: text})}
          value={this.state.password}
          placeholder={'password'}
          onSubmitEditing={Keyboard.dismiss}
        />
        <View style={{
          height: 40,
          marginLeft: 24,
          marginRight: 24,
          marginBottom: 12,
          flexDirection: 'row'
        }}>
          <TouchableOpacity
            style={styles.textInput}
            onPress={this.handleLoginButton.bind(this)}
          >
            <Text>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.textInput}
            onPress={() => this.props.navigator.push(registerNavigatorRoute())}
          >
            <Text>Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

Login.propTypes = {
  navigator: PropTypes.any
};
