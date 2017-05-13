import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  Image,
  Text
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import * as firebase from 'firebase';
import * as YettaServerAPIauth from './../service/YettaServerAPI/auth';
import * as YettaServerAPIuserInfo from './../service/YettaServerAPI/userInfo';

import {
  loginNavigatorRoute,
  homeNavigatorRoute,
  phoneVerificationNavigatorRoute
} from './../navigator/navigatorRoutes';

// [start redux functions]
import { setUser } from '../actions/authActions';
import { setNavigator } from './../actions/navigatorActions';
// [end redux functions]

import IMG_LOGO from './../../assets/logo.png';

class Splash extends Component {
  constructor() {
    super();
    this.state = {

    };
    this.autoLoginIfUserFound = this.autoLoginIfUserFound.bind(this);
  }

  componentWillMount() {
    this.props.setNavigator(this.props.navigator);
    this.autoLoginIfUserFound();
  }

  autoLoginIfUserFound() {
    // todo: remove firebase dependency for ability to use any other stacks
    this.fireBaseListener = firebase.auth().onAuthStateChanged((user) => {
      this.fireBaseListener && this.fireBaseListener();
      if (user) {
        this.internalAuth();
      } else {
        setTimeout(() => {
          this.navigateToLoginPage();
        }, 1000);
      }
    });
  }

  queryUser() {
    return YettaServerAPIuserInfo.queryUser()
      .then((viewer) => {
        this.props.setUser(viewer);
        console.log(viewer);
        return viewer;
      })
      .catch(e => {
        console.log(e);
        return e;
      });
  }

  internalAuth() {
    let lokkaClient;
    YettaServerAPIauth.userSignIn()
      .then(res => {
        // todo: handle on res error codes
        console.log(res);
        return this.queryUser(lokkaClient);
      })
      .then(viewer => {
        if (viewer.isPV) {
          this.navigateToHome();
        } else {
          this.navigateToPhoneVerification();
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  navigateToLoginPage() {
    this.props.navigator.replace(loginNavigatorRoute());
  }

  navigateToHome() {
    this.props.navigator.replace(homeNavigatorRoute());
  }

  navigateToPhoneVerification() {
    this.props.navigator.replace(homeNavigatorRoute());
    this.props.navigator.push(phoneVerificationNavigatorRoute());
  }

  render() {
    return (
      <LinearGradient
        colors={['#ffba56', '#ff9700']}
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column'
        }}
      >
        <Image
          style={{
            height: 45,
            marginBottom: 30
          }}
          source={IMG_LOGO}
        />
        <Text style={{
          fontSize: 30,
          color: 'white'
        }}>
          YETTA BETA
        </Text>
      </LinearGradient>
    );
  }
}

Splash.propTypes = {
  navigator: PropTypes.any,
  setNavigator: PropTypes.func,
  setUser: PropTypes.func
};

const mapDispatchToProps = (dispatch) => {
  return {
    setUser: (user) => dispatch(setUser(user)),
    setNavigator: (navigator) => dispatch(setNavigator(navigator))
  };
};

export default connect(undefined, mapDispatchToProps)(Splash);
