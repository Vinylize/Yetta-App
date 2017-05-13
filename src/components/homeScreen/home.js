import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  findNodeHandle,
  Text,
  View,
  Dimensions,
  LayoutAnimation,
  Platform,
  NativeModules,
  NativeEventEmitter,
  TouchableOpacity,
  Animated,
  DeviceEventEmitter
} from 'react-native';
import * as firebase from 'firebase';

import VinylMapAndroid from '../VinylMapAndroid';
import VinylMapIOS from '../VinylMapIOS';
import SearchBar from '../searchAddress/searchBar';
import ApproveCard from '../searchAddress/approveCard';
import RunnerView from '../runnerView/runnerView';
import RunnerOnDeliveryView from '../runnerView/runnerOnDeliveryView';
import BottomCardView from '../bottomCardView';
import Menu from '../menu';

import * as GOOGLE_MAPS_API from '../../service/GoogleMapsAPI';
import * as YettaServerAPI from '../../service/YettaServerAPI/client';
import { handleError } from '../../utils/errorHandlers';

// [start redux functions]
import { setIsRunner } from '../../actions/userStatusActions';
import {
  setBusyWaitingPlaceDetailAPI,
  setBusyWaitingGeocodingAPI
} from '../../actions/busyWaitingActions';
import {
  setWaitingNewOrder,
  setOnDelivery
} from '../../actions/runnerStatusActions';
import { setRunnerNotification } from '../../actions/pushNotificationActions';
import {
  setCameraWillMoveByPlaceDetailAPI,
  setSearchBarExpanded,
  setMapCameraPos,
  setShowApproveAddressCard,
  setSearchedAddressTextView,
  setCurrentLocation,
  setBusyOnWaitingNewRunner
} from '../../actions/componentsActions/homeActions';
import {
  animateCardAppear
} from '../../actions/componentsActions/bottomCardActions';
import {
  animateMenuAppear
} from '../../actions/componentsActions/menuActions';
// [end redux functions]

import UserModeTransition from '../globalViews/userModeTransition';
import GlobalLoading from '../globalViews/loading';

let vmm = NativeModules.VinylMapManager;

const { YettaLocationServiceManger } = NativeModules;
const locationServiceManagerEmitter = new NativeEventEmitter(YettaLocationServiceManger);

// constants
const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;
export const expandedCardHeight = HEIGHT * 0.43;
const cardHeight = 90;
export const cardInitBottom = -expandedCardHeight + cardHeight;
export const cardHidedBottom = -expandedCardHeight;

class Home extends Component {
  constructor() {
    super();
    this.state = {
      // todo: remove unnecessary states
      text: '',
      toggle: false,
      shrinkValue: new Animated.Value(1),
      markerTest: false,
      clickedMarkerID: undefined,
      trackingCurrentPos: false,
      refViewForBlurView: null
    };
    this.initialLocationUpdate = false;
  }

