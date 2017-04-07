import React, { Component, PropTypes } from 'react';
import {
  Text,
  TextInput,
  View,
  Keyboard,
  TouchableOpacity,
  Dimensions,
  Image
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

const WIDTH = Dimensions.get('window').width;

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  logo: {
    height:70,
    resizeMode:'contain',
    marginLeft:30,
    marginTop:50,
    marginBottom:80,
  },
  textInputContainer: {
    width: WIDTH * 0.75,
    borderBottomWidth: 1,
    borderBottomColor: '#ff9700',
    paddingTop: 30,
    height: 70
  },
  textInput: {
    height: 20,
    marginBottom: 10,
    marginLeft: 10,
    fontSize: 17,
    fontWeight: '600',
    color: 'black',
    padding: 0
  },
  loginBtn: {
    width: WIDTH * 0.75,
    height: 50,
    marginTop:70,
    borderWidth: 1.5,
    borderColor: '#ff9700',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loginBtnText: {
    color:'#ff9700',
    fontSize: 15,
    fontWeight: '700'
  },
  footer: {
    height: 50,
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row'
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
        <Image style={styles.logo} source={require('../../assets/logo.png')} />
        <View
           style={styles.textInputContainer}
        >
          <TextInput
            ref='inputEmail'
            style={styles.textInput}
            onChangeText={(text) => this.setState({userEmail: text})}
            value={this.state.userEmail}
            placeholder={'Email address'}
            onSubmitEditing={Keyboard.dismiss}
            autoCapitalize={'none'}
            underlineColorAndroid={'white'}
          />
        </View>
        <View
          style={styles.textInputContainer}
        >
          <TextInput
            ref='inputPassword'
            style={styles.textInput}
            onChangeText={(text) => this.setState({password: text})}
            value={this.state.password}
            placeholder={'Password'}
            onSubmitEditing={Keyboard.dismiss}
            autoCapitalize={'none'}
            secureTextEntry={true}
            underlineColorAndroid={'white'}
          />
        </View>
        <View style={{
        }}>
          <TouchableOpacity
            style={{marginTop: 26, width: WIDTH * 0.75, alignItems: 'flex-end'}}
            onPress={() => this.props.navigator.push(registerNavigatorRoute())}
          >
            <Text style={{color: '#aaa', fontWeight: '600', fontSize: 13}}>Forgot your password?</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.loginBtn}
          onPress={this.handleLoginButton.bind(this)}
        >
          <Text
            style={styles.loginBtnText}
          >Login</Text>
        </TouchableOpacity>
        <View style={styles.footer}>
          <Text
            style={{fontWeight: '500', color: '#bbb'}}
          >You don't have an account yet? </Text>
          <TouchableOpacity
            onPress={() => this.props.navigator.push(registerNavigatorRoute())}
          >
            <Text
              style={{fontWeight: '600',color:'#ff9700'}}
            >Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

Login.propTypes = {
  navigator: PropTypes.any
};
