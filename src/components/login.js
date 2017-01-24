import React, { Component, PropTypes } from 'react';
import {
  Alert,
  TextInput,
  View,
  Image,
  LayoutAnimation,
  Keyboard,
  PanResponder,
  AsyncStorage
} from 'react-native';
import * as firebase from 'firebase';
import {
  portOrShipNavigatorRoute
} from '../navigator/navigatorRoutes';

import imgTriRight from './../resources/triangle-right.png';

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
    borderWidth: 1,
    marginLeft: 24,
    marginRight: 24,
    marginBottom: 5,
    padding: 10,
    borderRadius: 4,
    borderColor: '#ececec'
  },
  loginBtn: {
    height: 0,
    width: 0,
    marginTop: 20,
    opacity: 0.9
  },
  loginBtnActive: {
    height: 70,
    width: 70,
    marginTop: 20,
    opacity: 0.9
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
    this.checkLoginBtnEnabled = this.checkLoginBtnEnabled.bind(this);
    this.handleLoginButton = this.handleLoginButton.bind(this);
    this.login = this.login.bind(this);
  }

  shouldComponentUpdate(nextState) {
    let { password, userEmail, registerOnProgress } = this.state;
    if (password !== nextState.password) {
      return true;
    }
    if (userEmail !== nextState.userEmail) {
      return true;
    }
    return (registerOnProgress !== nextState.registerOnProgress);
  }

  componentWillMount() {
    this.loginBtnPanResponder = PanResponder.create({
      onStartShouldSetPanResponder: this.loginBtnHandleStartShouldSetPanResponder,
      onPanResponderGrant: this.loginBtnHandlePanResponderGrant.bind(this)
    });
  }

  loginBtnHandleStartShouldSetPanResponder() {
    return true;
  }
  loginBtnHandlePanResponderGrant() {
    this.handleLoginButton();
  }

  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }

  checkLoginBtnEnabled() {
    return (this.state.userEmail && this.state.password);
  }

  login(email, password) {
    return new Promise(resolve => {
      resolve(firebase.auth().signInWithEmailAndPassword(email, password));
    });
  }

  handleLoginButton() {
    if (this.checkLoginBtnEnabled()) {
      console.log(this.state);
      this.login(this.state.userEmail, this.state.password).then((res) => {
        console.log(res);
        console.log(firebase.auth().currentUser);
        firebase.auth().currentUser.getToken()
          .then(token => {
            console.log(token);
            return AsyncStorage.setItem('token', token);
          })
          .then(this.props.navigator.push(portOrShipNavigatorRoute()));
      }
      ).catch(console.log);
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
    } else {
      Alert.alert(
        'OMG, TYPE SOMETHING'
      );
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          ref='inputPassword'
          style={styles.textInput}
          onChangeText={(text) => this.setState({password: text})}
          value={this.state.password}
          placeholder={'password'}
          placeholderTextColor={'#f78585'}
          onSubmitEditing={Keyboard.dismiss}
        />
        <TextInput
          ref='inputEmail'
          style={styles.textInput}
          onChangeText={(text) => this.setState({userEmail: text})}
          value={this.state.userEmail}
          placeholder={'email'}
          placeholderTextColor={'#f78585'}
          onSubmitEditing={Keyboard.dismiss}
        />
        <View {...this.loginBtnPanResponder.panHandlers}>
          <Image
            style={(this.checkLoginBtnEnabled()) ? styles.loginBtnActive : styles.loginBtn}
            source={imgTriRight}
          />
        </View>
      </View>
    );
  }
}

Login.propTypes = {
  navigator: PropTypes.any
};
