import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import store from './../store';
import {
  DeviceEventEmitter,
  Image,
  NativeModules,
  Platform,
  Text
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import * as firebase from 'firebase';
import * as YettaServerAPIauth from './../service/YettaServerAPI/auth';
import * as YettaServerAPIuserInfo from './../service/YettaServerAPI/userInfo';
import { NavigationActions } from 'react-navigation';

// [start redux functions]
import { setUser } from '../actions/authActions';
import { setNavigator } from './../actions/navigatorActions';
import { setCurrentLocation } from './../actions/componentsActions/homeActions';
// [end redux functions]

// actions
import * as pushNotificationActions from './../actions/pushNotificationActions';

import IMG_LOGO from './../../assets/logo.png';

class Splash extends Component {
  constructor() {
    super();
    this.autoLoginIfUserFound = this.autoLoginIfUserFound.bind(this);
    this.checkIfLaunchedByUserTapPushNotification = this.checkIfLaunchedByUserTapPushNotification.bind(this);
  }

  componentWillMount() {
    this.props.setNavigator(this.props.navigation);
    this.autoLoginIfUserFound();

    // trying to get one-time location update
    if (Platform.OS === 'android') {
      const { YettaLocationAndroid } = NativeModules;
      YettaLocationAndroid.startLocationService();
      DeviceEventEmitter.addListener('didUpdateToLocationAndroidForeground', async(data) => {
        // console.log('foreground location update: ', data);
        // Alert.alert('foreground location update', JSON.stringify(data));
        store.dispatch(setCurrentLocation({
          lat: data.latitude,
          lon: data.longitude
        }));
        YettaLocationAndroid.stopLocationService();
      });
    }
  }

  componentDidMount() {
    // [start iOS changeRootViewBGColor]
    if (Platform.OS === 'ios') {
      const YettaUtilsIOS = NativeModules.YettaUtils;
      YettaUtilsIOS && YettaUtilsIOS.changeRootViewBGColor();
    }
    // [end iOS changeRootViewBGColor]
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

  checkIfLaunchedByUserTapPushNotification() {
    const { status, notification } = this.props.launchedByUserTapPushNotif;
    if (status === true) {
      if (Platform.OS === 'ios') {
        pushNotificationActions.receivedRemoteNotificationIOS(notification);
      }
    }
  }

  queryUser() {
    return YettaServerAPIuserInfo.queryUser()
      .then((viewer) => {
        this.props.setUser(viewer);
        __DEV__ && console.log(viewer); // eslint-disable-line no-undef
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
        __DEV__ && console.log(res); // eslint-disable-line no-undef
        return this.queryUser(lokkaClient);
      })
      .then(viewer => {
        if (viewer.isPV === true) {
          this.checkIfLaunchedByUserTapPushNotification();
          this.navigateToHome();
        } else if (viewer.isPV === false) {
          this.navigateToPhoneVerification();
        }
      })
      .catch(err => {
        console.log(err);
        this.navigateToLoginPage();
      });
  }

  navigateToLoginPage() {
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: 'Login' })
      ]
    });
    this.props.navigation.dispatch(resetAction);
  }

  navigateToHome() {
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: 'Home' })
      ]
    });
    this.props.navigation.dispatch(resetAction);
  }

  navigateToPhoneVerification() {
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: 'PhoneVerification' })
      ]
    });
    this.props.navigation.dispatch(resetAction);
  }

  render() {
    return (
      <LinearGradient
        colors={['#ffba56', '#ff9700']}
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          backgroundColor: '#ffba56'
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
          color: 'white',
          backgroundColor: 'transparent'
        }}>
          YETTA BETA
        </Text>
      </LinearGradient>
    );
  }
}

Splash.propTypes = {
  navigation: PropTypes.object.isRequired,
  setNavigator: PropTypes.func,
  setUser: PropTypes.func,

  // reducers/pushNotification
  launchedByUserTapPushNotif: PropTypes.object
};

const mapStateToProps = (state) => {
  return {
    launchedByUserTapPushNotif: state.pushNotification.launchedByUserTapPushNotif
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setUser: (user) => dispatch(setUser(user)),
    setNavigator: (navigator) => dispatch(setNavigator(navigator))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Splash);
