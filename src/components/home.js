import React, { Component, PropTypes } from 'react';
import Mapbox, { MapView } from 'react-native-mapbox-gl';
import Relay from 'react-relay';
import {
  Text,
  View,
  TouchableHighlight
} from 'react-native';
import {
  mapNavigatorRoute,
  loginNavigatorRoute,
  registerNavigatorRoute,
} from '../navigator/navigatorRoutes';

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  mapBox: {
    flex: 6,
    alignItems: 'stretch',
    marginBottom:-30,
  },
  map: {
    flex: 1
  },
  textLogin: {
    fontSize: 20,
    textAlign: 'center',
  },
  textRegister: {
    fontSize: 20,
    textAlign: 'center',
  },
};

export class Home extends Component {
  state = {
    center: {
      latitude: 37.53601435685916,
      longitude: 127.1368545604094
    },
    zoom: 11,
    userTrackingMode: Mapbox.userTrackingMode.none,
    annotations: [{
      coordinates: [40.72052634, -73.97686958312988],
      type: 'point',
      title: 'This is marker 1',
      subtitle: 'It has a rightCalloutAccessory too',
      rightCalloutAccessory: {
        source: { uri: 'https://cldup.com/9Lp0EaBw5s.png' },
        height: 25,
        width: 25
      },
      annotationImage: {
        source: { uri: 'https://cldup.com/CnRLZem9k9.png' },
        height: 25,
        width: 25
      },
      id: 'marker1'
    }, {
      coordinates: [40.714541341726175,-74.00579452514648],
      type: 'point',
      title: 'Important!',
      subtitle: 'Neat, this is a custom annotation image',
      annotationImage: {
        source: { uri: 'https://cldup.com/7NLZklp8zS.png' },
        height: 25,
        width: 25
      },
      id: 'marker2'
    }, {
      coordinates: [[40.76572150042782,-73.99429321289062],[40.743485405490695, -74.00218963623047],[40.728266950429735,-74.00218963623047],[40.728266950429735,-73.99154663085938],[40.73633186448861,-73.98983001708984],[40.74465591168391,-73.98914337158203],[40.749337730454826,-73.9870834350586]],
      type: 'polyline',
      strokeColor: '#00FB00',
      strokeWidth: 4,
      strokeAlpha: .5,
      id: 'foobar'
    }, {
      coordinates: [[40.749857912194386, -73.96820068359375], [40.741924698522055,-73.9735221862793], [40.735681504432264,-73.97523880004883], [40.7315190495212,-73.97438049316406], [40.729177554196376,-73.97180557250975], [40.72345355209305,-73.97438049316406], [40.719290332250544,-73.97455215454102], [40.71369559554873,-73.97729873657227], [40.71200407096382,-73.97850036621094], [40.71031250340588,-73.98691177368163], [40.71031250340588,-73.99154663085938]],
      type: 'polygon',
      fillAlpha: 1,
      strokeColor: '#ffffff',
      fillColor: '#0000ff',
      id: 'zap'
    }]
  };

  constructor() {
    super();
    this.renderTop = this.renderTop.bind(this);
    this.renderBottom = this.renderBottom.bind(this);
  }

  handleLogin() {
    this.props.navigator.push(loginNavigatorRoute());
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
        <MapView
          ref={map => { this._map = map; }}
          style={styles.map}
          initialCenterCoordinate={this.state.center}
          initialZoomLevel={14}
          initialDirection={0}
          scrollEnabled={true}
          zoomEnabled={true}
          showsUserLocation={true}
          userTrackingMode={this.state.userTrackingMode}
          annotations={this.state.annotations}
          annotationsAreImmutable
          onChangeUserTrackingMode={this.onChangeUserTrackingMode}
          onRegionDidChange={this.onRegionDidChange}
          onRegionWillChange={this.onRegionWillChange}
          onOpenAnnotation={this.onOpenAnnotation}
          onRightAnnotationTapped={this.onRightAnnotationTapped}
          onUpdateUserLocation={this.onUpdateUserLocation}
          onLongPress={this.onLongPress}
          onTap={this.onTap}
        />
      </View>
    );
  }

  renderBottom() {
    return (
      <View style={{ flex: 2 }}>
        <TouchableHighlight
          style={{ flex:1 , backgroundColor: '#e2462b', justifyContent: 'center' }}
          onPress={this.handleLogin.bind(this)}>
          <Text style={styles.textLogin}>
            Login
          </Text>
        </TouchableHighlight>
        <TouchableHighlight
          style={{ flex: 1, backgroundColor: '#2b3ee5', justifyContent: 'center' }}
          onPress={this.handleRegister.bind(this)}>
          <Text style={styles.textRegister}>
            Register
          </Text>
        </TouchableHighlight>

      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderTop()}
        {this.renderBottom()}
      </View>
    );
  }
}

export default Relay.createContainer(Home, {
  initialVariables: {
  },
  fragments: {
  },
});
