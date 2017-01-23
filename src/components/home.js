import React, { Component, PropTypes } from 'react';
import Mapbox, { MapView } from 'react-native-mapbox-gl';
import {
  AsyncStorage,
  Text,
  View,
  Dimensions,
  LayoutAnimation,
  Keyboard,
  PanResponder
} from 'react-native';
import * as firebase from 'firebase';
import Login from './login';
import Register from './register';

const config = {
  
};

firebase.initializeApp(config);

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  mapBox: {
    flex: 8,
    alignItems: 'stretch',
    marginBottom: -30,
    backgroundColor: 'yellow'
  },
  map: {
    flex: 1
  },
  textLogin: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#ececec'
  },
  textLoginPressed: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#ececec',
    marginTop: 20
  },
  textRegister: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#ececec'
  },
  textRegisterPressed: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#ececec',
    marginTop: 20
  }
};

const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;

export default class Home extends Component {
  constructor() {
    super();
    this.renderTop = this.renderTop.bind(this);
    this.state = {
      center: {
        latitude: 37.53601435685916,
        longitude: -127.1368545604094
      },
      zoom: 11,
      userTrackingMode: Mapbox.userTrackingMode.follow,
      annotations: [],
      first: true,
      gotUserLocation: false,
      clicked: ''
    };
  }

  shouldComponentUpdate(nextState) {
    const {
      center,
      zoom,
      userTrackingMode,
      first,
      gotUserLocation,
      clicked
    } = this.state;
    return (
      (JSON.stringify(center) !== JSON.stringify(nextState.center)) ||
      (zoom !== nextState.zoom) ||
      (userTrackingMode !== nextState.userTrackingMode) ||
      (first !== nextState.first) ||
      (gotUserLocation !== nextState.gotUserLocation) ||
      (clicked !== nextState.clicked));
  }

