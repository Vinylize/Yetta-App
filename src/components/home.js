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
import {
  loginNavigatorRoute,
  registerNavigatorRoute
} from '../navigator/navigatorRoutes';
import Login from './login';

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  mapBox: {
    flex: 8,
    alignItems: 'stretch',
    marginBottom: -30
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
  textRegister: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#ececec'
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
    this.props.navigator.push(registerNavigatorRoute());
  }

  onRegionDidChange = (location) => {
    this.setState({ currentZoom: location.zoomLevel });
    console.log('onRegionDidChange', location);
  };
  onRegionWillChange = (location) => {
    console.log('onRegionWillChange', location);
  };
  onUpdateUserLocation = (location) => {
    console.log('onUpdateUserLocation', location);
    this._map.getBounds(bounds => {
      console.log(bounds);
    });
    //sendQueries(queryRequests) {
    //  return Promise.all(queryRequests.map(
    //    queryRequest => fetch(...).then(result => {
    //      if (result.errors) {
    //        queryRequest.reject(new Error(...));
    //      } else {
    //        queryRequest.resolve({response: result.data});
    //      }
    //    })
    //  ));
    //}

  };
  onOpenAnnotation = (annotation) => {
    console.log('onOpenAnnotation', annotation);
  };
  onRightAnnotationTapped = (e) => {
    console.log('onRightAnnotationTapped', e);
  };
  onLongPress = (location) => {
    console.log('onLongPress', location);
  };
  onTap = (location) => {
    console.log('onTap', location);
  };
  onChangeUserTrackingMode = (userTrackingMode) => {
    this.setState({ userTrackingMode });
    console.log('onChangeUserTrackingMode', userTrackingMode);
  };

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
    return (
      <View style={styles.mapBox}>

      </View>
    );
  }

  render() {
    let { clicked } = this.state;
    return (
      <View style={styles.container}>
        {this.renderTop()}
        <TouchableOpacity
          style={[{ flex: 1, backgroundColor: '#ff6666'},
            (clicked === 'login') ?
              {height: HEIGHT, width: WIDTH, position: 'absolute', top: 0, left: 0, zIndex: 1, justifyContent: 'flex-start'}
              :
              {flex: 1, justifyContent: 'center'}]}
          onPress={this.handleLogin.bind(this)}
          activeOpacity={(clicked === 'login') ? 1 : 0.7}
        >
          <Text style={styles.textLogin}>
            Login
          </Text>
          {(clicked === 'login') ?
            <Login navigator={this.props.navigator}/>
            : null}
        </TouchableOpacity>
        <TouchableOpacity

          style={{ flex: 1, backgroundColor: '#42dcf4', justifyContent: 'center' }}
          onPress={this.handleRegister.bind(this)}>
          <Text style={styles.textRegister}>
            Register
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

Home.propTypes = {
  navigator: PropTypes.any
};
