import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  findNodeHandle,
  Text,
  TextInput,
  View,
  Keyboard,
  TouchableOpacity,
  Dimensions,
  Image,
  NativeModules,
  Platform
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import * as firebase from 'firebase';

import GlobalLoading from './globalViews/loading';

import { setUser } from '../actions/authActions';
import { URL, handleFirebaseSignInError } from './../utils';
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
    alignItems: 'center'
  },
  logo: {
    height: 45,
    marginTop: 50,
    marginBottom: 100
  },
  textInputContainer: {
    width: WIDTH * 0.75,
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    paddingTop: 30,
    height: 63
  },
  textInput: {
    height: 24,
    marginBottom: 9,
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '500',
    color: '#FFF',
    padding: 0
  },
  loginBtn: {
    width: WIDTH * 0.75,
    height: 50,
    marginTop: 52,
    borderWidth: 1.5,
    backgroundColor: '#fff',
    borderColor: '#ff9700',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loginBtnText: {
    color: '#ff9700',
    fontSize: 16,
    fontWeight: '900'
  },
  footer: {
    height: 50,
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row'
  },
  linearGradient: {
    flex: 1
  }
};

class Login extends Component {
  constructor() {
    super();
    this.state = {
      password: undefined,
      userEmail: undefined,
      registerOnProgress: false,
      busyWaiting: false
    };
  }

  componentWillMount() {
    this.fireBaseListener = firebase.auth().onAuthStateChanged((user) => {
      this.fireBaseListener && this.fireBaseListener();
      if (user) {
        this.showLoading();
        this.internalAuth();
      } else {
        // TBD
      }
    });
  }

  showLoading() {
    this.setState(() => {
      return {busyWaiting: true};
    });
  }

  hideLoading() {
    this.setState(() => {
      return {busyWaiting: false};
    });
  }

  checkLoginBtnEnabled() {
    return (this.state.userEmail && this.state.password);
  }

  // observeShipLocation() {
  //   firebase.database().ref('/userProperties/coordinate').child('voMxBx91EYPx5wWpnS70f9sYQTC2').on('value',
  //   (childSnapshot, prevChildKey) => console.log(childSnapshot.val(), prevChildKey));
  // }

  getFCMToken() {
    // this is for readability
    const iOSFCMManager = NativeModules.YettaFCMManager;
    const AndroidFCMManager = NativeModules.YettaFCMManager;

    if (Platform.OS === 'ios') {
      iOSFCMManager.getToken((error, events) => {
        if (error) {
          // todo: handle error or edge cases
          console.log(error);
        } else {
          console.log(events);
          this.userUpdateDeviceToken(events[0]);
        }
      });
    } else if (Platform.OS === 'android') {
      AndroidFCMManager.getToken(
        (msg) => {
          console.log(msg);
        },
        (FCMToken) => {
          console.log(FCMToken);
          this.userUpdateDeviceToken(FCMToken);
        }
      );
    }
  }

  queryUser(token) {
    return new Promise((resolve, reject) => {
      client._transport._httpOptions.headers = {
        authorization: token
      };
      client.query(`{
      viewer{
        isPV,
        e,
        n,
        p
      }
    }`)
        .then(({viewer}) => {
          this.props.setUser(viewer);
          this.hideLoading();
          return resolve(viewer);
        })
        .catch(e => {
          this.hideLoading();
          return reject(e);
        });
    });
  }

  userUpdateDeviceToken(token) {
    client.mutate(`{
      userUpdateDeviceToken(
        input:{
          dt: "${token}"
        }
      ) {
        result
      }
    }`)
      .then(console.log)
      .catch(console.log);
  }

  internalAuth() {
    firebase.auth().currentUser.getToken()
      .then(this.queryUser.bind(this))
      .then((viewer) => {
        this.hideLoading();
        this.getFCMToken();
        if (viewer.isPV) {
          this.navigateToHome();
        } else {
          this.navigateToPhoneVerification();
        }
      })
      .catch(console.log);
  }

  login(email, password) {
    return firebase.auth().signInWithEmailAndPassword(email, password)
      .then(this.internalAuth.bind(this))
      .catch(e => {
        this.hideLoading();
        handleFirebaseSignInError(e);
      });
  }

  navigateToHome() {
    this.props.navigator.replace(homeNavigatorRoute());
  }

  navigateToPhoneVerification() {
    this.props.navigator.replace(homeNavigatorRoute());
    this.props.navigator.push(phoneVerificationNavigatorRoute());
  }

  handleLoginButton() {
    if (this.checkLoginBtnEnabled()) {
      this.showLoading();
      this.login(this.state.userEmail, this.state.password);
    }
  }

  render() {
    return (
      <LinearGradient
        ref={component => {
          this.refViewContainer = component;
        }}
        onLayout={() => {
          this.setState({ refViewForBlurView: findNodeHandle(this.refViewContainer) });
        }}
        colors={['#ffba56', '#ff9700']}
        style={styles.linearGradient}
      >
        <View style={styles.container}>
          <Image style={styles.logo} source={require('../../assets/logo.png')} />
          <View style={styles.textInputContainer}>
            <TextInput
              ref='inputEmail'
              style={styles.textInput}
              onChangeText={(text) => this.setState({userEmail: text})}
              value={this.state.userEmail}
              placeholderTextColor={'#fff'}
              placeholder={'이메일주소'}
              onSubmitEditing={Keyboard.dismiss}
              autoCapitalize={'none'}
              underlineColorAndroid={'transparent'}
            />
          </View>
          <View style={styles.textInputContainer}>
            <TextInput
              ref='inputPassword'
              style={styles.textInput}
              onChangeText={(text) => this.setState({password: text})}
              value={this.state.password}
              placeholderTextColor={'#fff'}
              placeholder={'비밀번호'}
              onSubmitEditing={Keyboard.dismiss}
              autoCapitalize={'none'}
              secureTextEntry={true}
              underlineColorAndroid={'transparent'}
            />
          </View>
          <View>
            <TouchableOpacity
              style={{marginTop: 14, width: WIDTH * 0.75, alignItems: 'flex-end'}}
              onPress={() => this.props.navigator.push(registerNavigatorRoute())}
            >
              <Text style={{color: '#FFF', fontWeight: '500', fontSize: 12}}>비밀번호를 잊으셨나요?</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={this.handleLoginButton.bind(this)}
          >
            <Text style={styles.loginBtnText}>Login</Text>
          </TouchableOpacity>
          <View style={styles.footer}>
            <Text
              style={{fontSize: 14, fontWeight: '500', color: '#fee5c0'}}
            >아직 회원이 아니신가요? </Text>
            <TouchableOpacity onPress={() => this.props.navigator.push(registerNavigatorRoute())}>
              <Text style={{marginTop: 1, fontSize: 14, fontWeight: '500', color: '#FFF'}}>회원가입</Text>
            </TouchableOpacity>
          </View>
        </View>
        <GlobalLoading
          refViewForBlurView={this.state.refViewContainer}
          show={this.state.busyWaiting}/>
      </LinearGradient>
    );
  }
}

Login.propTypes = {
  navigator: PropTypes.any,
  setUser: PropTypes.func
};

let mapDispatchToProps = (dispatch) => {
  return {
    setUser: (user) => dispatch(setUser(user))
  };
};

export default connect(undefined, mapDispatchToProps)(Login);


