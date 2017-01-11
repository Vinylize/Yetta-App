import React, { Component, PropTypes } from 'react';
import Mapbox, { MapView } from 'react-native-mapbox-gl';
import {
  Text,
  StyleSheet,
  StatusBar,
  View,
  TouchableHighlight,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { updateShipLocation } from './../auth/ship';

const accessToken = 'pk.eyJ1IjoidmlueWwiLCJhIjoiY2l4ZDZyZnpqMDBqYzJvbGZvb3hjdGU2OCJ9.NWKQyjLqr84rerSbCcmaxg';
Mapbox.setAccessToken(accessToken);

const SCENE_CONSTANT = {
  MAP: 'MAP',
  LIST: 'LIST'
};

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
  btnListOrMap: {
    position: 'absolute',
    left: 20,
    bottom: 20,
    height: 50,
    width: 50,
    borderRadius: 5,
    backgroundColor: '#ececec'
  }
});

export default class Ship extends Component {
  constructor() {
    super();
    this.state = {
      center: {
        latitude: 37.53601435685916,
        longitude: 127.1368545604094
      },
      zoom: 11,
      userTrackingMode: Mapbox.userTrackingMode.follow,
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
      }],
      listOrMap: SCENE_CONSTANT.MAP
    };
  }

  onRegionDidChange = (location) => {
    this.setState({ currentZoom: location.zoomLevel });
  };
  onUpdateUserLocation = (location) => updateShipLocation(location);
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
    this._offlineProgressSubscription.remove();
    this._offlineMaxTilesSubscription.remove();
    this._offlineErrorSubscription.remove();
  }

  renderMap() {
    return (
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
    );
  }

  renderTextListOrMap() {
    return (this.state.listOrMap === SCENE_CONSTANT.MAP) ? 'List' : 'Map';
  }

  handleBtnListOrMap() {
    const listOrMap = (this.state.listOrMap === SCENE_CONSTANT.MAP) ? SCENE_CONSTANT.LIST : SCENE_CONSTANT.MAP;
    this.setState({listOrMap});
  }

  render() {
    StatusBar.setHidden(true);
    return (
      <View style={styles.container}>
        {this.renderMap()}
        <TouchableOpacity
          style={styles.btnListOrMap}
          onPress={this.handleBtnListOrMap.bind(this)}
        >
          <Text>{this.renderTextListOrMap()}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