  componentWillMount() {
    if (Platform.OS === 'android') {
      DeviceEventEmitter.addListener('onMarkerPress', (e) => {
        console.log(e);
      });
      DeviceEventEmitter.addListener('onMapMove', (e) => {
        console.log(e);
        const { trackingCurrentPos } = this.state;
        // map moved by user
        if (trackingCurrentPos && e.gesture === '1') {
          this.setState({trackingCurrentPos: false});
        }
      });
      DeviceEventEmitter.addListener('onCameraIdle', (e) => {
        console.log('camera position idle: ', e);
        const { lat, lon } = e;
        this.props.setMapCameraPos({lat, lon});

        if (this.props.cameraWillMoveByPlaceDetailAPI) {
          // intention: avoid unnecessary geocoding from placeAutocomplete API prediction
          this.props.setCameraWillMoveByPlaceDetailAPI(false);
        } else if (this.props.showApproveAddressCard === true) {
          this.props.setBusyWaitingGeocodingAPI(true);

          GOOGLE_MAPS_API.geocoding(lat, lon)
            .then(arr => {
              this.props.setBusyWaitingGeocodingAPI(false);
              // TODO: improve this
              if (arr) {
                this.props.setSearchedAddressTextView({
                  firstAddressToken: arr[0].long_name + ' ' + arr[1].long_name,
                  addressTextView: arr.slice(2).map(token => token.long_name + ' ')
                });
              }
            })
            .catch(err => {
              this.props.setBusyWaitingGeocodingAPI(false);
              console.log(err);
            });
        }
      });
    }

    if (Platform.OS === 'android') {
      DeviceEventEmitter.addListener('didUpdateToLocationAndroidForeground', async(data) => {
        console.log('foreground location update: ', data);
        // Alert.alert('foreground location update', JSON.stringify(data));
        this.props.setCurrentLocation({
          lat: data.latitude,
          lon: data.longitude
        });

        if (vmm && this.state.trackingCurrentPos) {
          // vmm.animateToLocation(data.latitude, data.longitude);
          vmm.animateToLocationWithZoom(data.latitude, data.longitude, 16.0);
        }
        if (firebase.auth().currentUser) {
          this.userUpdateCoordinateHelper(data);
        }
      });
      DeviceEventEmitter.addListener('didUpdateToLocationAndroidBackground', async(data) => {
        console.log('background location update: ', data);
        // Alert.alert('background location update', JSON.stringify(data));
        this.props.setCurrentLocation({
          lat: data.latitude,
          lon: data.longitude
        });

        if (vmm && this.state.trackingCurrentPos) {
          vmm.animateToLocation(data.latitude, data.longitude);
        }
        if (firebase.auth().currentUser) {
          this.userUpdateCoordinateHelper(data);
        }
      });
    } else if (Platform.OS === 'ios') {
      YettaLocationServiceManger.startLocationService();
      this.subscriptionLocationServiceIOS = locationServiceManagerEmitter.addListener(
        'didUpdateToLocation',
        (data) => {
          if (this.initialLocationUpdate === false) {
            vmm.animateToLocationWithZoom(data.latitude, data.longitude, 16.0);
            this.initialLocationUpdate = true;
          }
          console.log(data);
          this.props.setCurrentLocation({
            lat: data.latitude,
            lon: data.longitude
          });

          if (vmm && this.state.trackingCurrentPos) {
            vmm.animateToLocation(data.latitude, data.longitude);
          }
          if (firebase.auth().currentUser) {
            this.userUpdateCoordinateHelper(data);
          }
        }
      );
    }
  }

  componentWillUnmount() {
    if (this.subscriptionLocationServiceIOS) {
      console.log('unsubscribe locationServiceIOS');
      this.subscriptionLocationServiceIOS.remove();
    }

    /*
     * todo: implement android:stopLocationService
     */
    if (Platform.OS === 'ios') {
      YettaLocationServiceManger.stopLocationService();
    }
  }

  userUpdateCoordinateHelper(data) {
    YettaServerAPI.getLokkaClient()
      .then(client => {
        return client.mutate(`{
            runnerUpdateCoordinate(
              input:{
                lat: ${data.latitude},
                lon: ${data.longitude}
              }
            ) {
              result
            }
          }`
        );
      })
      .then(console.log)
      .catch(handleError);
  }

  componentDidMount() {
    console.log(this.props);
    const { lat, lon } = this.props.currentLocation;
    if (vmm) {
      if (Platform.OS === 'ios') {
        vmm.animateToLocationWithZoom(String(lat), String(lon), 16.0);
      }
    }
  }

