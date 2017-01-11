import React, { Component, PropTypes } from 'react';
import Mapbox, { MapView } from 'react-native-mapbox-gl';
import {
  AsyncStorage,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  LayoutAnimation
} from 'react-native';
import Login from './login';
import Register from './register';

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
  state = {
    center: {
      latitude: 37.53601435685916,
      longitude: 127.1368545604094
    },
    zoom: 11,
    userTrackingMode: Mapbox.userTrackingMode.follow,
    annotations: [],
    clicked: '',
  };

  constructor() {
    super();
    this.renderTop = this.renderTop.bind(this);
  }

  shouldComponentUpdate(nextState) {
    if (this.state.clicked !== nextState.clicked) {
      return true;
    }
    return false;
  }

  componentDidMount() {
    this.checkLogin()
      .then((token) => {
        if (token) {
          // todo: to smt here
        }
      })
      .catch(console.log);
  }

  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
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
    //this.props.navigator.push(loginNavigatorRoute());
  }

  handleRegister() {
    LayoutAnimation.easeInEaseOut();
    this.setState({
      clicked: 'register'
    });
    //this.props.navigator.push(registerNavigatorRoute());
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
  }

  componentWillUnmount() {
    this._offlineProgressSubscription.remove();
    this._offlineMaxTilesSubscription.remove();
    this._offlineErrorSubscription.remove();
  }

  renderTop() {
    let { clicked } = this.state;
    return (
      <View style={[styles.mapBox,
        {backgroundColor: (clicked === 'login') ? '#ff6666' : (clicked === 'register') ? '#42dcf4' : 'yellow'}]}
      >

      </View>
    );
  }

  loginStyle() {
    let { clicked } = this.state;
    if (clicked === 'login') {
      return (
        {
          height: HEIGHT - 69.5,
          width: WIDTH,
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 1,
          justifyContent: 'flex-start'
        }
      );
    }
    else if (clicked === 'register') {
      return (
        {
          position: 'absolute',
          bottom: 0,
          left: 0,
          height: 69.5,
          width: WIDTH,
          zIndex: 0,
          justifyContent: 'center'
        }
      )
    }
    return {justifyContent: 'center'};
  }

  registerStyle() {
    let { clicked } = this.state;
    if (clicked === 'login') {
      return (
        {
          position: 'absolute',
          bottom: 0, left: 0,
          height: 69.5,
          width: WIDTH,
          zIndex: 0,
          justifyContent: 'center'
        }
      );
    }
    else if (clicked === 'register') {
      return (
        {
          height: HEIGHT - 69.5,
          width: WIDTH,
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 1,
          justifyContent: 'flex-start'
        }
      )
    }
    return {justifyContent: 'center'};
  }

  render() {
    let { clicked } = this.state;
    return (
      <View style={[styles.container]}>
        {this.renderTop()}
        <TouchableOpacity
          style={[{ flex: 1, backgroundColor: '#ff6666'}, this.loginStyle()]}
          onPress={this.handleLogin.bind(this)}
          activeOpacity={1}
        >
          <Text style={(clicked === 'login') ? styles.textLoginPressed : styles.textLogin}>
            Login
          </Text>
          {(clicked === 'login') ?
            <Login navigator={this.props.navigator}/>
            : null}
        </TouchableOpacity>
        <TouchableOpacity
          style={[{ height: 69.5, width: WIDTH, backgroundColor: '#42dcf4', justifyContent: 'center' }, this.registerStyle()]}
          onPress={this.handleRegister.bind(this)}
          activeOpacity={1}
        >
          <Text style={(clicked === 'register') ? styles.textRegisterPressed : styles.textRegister}>
            Register
          </Text>
          {(clicked === 'register') ?
            <Register navigator={this.props.navigator}/>
            : null}
        </TouchableOpacity>
      </View>
    );
  }
}

Home.propTypes = {
  navigator: PropTypes.any
};