  componentDidMount() {
    this.checkLogin()
      .then((token) => {
        if (token) {
          // todo: to smt here
        }
      })
      .catch(console.log);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { longitude, latitude } = position.coords;
        this.setState({
          center: {
            longitude,
            latitude
          },
          gotUserLocation: true
        });
      },
      (error) => {
        console.log(JSON.stringify(error));
        this.setState({gotUserLocation: true});
      },
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
  }

  checkLogin() {
    return new Promise((resolve) => {
      resolve(AsyncStorage.getItem('accessToken'));
    });
  }

  handleLogin() {
    LayoutAnimation.easeInEaseOut();
    this.setState({
      clicked: 'login'
    });
  }

  handleRegister() {
    LayoutAnimation.easeInEaseOut();
    this.setState({
      clicked: 'register'
    });
  }

  componentWillMount() {
    this._offlineProgressSubscription = Mapbox.addOfflinePackProgressListener(progress => {
      console.log('offline pack progress', progress);
    });
    this._offlineMaxTilesSubscription = Mapbox.addOfflineMaxAllowedTilesListener(tiles => {
      console.log('offline max allowed tiles', tiles);
    });
    this._offlineErrorSubscription = Mapbox.addOfflineErrorListener(error => {
      console.log('offline error', error);
    });
    this.loginPanResponder = PanResponder.create({
      onStartShouldSetPanResponder: this.loginHandleStartShouldSetPanResponder,
      onMoveShouldSetPanResponder: this.loginHandleMoveShouldSetPanResponder.bind(this),
      onPanResponderGrant: this.loginHandlePanResponderGrant.bind(this),
      onPanResponderMove: this.loginHandlePanResponderMove.bind(this),
      onPanResponderRelease: this.loginOnPanResponderRelease.bind(this),
      onPanResponderTerminate: this.loginHandlePanResponderEnd
    });
    this.registerPanResponder = PanResponder.create({
      onStartShouldSetPanResponder: this.registerHandleStartShouldSetPanResponder,
      onMoveShouldSetPanResponder: this.registerHandleMoveShouldSetPanResponder.bind(this),
      onPanResponderGrant: this.registerHandlePanResponderGrant.bind(this),
      onPanResponderMove: this.registerHandlePanResponderMove.bind(this),
      onPanResponderRelease: this.registerOnPanResponderRelease.bind(this),
      onPanResponderTerminate: this.registerHandlePanResponderEnd
    });
  }

  componentWillUnmount() {
    this._offlineProgressSubscription.remove();
    this._offlineMaxTilesSubscription.remove();
    this._offlineErrorSubscription.remove();
  }

  loginHandleStartShouldSetPanResponder() {
    return true;
  }
  loginHandleMoveShouldSetPanResponder() {
    return (this.state.clicked === 'login');
  }
  loginHandlePanResponderGrant() {
    if (this.state.clicked !== 'login') {
      this.handleLogin();
    }
    Keyboard.dismiss();
  }
  loginHandlePanResponderMove(e, gestureState) {
    if (this.state.clicked === 'login') {
      const { dy } = gestureState;
      if (dy > 0) {
        this.refViewLogin.setNativeProps({style: {height: HEIGHT - dy}});
      }
    }
  }
  loginOnPanResponderRelease(e, gestureState) {
    if (this.state.clicked === 'login') {
      const { dy } = gestureState;
      if (dy > 0) {
        LayoutAnimation.easeInEaseOut();
        this.setState({clicked: ''});
      }
    }
  }
  loginHandlePanResponderEnd() {
    // TBD
  }

  registerHandleStartShouldSetPanResponder() {
    return true;
  }
  registerHandleMoveShouldSetPanResponder() {
    return (this.state.clicked === 'register');
  }
  registerHandlePanResponderGrant() {
    if (this.state.clicked !== 'register') {
      this.handleRegister();
    }
    Keyboard.dismiss();
  }
  registerHandlePanResponderMove(e, gestureState) {
    if (this.state.clicked === 'register') {
      const { dy } = gestureState;
      if (dy > 0) {
        this.refViewRegister.setNativeProps({style: {height: HEIGHT - dy}});
      }
    }
  }
  registerOnPanResponderRelease(e, gestureState) {
    if (this.state.clicked === 'register') {
      const { dy } = gestureState;
      if (dy > 0) {
        LayoutAnimation.easeInEaseOut();
        this.setState({clicked: ''});
      }
    }
  }
  registerHandlePanResponderEnd() {
    // TBD
  }

  renderTop() {
    return (
      <View style={[styles.mapBox,
        {backgroundColor: 'yellow'}]}
      >
        {this.state.gotUserLocation ?
          <MapView
            ref={map => {
              this._map = map;
            }}
            style={styles.map}
            initialCenterCoordinate={this.state.center}
            initialZoomLevel={14}
            initialDirection={0}
            scrollEnabled={false}
            zoomEnabled={false}
            showsUserLocation={true}
            styleURL={Mapbox.mapStyles.light}
            userTrackingMode={this.state.userTrackingMode}
            annotationsAreImmutable
            logoIsHidden
          />
          :
          <View style={{flex: 1, backgroundColor: '#ececec'}}/>
        }
      </View>
    );
  }

  _renderTop() {
    return (
      <View style={[styles.mapBox,
        {backgroundColor: 'yellow'}]}
      >
        <View style={{flex: 1, backgroundColor: '#ececec'}}/>
      </View>
    );
  }

  loginStyle() {
    let { clicked } = this.state;
    if (clicked === 'login') {
      return ({
        height: HEIGHT,
        width: WIDTH,
        position: 'absolute',
        bottom: 0,
        left: 0,
        zIndex: 0,
        justifyContent: 'flex-start'
      });
    } else if (clicked === 'register') {
      return ({
        position: 'absolute',
        bottom: 0,
        left: 0,
        height: 69.5,
        width: WIDTH,
        zIndex: 1,
        justifyContent: 'center'
      });
    }
    return {
      justifyContent: 'center',
      height: 69.5,
      width: WIDTH,
      bottom: 69.5,
      left: 0,
      position: 'absolute',
      zIndex: 1
    };
  }

  registerStyle() {
    let { clicked } = this.state;
    if (clicked === 'login') {
      return ({
        position: 'absolute',
        bottom: 0, left: 0,
        height: 69.5,
        width: WIDTH,
        zIndex: 0,
        justifyContent: 'center'
      });
    } else if (clicked === 'register') {
      return ({
        height: HEIGHT,
        width: WIDTH,
        position: 'absolute',
        bottom: 0,
        left: 0,
        zIndex: 0,
        justifyContent: 'flex-start'
      });
    }
    return {
      justifyContent: 'center',
      height: 69.5,
      width: WIDTH,
      bottom: 0,
      left: 0,
      position: 'absolute',
      zIndex: 1
    };
  }

  render() {
    let { clicked } = this.state;
    return (
      <View style={styles.container}>
        {this.renderTop()}
        <View
          ref={component => this.refViewLogin = component} // eslint-disable-line
          style={[{backgroundColor: '#ff6666'}, this.loginStyle()]}
          {...this.loginPanResponder.panHandlers}
        >
          <Text style={(clicked === 'login') ? styles.textLoginPressed : styles.textLogin}>
            Login
          </Text>
          {(clicked === 'login') ?
            <Login navigator={this.props.navigator}/>
            : null}
        </View>
        <View
          ref={component => this.refViewRegister = component} // eslint-disable-line
          style={[{backgroundColor: '#42dcf4'}, this.registerStyle()]}
          {...this.registerPanResponder.panHandlers}
        >
          <Text style={(clicked === 'register') ? styles.textRegisterPressed : styles.textRegister}>
            Register
          </Text>
          {(clicked === 'register') ?
            <Register navigator={this.props.navigator} goToLogin={this.handleLogin.bind(this)}/>
            : null}
        </View>
      </View>
    );
  }
}

Home.propTypes = {
  navigator: PropTypes.any
};
