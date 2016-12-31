import React, { Component, PropTypes } from 'react';
import Mapbox, { MapView } from 'react-native-mapbox-gl';
import Relay from 'react-relay';
import {
  Text,
  StyleSheet,
  StatusBar,
  View,
  TouchableHighlight,
  ScrollView
} from 'react-native';

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
  }
});

export class Map extends Component {
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
      coordinates: [40.714541341726175, -74.00579452514648],
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
      coordinates: [[40.76572150042782, -73.99429321289062], [40.743485405490695, -74.00218963623047], [40.728266950429735, -74.00218963623047], [40.728266950429735, -73.99154663085938], [40.73633186448861, -73.98983001708984], [40.74465591168391, -73.98914337158203], [40.749337730454826, -73.9870834350586]],
      type: 'polyline',
      strokeColor: '#00FB00',
      strokeWidth: 4,
      strokeAlpha: 0.5,
      id: 'foobar'
    }, {
      coordinates: [[40.749857912194386, -73.96820068359375], [40.741924698522055, -73.9735221862793], [40.735681504432264, -73.97523880004883], [40.7315190495212, -73.97438049316406], [40.729177554196376, -73.97180557250975], [40.72345355209305, -73.97438049316406], [40.719290332250544, -73.97455215454102], [40.71369559554873, -73.97729873657227], [40.71200407096382, -73.97850036621094], [40.71031250340588, -73.98691177368163], [40.71031250340588, -73.99154663085938]],
      type: 'polygon',
      fillAlpha: 1,
      strokeColor: '#ffffff',
      fillColor: '#0000ff',
      id: 'zap'
    }]
  };

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const initialPosition = JSON.stringify(position);
        console.log(initialPosition);
      },
      (error) => alert(JSON.stringify(error)),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
    this.watchID = navigator.geolocation.watchPosition((position) => {
      const lastPosition = JSON.stringify(position);
      this.setState({lastPosition});
    });
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

  addNewMarkers = () => {
    // Treat annotations as immutable and create a new one instead of using .push()
    this.setState({
      annotations: [ ...this.state.annotations, {
        coordinates: [40.73312, -73.989],
        type: 'point',
        title: 'This is a new marker',
        id: 'foo'
      }, {
        coordinates: [[40.749857912194386, -73.96820068359375], [40.741924698522055, -73.9735221862793], [40.735681504432264, -73.97523880004883], [40.7315190495212, -73.97438049316406], [40.729177554196376, -73.97180557250975], [40.72345355209305, -73.97438049316406], [40.719290332250544, -73.97455215454102], [40.71369559554873, -73.97729873657227], [40.71200407096382, -73.97850036621094], [40.71031250340588, -73.98691177368163], [40.71031250340588, -73.99154663085938]],
        type: 'polygon',
        fillAlpha: 1,
        fillColor: '#000000',
        strokeAlpha: 1,
        id: 'new-black-polygon'
      }]
    });
  };

  updateMarker2 = () => {
    // Treat annotations as immutable and use .map() instead of changing the array
    this.setState({
      annotations: this.state.annotations.map(annotation => {
        if (annotation.id !== 'marker2') {
          return annotation;
        }
        return {
          coordinates: [40.714541341726175, -74.00579452514648],
          type: 'point',
          title: 'New Title!',
          subtitle: 'New Subtitle',
          annotationImage: {
            source: { uri: 'https://cldup.com/7NLZklp8zS.png' },
            height: 25,
            width: 25
          },
          id: 'marker2'
        };
      })
    });
  };

  removeMarker2 = () => {
    this.setState({
      annotations: this.state.annotations.filter(a => a.id !== 'marker2')
    });
  };

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
          onChangeUserTrackingMode={this.onChangeUserTrackingMode}
          onRegionDidChange={this.onRegionDidChange}
          onRegionWillChange={this.onRegionWillChange}
          onOpenAnnotation={this.onOpenAnnotation}
          onRightAnnotationTapped={this.onRightAnnotationTapped}
          onUpdateUserLocation={this.onUpdateUserLocation}
          onLongPress={this.onLongPress}
          onTap={this.onTap}
        />
        <ScrollView style={styles.scrollView}>
          {this._renderButtons()}
        </ScrollView>
      </View>
    );
  }

  _renderButtons() {
    return (
      <View>
        <Text onPress={() => this._map && this._map.setDirection(0)}>
          Set direction to 0
        </Text>
        <Text onPress={() => this._map && this._map.setZoomLevel(6)}>
          Zoom out to zoom level 6
        </Text>
        <Text onPress={() => this._map && this._map.setCenterCoordinate(48.8589, 2.3447)}>
          Go to Paris at current zoom level {parseInt(this.state.currentZoom)}
        </Text>
        <Text onPress={() => this._map && this._map.setCenterCoordinateZoomLevel(35.68829, 139.77492, 14)}>
          Go to Tokyo at fixed zoom level 14
        </Text>
        <Text onPress={() => this._map && this._map.easeTo({ pitch: 30 })}>
          Set pitch to 30 degrees
        </Text>
        <Text onPress={this.addNewMarkers}>
          Add new marker
        </Text>
        <Text onPress={this.updateMarker2}>
          Update marker2
        </Text>
        <Text onPress={() => this._map && this._map.selectAnnotation('marker1')}>
          Open marker1 popup
        </Text>
        <Text onPress={() => this._map && this._map.deselectAnnotation()}>
          Deselect annotation
        </Text>
        <Text onPress={this.removeMarker2}>
          Remove marker2 annotation
        </Text>
        <Text onPress={() => this.setState({ annotations: [] })}>
          Remove all annotations
        </Text>
        <Text onPress={() => this._map && this._map.setVisibleCoordinateBounds(40.712, -74.227, 40.774, -74.125, 100, 0, 0, 0)}>
          Set visible bounds to 40.7, -74.2, 40.7, -74.1
        </Text>
        <Text onPress={() => this.setState({ userTrackingMode: Mapbox.userTrackingMode.followWithHeading })}>
          Set userTrackingMode to followWithHeading
        </Text>
        <Text onPress={() => this._map && this._map.getCenterCoordinateZoomLevel((location)=> {
          console.log(location);
        })}>
          Get location
        </Text>
        <Text onPress={() => this._map && this._map.getDirection((direction)=> {
          console.log(direction);
        })}>
          Get direction
        </Text>
        <Text onPress={() => this._map && this._map.getBounds((bounds)=> {
          console.log(bounds);
        })}>
          Get bounds
        </Text>
        <Text onPress={() => {
          Mapbox.addOfflinePack({
            name: 'test',
            type: 'bbox',
            bounds: [0, 0, 0, 0],
            minZoomLevel: 0,
            maxZoomLevel: 0,
            metadata: { anyValue: 'you wish' },
            styleURL: Mapbox.mapStyles.light
          }).then(() => {
            console.log('Offline pack added');
          }).catch(err => {
            console.log(err);
          });
        }}>
          Create offline pack
        </Text>
        <Text onPress={() => {
          Mapbox.getOfflinePacks()
            .then(packs => {
              console.log(packs);
            })
            .catch(err => {
              console.log(err);
            });
        }}>
          Get offline packs
        </Text>
        <Text onPress={() => {
          Mapbox.removeOfflinePack('test')
            .then(info => {
              if (info.deleted) {
                console.log('Deleted', info.deleted);
              } else {
                console.log('No packs to delete');
              }
            })
            .catch(err => {
              console.log(err);
            });
        }}>
          Remove pack with name 'test'
        </Text>
        <Text>User tracking mode is {this.state.userTrackingMode}</Text>
      </View>
    );
  }

}

export default Relay.createContainer(Map, {
  initialVariables: {},
  fragments: {}
});
