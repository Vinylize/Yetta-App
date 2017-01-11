import React, { Component, PropTypes } from 'react';
import Mapbox, { MapView } from 'react-native-mapbox-gl';
import {
  Text,
  StyleSheet,
  StatusBar,
  View,
  TouchableOpacity,
  ScrollView,
  ListView,
  Dimensions
} from 'react-native';
import TimerMixin from 'react-timer-mixin';
import { getPortLocation } from './../auth/port';

const SCENE_CONSTANT = {
  PORT: 'PORT',
  SHIP: 'SHIP',
  LIST: 'LIST',
  MAP: 'MAP'
};

const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;

const accessToken = 'pk.eyJ1IjoidmlueWwiLCJhIjoiY2l4ZDZyZnpqMDBqYzJvbGZvb3hjdGU2OCJ9.NWKQyjLqr84rerSbCcmaxg';
Mapbox.setAccessToken(accessToken);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch'
  },
  map: {
    flex: 1
  },
  scrollView: {
    flex: 1
  },
  listViewContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: HEIGHT - 40,
    width: WIDTH,
    backgroundColor: 'white',
    opacity: 0.7
  },
  listViewRowContainer: {
    height: 40,
    width: WIDTH,
    borderWidth: 1,
    borderColor: '#444'
  },
  btnListOrMap: {
    position: 'absolute',
    left: 20,
    bottom: 20,
    height: 50,
    width: 50,
    borderRadius: 5,
    backgroundColor: '#ececec',
    zIndex: 1
  }
});

const shippingShip = (lat, lon) => {
  return {
    coordinates: [lat, lon],
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
  };
};

export default class Map extends Component {
  constructor() {
    super();

    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.state = {
      center: {
        latitude: 37.53601435685916,
        longitude: 127.1368545604094
      },
      zoom: 11,
      userTrackingMode: Mapbox.userTrackingMode.follow,
      annotations: [],
      timeout: undefined,
      listOrMap: SCENE_CONSTANT.MAP,
      dataSource: ds.cloneWithRows(['1', '2', '3', '4', '5', '6', '7', '8', '9'])
    };

    this.state.timeout = TimerMixin.setInterval(
      () => {
        getPortLocation()
          .then((rjson) => {
            if(rjson && rjson.lat && rjson.lon) {
              this.setState({
                annotations: [shippingShip(rjson.lat, rjson.lon)]
              });
            }
          })
          .catch(console.log);
      },
      1000
    );
  }

  shouldComponentUpdate(nextState, nextProps) {
    if (this.state.listOrMap !== nextState.listOrMap) {
      return true;
    }
    if (this.props.currentScene !== nextProps.currentScene) {
      return true;
    }
    return false;
  }

  onRegionDidChange = (location) => {
    this.setState({ currentZoom: location.zoomLevel });
  };
  onRegionWillChange = (location) => {
    //console.log('onRegionWillChange', location);
  };
  onUpdateUserLocation = (location) => {
    //console.log('onUpdateUserLocation', location);
    this._map.getBounds(bounds => {
      //console.log(bounds);
    });
  };
  onOpenAnnotation = (annotation) => {
    //console.log('onOpenAnnotation', annotation);
  };
  onRightAnnotationTapped = (e) => {
    //console.log('onRightAnnotationTapped', e);
  };
  onLongPress = (location) => {
    //console.log('onLongPress', location);
  };
  onTap = (location) => {
    //console.log('onTap', location);
    //console.log(this.props);
  };
  onChangeUserTrackingMode = (userTrackingMode) => {
    this.setState({ userTrackingMode });
    //console.log('onChangeUserTrackingMode', userTrackingMode);
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
    TimerMixin.clearInterval(this.state.timeout);
    this._offlineProgressSubscription.remove();
    this._offlineMaxTilesSubscription.remove();
    this._offlineErrorSubscription.remove();
  }

  renderSwitchButton() {
    return (
      <TouchableOpacity
        style={styles.btnListOrMap}
        onPress={this.handleBtnListOrMap.bind(this)}
      >
        <Text>{this.renderTextListOrMap()}</Text>
      </TouchableOpacity>
    );
  }

  renderTextListOrMap() {
    return (this.state.listOrMap === SCENE_CONSTANT.MAP) ? 'List' : 'Map';
  }

  handleBtnListOrMap() {
    const listOrMap = (this.state.listOrMap === SCENE_CONSTANT.MAP) ? SCENE_CONSTANT.LIST : SCENE_CONSTANT.MAP;
    this.setState({listOrMap});
  }

  renderRow(rowData) {
    return (
      <View style={styles.listViewRowContainer}>
        <Text>Port Request #{rowData}</Text>
      </View>
    )
  }

  renderListView() {
    return (
      <View style={styles.listViewContainer}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderRow}
        />
      </View>
    )
  }

  render() {
    StatusBar.setHidden(true);
    return (
      <View style={styles.container}>
        <MapView
          ref={map => {
            this._map = map;
          }}
          style={styles.map}
          initialCenterCoordinate={this.state.center}
          initialZoomLevel={14}
          initialDirection={0}
          scrollEnabled={true}
          zoomEnabled={true}
          showsUserLocation={true}
          styleURL={Mapbox.mapStyles.light}
          userTrackingMode={this.state.userTrackingMode}
          annotations={this.state.annotations}
          annotationsAreImmutable
          logoIsHidden
          onChangeUserTrackingMode={this.onChangeUserTrackingMode}
          onRegionDidChange={this.onRegionDidChange}
          onRegionWillChange={this.onRegionWillChange}
          onOpenAnnotation={this.onOpenAnnotation}
          onRightAnnotationTapped={this.onRightAnnotationTapped}
          onUpdateUserLocation={this.onUpdateUserLocation}
          onLongPress={this.onLongPress}
          onTap={this.onTap}
        />
        {(this.props.currentScene === SCENE_CONSTANT.SHIP) ? this.renderSwitchButton() : null}
        {(this.props.currentScene === SCENE_CONSTANT.SHIP && this.state.listOrMap === SCENE_CONSTANT.LIST) ? this.renderListView() : null}
      </View>
    );
  }
}

Map.propTypes = {
  currentScene: PropTypes.string
};
