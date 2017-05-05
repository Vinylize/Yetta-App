import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  findNodeHandle,
  Text,
  View,
  Dimensions,
  LayoutAnimation,
  Image,
  PanResponder,
  Platform,
  NativeModules,
  NativeEventEmitter,
  TouchableOpacity,
  Animated,
  DeviceEventEmitter
} from 'react-native';
import * as firebase from 'firebase';
import {
  profileNavigatorRoute,
  settingsNavigatorRoute,
  paymentInfoNavigatorRoute,
  orderHistoryNavigatorRoute
} from '../navigator/navigatorRoutes';

import VinylMapAndroid from './VinylMapAndroid';
import VinylMapIOS from './VinylMapIOS';
import SearchBar from './searchAddress/searchBar';
import ApproveCard from './searchAddress/approveCard';
import RunnerView from './runnerView/runnerView';
import RunnerOnDeliveryView from './runnerView/runnerOnDeliveryView';
import BottomCardView from './bottomCardView';
import { URL } from './../utils';
import * as GOOGLE_MAPS_API from './../service/GoogleMapsAPI';

// [start redux functions]
import { setIsRunner } from './../actions/userStatusActions';
import {
  setBusyWaitingPlaceDetailAPI,
  setBusyWaitingGeocodingAPI
} from './../actions/busyWaitingActions';
import {
  setWaitingNewOrder,
  setOnDelivery
} from './../actions/runnerStatusActions';
import { setRunnerNotification } from './../actions/pushNotificationActions';
import {
  setCameraWillMoveByPlaceDetailAPI,
  setSearchBarExpanded,
  setMapCameraPos,
  setShowApproveAddressCard,
  setSearchedAddressTextView,
  setCurrentLocation,
  setBusyOnWaitingNewRunner
} from './../actions/componentsActions/homeActions';
import {
  animateCardAppear,
  setCardAppeared
} from './../actions/componentsActions/bottomCardActions';
// [end redux functions]

import UserModeTransition from './globalViews/userModeTransition';
import GlobalLoading from './globalViews/loading';

let vmm = NativeModules.VinylMapManager;

const Lokka = require('lokka').Lokka;
const Transport = require('lokka-transport-http').Transport;

const client = new Lokka({
  transport: new Transport(URL)
});

const { YettaLocationServiceManger } = NativeModules;
const locationServiceManagerEmitter = new NativeEventEmitter(YettaLocationServiceManger);

// constants
const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;
export const expandedCardHeight = HEIGHT * 0.43;
const cardHeight = 90;
export const cardInitBottom = -expandedCardHeight + cardHeight;
export const cardHidedBottom = -expandedCardHeight;
const menuWidth = WIDTH;

class Home extends Component {
  constructor() {
    super();
    this.state = {
      // todo: remove unnecessary states
      text: '',
      toggle: false,
      menuClicked: false,
      shrinkValue: new Animated.Value(1),
      markerTest: false,
      clickedMarkerID: undefined,
      animMenu: new Animated.Value(-menuWidth),
      trackingCurrentPos: false,
      refViewForBlurView: null,
      userModeSwitchBtnClicked: false,
      showRunnerView: false
    };
    this.initialLocationUpdate = false;
  }

