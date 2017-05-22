import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  findNodeHandle,
  Text,
  TextInput,
  View,
  Keyboard,
  KeyboardAvoidingView,
  TouchableOpacity,
  Dimensions,
  Image
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import LinearGradient from 'react-native-linear-gradient';
import * as firebase from 'firebase';
import * as YettaServerAPIauth from './../service/YettaServerAPI/auth';
import * as YettaServerAPIuserInfo from './../service/YettaServerAPI/userInfo';

import GlobalLoading from './globalViews/loading';

import { setUser } from '../actions/authActions';
import { setRunnerNotification } from './../actions/pushNotificationActions';
import { setNavigator } from './../actions/navigatorActions';

import { handleFirebaseSignInError } from './../utils/errorHandlers';

import IMG_LOGO from './../../assets/logo.png';

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

  queryUser() {
    return YettaServerAPIuserInfo.queryUser()
      .then((viewer) => {
        this.props.setUser(viewer);
        this.hideLoading();
        console.log(viewer);
        return viewer;
      })
      .catch(e => {
        this.hideLoading();
        console.log(e);
        return e;
      });
  }

  internalAuth() {
    YettaServerAPIauth.userSignIn()
      .then(res => {
        console.log(res);
        return this.queryUser();
      })
      .then(viewer => {
        this.hideLoading();
        if (viewer.isPV) {
          this.navigateToHome();
        } else {
          this.navigateToPhoneVerification();
        }
      })
      .catch(err => {
        console.log(err);
        this.hideLoading();
      });
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
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: 'Home', params: {navigation: this.props.navigation}})
      ]
    });
    this.props.navigation.dispatch(resetAction);
  }

  navigateToPhoneVerification() {
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: 'PhoneVerification', params: {navigation: this.props.navigation}})
      ]
    });
    this.props.navigation.dispatch(resetAction);
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
        <TouchableOpacity
          style={{flex: 1}}
          onPress={() => Keyboard.dismiss()}
          activeOpacity={1}
        >
          <KeyboardAvoidingView
            behavior="padding"
            style={styles.container}
          >
            <Image style={styles.logo} source={IMG_LOGO} />
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
                onPress={() => this.props.navigation.navigate('Register')}
              >
                <Text style={{
                  color: '#FFF',
                  fontWeight: '500',
                  fontSize: 12,
                  backgroundColor: 'transparent'
                }}>비밀번호를 잊으셨나요?</Text>
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
                style={{
                  fontSize: 14,
                  fontWeight: '500',
                  color: '#fee5c0',
                  backgroundColor: 'transparent'
                }}
              >아직 회원이 아니신가요? </Text>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('Register')}>
                <Text style={{
                  marginTop: 1,
                  fontSize: 14,
                  fontWeight: '500',
                  color: '#FFF',
                  backgroundColor: 'transparent'
                }}>회원가입</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </TouchableOpacity>
        <GlobalLoading
          refViewForBlurView={this.state.refViewContainer}
          show={this.state.busyWaiting}/>
      </LinearGradient>
    );
  }
}

Login.propTypes = {
  navigation: PropTypes.any,

  // reducers/auth
  setUser: PropTypes.func,

  // reducers/pushNotification
  runnerNotification: PropTypes.any,
  setRunnerNotification: PropTypes.func,

  // reducers/navigator
  setNavigator: PropTypes.func
};

function mapStateToProps(state) {
  return {
    runnerNotification: state.pushNotification.runnerNotification
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    setUser: (user) => dispatch(setUser(user)),
    setRunnerNotification: (isRunner) => dispatch(setRunnerNotification(isRunner)),
    setNavigator: (navigator) => dispatch(setNavigator(navigator))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