  renderMap() {
    if (Platform.OS === 'ios') {
      return (
        <VinylMapIOS
          style={{flex: 1}}
          onPress={(e) => {
            console.log(e.nativeEvent);
          }}
          onMarkerPress={() => {
            // console.log(e.nativeEvent);
            if (this.state.markerClicked === false) {
              // marker is clicked
              animateCardAppear();
            }
            this.setState({markerClicked: !this.state.markerClicked});
          }}
          onMapMove={(e) => {
            console.log('mapmoved', e.nativeEvent);
            const { gesture } = e.nativeEvent;
            const { trackingCurrentPos } = this.state;
            // if gesture is true, map is moved by user
            if (trackingCurrentPos && gesture) {
              LayoutAnimation.easeInEaseOut();
              this.setState({trackingCurrentPos: false});
            }
          }}
          onChangeCameraPosition={(e) => {
            // todo: rename this method since it is actually when camera position idle
            console.log('camera position changed: ', e.nativeEvent);
            const { latitude, longitude } = e.nativeEvent;

            this.props.setMapCameraPos({lat: latitude, lon: longitude});

            if (this.props.cameraWillMoveByPlaceDetailAPI) {
              this.props.setCameraWillMoveByPlaceDetailAPI(false);
            } else if (this.props.showApproveAddressCard === true) {
              this.props.setBusyWaitingGeocodingAPI(true);

              GOOGLE_MAPS_API.geocoding(latitude, longitude)
                .then(arr => {
                  this.props.setBusyWaitingGeocodingAPI(false);
                  // TODO: improve this
                  if (arr) {
                    this.props.setSearchedAddressTextView({
                      firstAddressToken: arr[0].long_name + ' ' + arr[1].long_name,
                      addressTextView: arr.slice(2).map(token => token.long_name + ' ')
                    });
                  }
                })
                .catch(err => {
                  this.props.setBusyWaitingGeocodingAPI(false);
                  console.log(err);
                });
            }
          }}
        />
      );
    }
    return (
      <VinylMapAndroid
        onLayout={() => {
          this.setState({ refViewForBlurView: findNodeHandle(this.refMapAndroid) });
        }}
        ref={component => {
          this.refMapAndroid = component;
        }}
        style={{flex: 1}}
      />
    );
  }

  renderLocationBtn() {
    if (Platform.OS === 'ios' && this.state.trackingCurrentPos) {
      /**
       * this is due to difference on dynamic components between ios and android
       * ref: https://github.com/Vinylize/Yetta-App/issues/69
       */
      return null;
    }
    let cardBottomVal;
    if (this.props.showApproveAddressCard) {
      cardBottomVal = 130;
    } else if (this.props.cardAppeared) {
      cardBottomVal = 100;
    } else {
      cardBottomVal = 80;
    }
    return (
      <TouchableOpacity
        style={{
          position: 'absolute',
          right: 26,
          bottom: cardBottomVal,
          height: (Platform.OS === 'android' && this.state.trackingCurrentPos) ? 0 : 25,
          width: 25,
          borderRadius: 20,
          backgroundColor: '#2E3031',
          shadowOffset: {height: 1, width: 1},
          shadowOpacity: 0.2,
          elevation: 3,
          zIndex: 1
        }}
        activeOpacity={1}
        onPress={() => {
          const { lat, lon } = this.props.currentLocation;
          console.log(lat, lon);
          if (Platform.OS === 'android') {
            vmm.animateToLocationWithZoom(lat, lon, 16.0);
          } else {
            vmm.animateToLocation(String(lat), String(lon));
          }
          LayoutAnimation.easeInEaseOut();
          this.setState({trackingCurrentPos: true});
        }}
      />
    );
  }

  renderMenuButton() {
    return (
      <TouchableOpacity
        style={{
          backgroundColor: 'transparent',
          position: 'absolute',
          left: 20,
          top: (this.props.searchBarExpanded) ? -50 : 46,
          width: 30,
          height: 24,
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 2,
          elevation: 70
        }}
        onPress={() => {
          if (this.props.searchBarExpanded === false) {
            animateMenuAppear(-WIDTH * 0.8);
          }
        }}
      >
        <Text style={{fontSize: 11}}>Menu</Text>
      </TouchableOpacity>
    );
  }