  componentWillMount() {
    this.menuPanResponder = PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: this.menuHandlePanResponderMove.bind(this),
      onPanResponderRelease: this.menuHandlePanResponderRelease.bind(this)
    });
    this.switchPanResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: this.handleSwitch.bind(this)
    });
    this.profilePanResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: this.handleProfile.bind(this)
    });
    this.paymentInfoPanResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: this.handlePaymentInfo.bind(this)
    });
    this.orderHistoryPanResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: this.handleOrderHistory.bind(this)
    });
    this.settingsPanResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: this.navigateToSettings.bind(this)
    });
    this.menuBackgroundPanResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderRelease: this.hideMenuWhenBackgroundTapped.bind(this)
    });


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

    this.state.animMenu.addListener(value => {
      this.animMenuValue = value.value;
      /**
       * todo: resolve issue only in Android
       * msg: The specified child already has a parent. You must call removeView() on the child's parent first.
       */

      if (Platform.OS === 'ios') {
        this.refViewContainerWithoutMenu.setNativeProps({style: {opacity: -value.value / menuWidth + 0.2}});
      } else if (Platform.OS === 'android') {
        this.refMapAndroid.setNativeProps({style: {opacity: -value.value / menuWidth + 0.2}});
      }
    });

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
          firebase.auth().currentUser.getToken().then(token => this.userUpdateCoordinateHelper(token, data));
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
          firebase.auth().currentUser.getToken().then(token => this.userUpdateCoordinateHelper(token, data));
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
            firebase.auth().currentUser.getToken().then(token => this.userUpdateCoordinateHelper(token, data));
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

  userUpdateCoordinateHelper(token, data) {
    // console.log(token);
    client._transport._httpOptions.headers = {
      authorization: token
    };
    client.mutate(`{
            runnerUpdateCoordinate(
              input:{
                lat: ${data.latitude},
                lon: ${data.longitude}
              }
            ) {
              result
            }
          }`
    )
      .then(console.log)
      .catch(console.log);
  }

  componentDidMount() {
    const { lat, lon } = this.props.currentLocation;
    if (vmm) {
      if (Platform.OS === 'ios') {
        vmm.animateToLocationWithZoom(String(lat), String(lon), 16.0);
      }
    }
  }

  /*
   * switch to either runner/order
   */
  handleSwitch() {
    this.props.setIsRunner(!this.props.isRunner);
    this.setState(() => {
      return {userModeSwitchBtnClicked: true};
    });

    this.animateMenuHide();

    // todo: this should be done dynamically. Remove.
    setTimeout(() => {
      this.setState(() => {
        return {
          userModeSwitchBtnClicked: false,
          showRunnerView: !this.state.showRunnerView
        };
      });
    }, 2000);
  }

  handleProfile() {
    this.props.navigator.push(profileNavigatorRoute());
  }

  handlePaymentInfo() {
    this.props.navigator.push(paymentInfoNavigatorRoute());
  }

  handleOrderHistory() {
    this.props.navigator.push(orderHistoryNavigatorRoute());
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
    return (
      <TouchableOpacity
        style={{
          position: 'absolute',
          right: 26,
          bottom: (this.props.showApproveAddressCard) ? 130 : 80,
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

  animateMenuAppear(dx) {
    if (dx) {
      this.state.animMenu.setValue(dx);
    }
    Animated.timing(
      this.state.animMenu,
      {
        toValue: 0,
        duration: 500
      }
    ).start();
  }

  animateMenuHide(dx) {
    if (dx) {
      this.state.animMenu.setValue(dx);
    }
    Animated.timing(
      this.state.animMenu,
      {
        toValue: -WIDTH,
        duration: 500
      }
    ).start();
  }

  checkIfMenuInMiddle() {
    return (this.animMenuValue < 0 || this.animMenuValue > -WIDTH * 0.8);
  }

  hideMenuWhenBackgroundTapped() {
    this.animateMenuHide();
  }

  menuHandlePanResponderMove(e, gestureState) {
    const { dx } = gestureState;
    // console.log(this.animMenuValue);
    if (this.checkIfMenuInMiddle()) {
      // menu is touched while animating
      this.state.animMenu.stopAnimation();
    }
    if (this.animMenuValue + dx < 0) {
      this.refMenu.setNativeProps({style: {left: dx + this.animMenuValue}});
      if (Platform.OS === 'ios') {
        this.refViewContainerWithoutMenu.setNativeProps({style: {opacity: -(dx + this.animMenuValue) / menuWidth + 0.2}});
      } else if (Platform.OS === 'android') {
        this.refMapAndroid.setNativeProps({style: {opacity: -(dx + this.animMenuValue) / menuWidth + 0.2}});
      }
    }
  }

  menuHandlePanResponderRelease(e, gestureState) {
    const { dx } = gestureState;
    if (this.checkIfMenuInMiddle() && (this.animMenuValue + dx) < 0) {
      if (this.animMenuValue + dx > -WIDTH * 0.4) {
        this.animateMenuAppear(this.animMenuValue + dx);
      } else {
        this.animateMenuHide(this.animMenuValue + dx);
      }
    }
  }

  renderMenu() {
    return (
      <Animated.View
        ref={component => {
          this.refMenu = component;
        }}
        style={{
          position: 'absolute',
          left: this.state.animMenu,
          top: 0,
          zIndex: 3,
          backgroundColor: 'transparent',
          width: WIDTH,
          height: HEIGHT - ((Platform.OS === 'android') ? 20 : 0),
          flexDirection: 'row',
          shadowOffset: {height: 1, width: 1},
          shadowOpacity: 0.2,
          elevation: 100
        }}
        {...this.menuPanResponder.panHandlers}
      >
        <View style={{
          flex: 75,
          paddingLeft: 48,
          borderBottomWidth: 1,
          borderColor: '#e0e3e5',
          width: WIDTH * 0.75,
          height: HEIGHT,
          backgroundColor: 'white',
          flexDirection: 'column',
          elevation: 30
        }}>
          <Image style={{
            height: 105,
            width: 105,
            borderRadius: 52.5,
            marginTop: 56
          }} source={require('../../assets/defaultProfileImg.png')}/>
          <View style={{
            marginTop: 20,
            flexDirection: 'row'
          }}>
            <Text style={{fontSize: 17, flex: 1, fontWeight: '600'}}>{this.props.user.n}</Text>
            <View
              style={{marginRight: 50, padding: 3, alignItems: 'flex-end'}}
              {...this.profilePanResponder.panHandlers}
            >
              <Text style={{fontSize: 11}}>EDIT</Text>
            </View>
          </View>
          <View style={{marginTop: 9}}>
            <Text style={{fontSize: 13}}>{this.props.user.e}</Text>
          </View>
          <View style={{
            elevation: 30,
            marginTop: HEIGHT * 0.06,
            width: WIDTH * 0.75 - 48
          }}>
            <TouchableOpacity
              style ={{
                marginRight: 10
              }}
            >
              <Text
                style={{fontSize: 18, marginTop: 48}}
                {...this.paymentInfoPanResponder.panHandlers}
              >
                결제정보
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style ={{
                marginRight: 10
              }}>
              <Text style={{fontSize: 18, marginTop: 31}}
                    {...this.orderHistoryPanResponder.panHandlers}
              >
                주문내역
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style ={{
                marginRight: 10
              }}>
              <Text style={{
                fontSize: 18,
                marginTop: 31
              }}>
                고객센터
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style ={{
                marginRight: 10
              }}
            >
              <Text
                style={{fontSize: 18, marginTop: 31}}
                {...this.settingsPanResponder.panHandlers}
              >
                설정
              </Text>
            </TouchableOpacity>
          </View>
          {this.renderSwitchBtn()}
        </View>
        <View
          style={{flex: 30, backgroundColor: 'transparent'}}
          {...this.menuBackgroundPanResponder.panHandlers}
        />
      </Animated.View>
    );
  }

  navigateToSettings() {
    this.props.navigator.push(settingsNavigatorRoute());
  }

  renderSwitchBtn() {
    return (
      // todo: improve the platform specific bottom value
      <View
        style={{
          position: 'absolute',
          bottom: (Platform.OS === 'ios') ? -1 : 23,
          left: 0,
          paddingRight: 16,
          backgroundColor: '#ff9700',
          height: 40,
          width: WIDTH * 0.75,
          justifyContent: 'center',
          alignItems: 'flex-end'
        }}
        {...this.switchPanResponder.panHandlers}
      >
        <Text style={{fontSize: 15, color: 'white'}}>
          {(this.props.isRunner) ? '주문받기' : '배달하기'}
        </Text>
      </View>
    );
  }

  renderMenuButton() {
    // const { menuClicked } = this.state;
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
          // this.setState({menuClicked: !menuClicked});
          if (this.props.searchBarExpanded === false) {
            this.animateMenuAppear(-WIDTH * 0.8);
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
          right: 20,
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
          animateCardAppear();
          this.props.setCardAppeared(true);
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
        {this.renderMenu()}
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
          <ApproveCard navigator={this.props.navigator}/>
          {this.props.showApproveAddressCard ? this.renderAddressSearchPin() : <View/>}
        </Animated.View>
        <UserModeTransition
          show={this.state.userModeSwitchBtnClicked}
          isRunner={this.props.isRunner}
          refViewForBlurView={this.state.refViewForBlurView}/>
        <GlobalLoading
          show={this.props.busyWaitingPlaceDetailAPI}
          refViewForBlurView={this.state.refViewForBlurView}
          msg={'위치 찾는중'}
        />
        <RunnerView
          isRunner={this.state.showRunnerView}
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
    cardAppeared: state.bottomCardView.cardAppeared
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
    setBusyOnWaitingNewRunner: (busyOnWaitingNewRunner) => dispatch(setBusyOnWaitingNewRunner(busyOnWaitingNewRunner)),
    setCardAppeared: (cardAppeared) => dispatch(dispatch(setCardAppeared(cardAppeared)))
  };
};

Home.propTypes = {
  navigator: PropTypes.any,
  user: PropTypes.object,

  // userStatus
  isRunner: PropTypes.bool,
  setIsRunner: PropTypes.func,

  // busyWaiting
  busyWaitingPlaceDetailAPI: PropTypes.bool,
  busyWaitingGeocodingAPI: PropTypes.bool,
  setBusyWaitingPlaceDetailAPI: PropTypes.func,
  setBusyWaitingGeocodingAPI: PropTypes.func,

  // runnerStatus
  waitingNewOrder: PropTypes.bool,
  setWaitingNewOrder: PropTypes.func,
  onDelivery: PropTypes.bool,
  setOnDelivery: PropTypes.func,

  // pushNotification
  runnerNotification: PropTypes.any,
  setRunnerNotification: PropTypes.func,

  // components/home
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

  // components/bottomCardView
  cardAppeared: PropTypes.bool,
  setCardAppeared: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);