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
  Easing,
  DeviceEventEmitter,
  ActivityIndicator
} from 'react-native';
import * as firebase from 'firebase';
import {
  createOrderNavigatorRoute,
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
const cardWidth = WIDTH * 0.92;
export const expandedCardHeight = HEIGHT * 0.43;
const cardHeight = 90;
export const cardInitBottom = -expandedCardHeight + cardHeight;
export const cardHidedBottom = -expandedCardHeight;
const menuWidth = WIDTH;

const PLATFORM_SPECIFIC = {
  animatedCardLeftVal: (Platform.OS === 'ios') ? 0 : -WIDTH
};

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
      animatedCardLeftVal: new Animated.Value(PLATFORM_SPECIFIC.animatedCardLeftVal),
      animMenu: new Animated.Value(-menuWidth),
      cardIndex: 0,
      cardExpanded: false,
      cardAppeared: false,
      busyOnCardMoveX: false,
      busyOnCardMoveY: false,
      processState: 2,
      trackingCurrentPos: false,
      refViewForBlurView: null,
      userModeSwitchBtnClicked: false,
      showRunnerView: false
    };
    this.initialLocationUpdate = false;
  }

  componentWillMount() {
    this.cardPanResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: this.cardHandlePanResponderGrant.bind(this),
      onPanResponderMove: this.cardHandlePanResponderMove.bind(this),
      onPanResponderRelease: this.cardHandlePanResponderRelease.bind(this)
    });
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

  cardHandlePanResponderGrant() {
    // TBD
  }

  cardHandlePanResponderMove(e, gestureState) {
    const { dx, dy } = gestureState;
    const { busyOnCardMoveX, busyOnCardMoveY, cardExpanded } = this.state;
    if (!busyOnCardMoveY) {
      if (busyOnCardMoveX || (Math.abs(dx) > 5 && Math.abs(dy) < 10)) {
        this.setState({busyOnCardMoveX: true});
        this.refViewCardContainer.setNativeProps({style: {left: dx}});
      } else if (cardInitBottom - dy <= 0 && !busyOnCardMoveX) {
        if (busyOnCardMoveX === false) {
          let cardBottomValOnTouch;
          /* eslint-disable max-depth */
          if (cardExpanded) {
            /* eslint-enable max-depth */
            cardBottomValOnTouch = (dy >= 0) ? -dy : 0;
          } else {
            cardBottomValOnTouch = cardInitBottom - dy;
          }
          this.refViewCardContainer.setNativeProps({style: {bottom: cardBottomValOnTouch}});
        }
      }
    }
  }

  cardHandlePanResponderRelease(e, gestureState) {
    const { dx, dy } = gestureState;
    const { busyOnCardMoveX, busyOnCardMoveY, cardExpanded } = this.state;
    if (!busyOnCardMoveY) {
      if (Math.abs(dx) < WIDTH / 4 && dy === 0) {
        this.animateCardPosResetX(dx);
      } else if (busyOnCardMoveX && dx > 0) {
        // move card to the left
        this.animateCardPosLeft(dx);
      } else if (busyOnCardMoveX && dx < 0) {
        // move card to the right
        this.animateCardPosRight(dx);
      } else if (dy < 0 && !cardExpanded) {
        // expand card
        this.setState({busyOnCardMoveY: true});
        this.animateCardExpand(dy);
      } else if (dy > 0 && cardExpanded) {
        // shrink card after expanded
        this.animateCardPosResetY(dy);
      } else if (dy > 0 && !cardExpanded) {
        // hide card
        this.animateCardHide(dy);
      }
      this.setState({
        busyOnCardMoveX: false
      });
    }
  }

  animateCardPosResetX(left) {
    this.state.animatedCardLeftVal.setValue(left);
    Animated.timing(
      this.state.animatedCardLeftVal,
      {
        toValue: 0,
        duration: 100,
        easing: Easing.linear
      }
    ).start();
  }

  animateCardPosResetY(dy) {
    this.props.animatedCardBottomVal.setValue(-dy);
    Animated.timing(
      this.props.animatedCardBottomVal,
      {
        toValue: cardInitBottom,
        duration: 100,
        easing: Easing.linear
      }
    ).start(() => {
      this.setState({
        cardExpanded: false
      });
    });
  }

  animateCardPosLeft(left) {
    this.state.animatedCardLeftVal.setValue(left);
    Animated.timing(
      this.state.animatedCardLeftVal,
      {
        toValue: cardWidth + 10,
        duration: 200,
        easing: Easing.linear
      }
    ).start(() => {
      this.setState({cardIndex: this.state.cardIndex - 1});
      this.refViewCardContainer.setNativeProps({style: {left: 0}});
      this.state.animatedCardLeftVal.setValue(0);
    });
  }

  animateCardPosRight(left) {
    this.state.animatedCardLeftVal.setValue(left);
    Animated.timing(
      this.state.animatedCardLeftVal,
      {
        toValue: -cardWidth - 10,
        duration: 200,
        easing: Easing.linear
      }
    ).start(() => {
      this.setState({cardIndex: this.state.cardIndex + 1});
      this.refViewCardContainer.setNativeProps({style: {left: 0}});
      this.state.animatedCardLeftVal.setValue(0);
    });
  }

  animateCardExpand(dy) {
    if (cardInitBottom - dy <= 0) {
      this.props.animatedCardBottomVal.setValue(cardInitBottom - dy);
      Animated.timing(
        this.props.animatedCardBottomVal,
        {
          toValue: 0,
          duration: 100,
          easing: Easing.linear
        }
      ).start(() => {
        this.setState({
          busyOnCardMoveY: false,
          cardExpanded: true
        });
      });
    } else {
      this.props.animatedCardBottomVal.setValue(0);
      this.setState({
        busyOnCardMoveY: false,
        cardExpanded: true
      });
    }
  }

  animateCardAppear() {
    this.props.animatedCardBottomVal.setValue(-expandedCardHeight);
    Animated.timing(
      this.props.animatedCardBottomVal,
      {
        toValue: cardInitBottom,
        duration: 100,
        easing: Easing.linear
      }
    ).start();
  }

  animateCardHide(dy) {
    this.props.animatedCardBottomVal.setValue(cardInitBottom - dy);
    Animated.timing(
      this.props.animatedCardBottomVal,
      {
        toValue: -expandedCardHeight,
        duration: 100,
        easing: Easing.linear
      }
    ).start(() => {
      LayoutAnimation.easeInEaseOut();
      this.setState({cardAppeared: false});
    });
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

  handleCreateOrderDone() {
    this.props.navigator.pop();
    this.animateCardAppear();

    /**
     * this disables native API that returns coordinate of the map center
     * todo: implement this in Android
     */
    if (Platform.OS === 'ios') {
      vmm.disableDidChangeCameraPosition();
    }

    this.props.setBusyOnWaitingNewRunner(true);
  }

  handleSearchedAddressApproveBtn() {
    this.props.navigator.push(createOrderNavigatorRoute(
      this.handleCreateOrderDone.bind(this)
    ));
    this.props.setShowApproveAddressCard(false);
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
              this.animateCardAppear();
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

  renderCard(left, header) {
    return (
      <View
        style={{
          position: 'absolute',
          width: cardWidth,
          height: expandedCardHeight - 20,
          backgroundColor: 'white',
          left: left,
          flexDirection: 'column',
          shadowOffset: {height: 1, width: 2},
          shadowOpacity: 0.23,
          elevation: 2
        }}
        {...this.cardPanResponder.panHandlers}
      >
        <View style={{
          flex: 1,
          flexDirection: 'row'
        }}>
          <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'flex-end'
          }}>
            {this.props.busyOnWaitingNewRunner ?
              <ActivityIndicator
                animating={true}
                style={{
                  width: 56,
                  height: 56
                }}
                size="large"
              />
              :
              <View style={{
                width: 56,
                height: 56,
                borderRadius: 50,
                backgroundColor: '#d8d8d8'
              }}/>
            }
          </View>
          <View style={{
            flex: 3.5,
            flexDirection: 'row'
          }}>
            <View style={{
              flex: 4,
              flexDirection: 'column'
            }}>
              <View style={{
                flex: 1,
                justifyContent: 'flex-end',
                alignItems: 'flex-start'
              }}>
                <Text style={{
                  marginBottom: 3,
                  marginLeft: 12
                }}>{this.props.busyOnWaitingNewRunner ?
                  '근처의 러너를 찾는중'
                  : header}</Text>
              </View>
              <View style={{flex: 1}}>
                <Text style={{
                  marginTop: 6,
                  marginLeft: 12,
                  fontSize: 11,
                  color: '#adb3b4'
                }}>$3,500 - 4,500 (Delivery fee only)</Text>
              </View>
            </View>
            <View style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <View style={{
                width: 40,
                height: 40,
                backgroundColor: '#656266',
                borderRadius: 40,
                shadowOffset: {height: 3, width: 1},
                shadowOpacity: 0.4,
                shadowRadius: 5,
                marginRight: 25
              }} />
            </View>
          </View>
        </View>
        {this.renderCardDetail()}
      </View>
    );
  }

  renderCardDetail() {
    return (
      <View
        style={{
          flex: 2,
          marginLeft: 20,
          marginRight: 20,
          borderTopWidth: 1,
          borderColor: '#f4f7f7',
          flexDirection: 'row'
        }}
      >
        <View style={{flex: 3}}>
          {this.renderProcess()}
        </View>
        <View style={{
          flex: 2,
          flexDirection: 'column'
        }}>
          <View style={{
            flex: 1,
            flexDirection: 'row'
          }}>
            <View style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <View style={{
                height: 40,
                width: 40,
                borderRadius: 40,
                backgroundColor: 'white',
                borderWidth: 1,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column'
              }}>
                <Text style={{
                  fontSize: 10
                }}>
                  32
                </Text>
                <Text style={{
                  fontSize: 11
                }}>
                  MIN
                </Text>
              </View>
            </View>
            <View style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <View style={{
                height: 40,
                width: 40,
                borderRadius: 40,
                backgroundColor: 'white',
                borderWidth: 1,
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <Text style={{
                  fontSize: 10
                }}>
                  0.5
                </Text>
                <Text style={{
                  fontSize: 11
                }}>
                  km
                </Text>
              </View>
            </View>
          </View>
          <View style={{
            flex: 1,
            flexDirection: 'column'
          }}>
            <View style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'flex-end',
              marginRight: 10
            }}>
              <Text style={{
                fontSize: 12,
                color: '#3aacff',
                fontWeight: 'bold'
              }}>
                See the receipt
              </Text>
            </View>
            <View style={{
              flex: 1,
              justifyContent: 'flex-end',
              alignItems: 'flex-end',
              marginRight: 10
            }}>
              <Text style={{
                fontSize: 13,
                color: 'black',
                fontWeight: 'bold',
                marginBottom: 20
              }}>
                Cancel
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  renderProcess() {
    const renderDot = (index) => {
      return (
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <View style={{
            height: 11,
            width: 11,
            borderRadius: 10,
            backgroundColor: (index <= this.state.processState) ? '#2e3031' : '#eaefef'
          }}/>
        </View>
      );
    };
    const renderProcessLine = (index, top) => {
      // todo: fix style
      return (
        <View style={{
          position: 'absolute',
          left: 0,
          top: top,
          zIndex: -1
        }}>
          <View style={{
            position: 'absolute',
            left: (index < this.state.processState) ? 20 : 19,
            top: top,
            borderWidth: (index < this.state.processState) ? 1 : 2,
            borderStyle: (index < this.state.processState) ? 'solid' : 'dotted',
            borderColor: (index < this.state.processState) ? '#2e3031' : '#eaefef',
            width: 0.1,
            height: 40
          }}/>
        </View>
      );
    };
    const renderTextProcess = (index, text) => {
      return (
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'flex-start'
        }}>
          <Text style={{
            fontSize: 11.4,
            color: (index <= this.state.processState) ? '#2e3031' : '#eaefef'
          }}>{text}</Text>
        </View>
      );
    };
    return (
      <View style={{
        flex: 1,
        flexDirection: 'row',
        marginTop: 20,
        marginBottom: 20
      }}>
        <View style={{
          flex: 1,
          flexDirection: 'column'
        }}>
          {renderDot(0)}
          {renderDot(1)}
          {renderDot(2)}
          {renderDot(3)}
          {renderProcessLine(0, 8)}
          {renderProcessLine(1, 25)}
          {renderProcessLine(2, 8 + 17 * 2)}
        </View>
        <View style={{
          flex: 3.4,
          flexDirection: 'column'
        }}>
          {renderTextProcess(0, 'Order accepted')}
          {renderTextProcess(1, 'Delivery started')}
          {renderTextProcess(2, 'Item bought')}
          {renderTextProcess(3, 'Delivery completed')}
        </View>
      </View>
    );
  }

  renderCardContainer() {
    const {
      animatedCardLeftVal,
      cardIndex
    } = this.state;

    return (
      <Animated.View
        ref={component => {
          this.refViewCardContainer = component;
        }}
        style={{
          position: 'absolute',
          left: animatedCardLeftVal,
          bottom: this.props.animatedCardBottomVal,
          width: WIDTH * 3,
          height: expandedCardHeight,
          zIndex: 1
        }}
      >
        {this.renderCard(-cardWidth, cardIndex - 1)}
        {this.renderCard(10, cardIndex)}
        {this.renderCard(cardWidth + 20, cardIndex + 1)}
      </Animated.View>
    );
  }

  renderAddBtn() {
    if (Platform.OS === 'ios' && this.state.cardAppeared) {
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
          height: (Platform.OS === 'android' && this.state.cardAppeared) ? 0 : 40,
          width: 40,
          borderRadius: 50,
          backgroundColor: 'white',
          shadowOffset: {height: 1, width: 2},
          shadowOpacity: 0.23,
          elevation: 3,
          zIndex: 0
        }}
        onPress={() => {
          this.animateCardAppear();
          this.setState({cardAppeared: true});
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
          {this.renderCardContainer()}
          <ApproveCard
            navigator={this.props.navigator}
            address={this.props.searchedAddressTextView}
            handleApproveBtn={this.handleSearchedAddressApproveBtn.bind(this)}
            busyWaitingGeocodingAPI={this.props.busyWaitingGeocodingAPI}
          />
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
    animatedCardBottomVal: state.home.animatedCardBottomVal
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
  animatedCardBottomVal: PropTypes.any
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