  renderAddBtn() {
    if (Platform.OS === 'ios' && this.props.cardAppeared) {
      /**
       * this is due to difference on dynamic components between ios and android
       * ref: https://github.com/Vinylize/Yetta-App/issues/69
       */
      return null;
    }
    return (
      <TouchableOpacity
        style={{
          position: 'absolute',
          right: (this.props.orderStatusList.length > 0) ? 20 : -40,
          bottom: 20,
          height: (Platform.OS === 'android' && this.props.cardAppeared) ? 0 : 40,
          width: 40,
          borderRadius: 50,
          backgroundColor: 'white',
          shadowOffset: {height: 1, width: 2},
          shadowOpacity: 0.23,
          elevation: 3,
          zIndex: 0
        }}
        onPress={() => {
          if (this.props.orderStatusList.length > 0) {
            animateCardAppear();
          }
        }}
      />
    );
  }

  renderAddressSearchPin() {
    const length = 40;
    return (
      <View style={{
        position: 'absolute',
        left: WIDTH / 2 - length / 2,
        top: HEIGHT / 2 - length / 2,
        width: length,
        height: length,
        zIndex: 10,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Text>핀</Text>
      </View>
    );
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#2E3031'}}>
        {this.renderMenuButton()}
        <Animated.View
          ref={component => {
            this.refViewContainerWithoutMenu = component;
          }}
          style={{flex: 1}}
        >
          {this.renderMap()}
          {this.renderAddBtn()}
          <SearchBar/>
          {this.renderLocationBtn()}
          <BottomCardView/>
          <ApproveCard navigator={this.props.navigation}/>
          {this.props.showApproveAddressCard ? this.renderAddressSearchPin() : <View/>}
        </Animated.View>
        <UserModeTransition
          show={this.props.busyWaitingUserModeSwitch}
          isRunner={this.props.isRunner}
          refViewForBlurView={this.state.refViewForBlurView}/>
        <GlobalLoading
          show={this.props.busyWaitingPlaceDetailAPI}
          refViewForBlurView={this.state.refViewForBlurView}
          msg={'위치 찾는중'}
        />
        <RunnerView
          waitingNewOrder={this.props.waitingNewOrder}
          setWaitingNewOrder={this.props.setWaitingNewOrder}
          runnerNotification={this.props.runnerNotification}
          onDelivery={this.props.onDelivery}
          setOnDelivery={this.props.setOnDelivery}
        />
        <RunnerOnDeliveryView
          isRunner={this.props.isRunner}
          waitingNewOrder={this.props.waitingNewOrder}
          setWaitingNewOrder={this.props.setWaitingNewOrder}
          runnerNotification={this.props.runnerNotification}
          onDelivery={this.props.onDelivery}
          setOnDelivery={this.props.setOnDelivery}
          setRunnerNotification={this.props.setRunnerNotification}
        />
        <Menu
          navigator={this.props.navigator}
          refBlurView={(Platform.OS === 'ios') ?
            this.refViewContainerWithoutMenu : this.refMapAndroid}/>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
    isRunner: state.userStatus.isRunner,
    busyWaitingPlaceDetailAPI: state.busyWaiting.busyWaitingPlaceDetailAPI,
    busyWaitingGeocodingAPI: state.busyWaiting.busyWaitingGeocodingAPI,
    busyWaitingUserModeSwitch: state.busyWaiting.busyWaitingUserModeSwitch,
    waitingNewOrder: state.runnerStatus.waitingNewOrder,
    onDelivery: state.runnerStatus.onDelivery,
    runnerNotification: state.pushNotification.runnerNotification,
    cameraWillMoveByPlaceDetailAPI: state.home.cameraWillMoveByPlaceDetailAPI,
    searchBarExpanded: state.home.searchBarExpanded,
    mapCameraPos: state.home.mapCameraPos,
    showApproveAddressCard: state.home.showApproveAddressCard,
    searchedAddressTextView: state.home.searchedAddressTextView,
    currentLocation: state.home.currentLocation,
    busyOnWaitingNewRunner: state.home.busyOnWaitingNewRunner,
    animatedCardBottomVal: state.home.animatedCardBottomVal,
    cardAppeared: state.bottomCardView.cardAppeared,
    orderStatusList: state.orderStatus.orderStatusList
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setIsRunner: (isRunner) => dispatch(setIsRunner(isRunner)),
    setBusyWaitingPlaceDetailAPI: (busyWaitingPlaceDetailAPI) => dispatch(setBusyWaitingPlaceDetailAPI(busyWaitingPlaceDetailAPI)),
    setBusyWaitingGeocodingAPI: (busyWaitingGeocodingAPI) => dispatch(setBusyWaitingGeocodingAPI(busyWaitingGeocodingAPI)),
    setWaitingNewOrder: (waitingNewOrder) => dispatch(setWaitingNewOrder(waitingNewOrder)),
    setRunnerNotification: (isRunner) => dispatch(setRunnerNotification(isRunner)),
    setOnDelivery: (onDelivery) => dispatch(setOnDelivery(onDelivery)),
    setCameraWillMoveByPlaceDetailAPI: (cameraWillMoveByPlaceDetailAPI) =>
      dispatch(setCameraWillMoveByPlaceDetailAPI(cameraWillMoveByPlaceDetailAPI)),
    setSearchBarExpanded: (searchBarExpanded) => dispatch(setSearchBarExpanded(searchBarExpanded)),
    setMapCameraPos: (mapCameraPos) => dispatch(setMapCameraPos(mapCameraPos)),
    setShowApproveAddressCard: (showApproveAddressCard) => dispatch(setShowApproveAddressCard(showApproveAddressCard)),
    setSearchedAddressTextView: (searchedAddressTextView) => dispatch(setSearchedAddressTextView(searchedAddressTextView)),
    setCurrentLocation: (currentLocation) => dispatch(setCurrentLocation(currentLocation)),
    setBusyOnWaitingNewRunner: (busyOnWaitingNewRunner) => dispatch(setBusyOnWaitingNewRunner(busyOnWaitingNewRunner))
  };
};

Home.propTypes = {
  navigator: PropTypes.any.isRequired,
  navigation: PropTypes.any.isRequired,

  // reducers/auth
  user: PropTypes.object,

  // reducers/userStatus
  isRunner: PropTypes.bool,
  setIsRunner: PropTypes.func,

  // reducers/busyWaiting
  busyWaitingPlaceDetailAPI: PropTypes.bool,
  busyWaitingGeocodingAPI: PropTypes.bool,
  busyWaitingUserModeSwitch: PropTypes.bool,
  setBusyWaitingPlaceDetailAPI: PropTypes.func,
  setBusyWaitingGeocodingAPI: PropTypes.func,

  // reducers/runnerStatus
  waitingNewOrder: PropTypes.bool,
  setWaitingNewOrder: PropTypes.func,
  onDelivery: PropTypes.bool,
  setOnDelivery: PropTypes.func,

  // reducers/pushNotification
  runnerNotification: PropTypes.any,
  setRunnerNotification: PropTypes.func,

  // reducers/components/home
  cameraWillMoveByPlaceDetailAPI: PropTypes.bool,
  setCameraWillMoveByPlaceDetailAPI: PropTypes.func,
  searchBarExpanded: PropTypes.bool,
  setSearchBarExpanded: PropTypes.func,
  mapCameraPos: PropTypes.object,
  setMapCameraPos: PropTypes.func,
  showApproveAddressCard: PropTypes.bool,
  setShowApproveAddressCard: PropTypes.func,
  searchedAddressTextView: PropTypes.object,
  setSearchedAddressTextView: PropTypes.func,
  currentLocation: PropTypes.object,
  setCurrentLocation: PropTypes.func,
  busyOnWaitingNewRunner: PropTypes.bool,
  setBusyOnWaitingNewRunner: PropTypes.func,
  animatedCardBottomVal: PropTypes.any,

  // reducers/components/bottomCardView
  cardAppeared: PropTypes.bool,

  // reducers/orderStatus
  orderStatusList: PropTypes.array
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
