import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  Animated,
  Dimensions,
  Image,
  PanResponder,
  Platform,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import {
  profileNavigatorRoute,
  settingsNavigatorRoute,
  paymentInfoNavigatorRoute,
  orderHistoryNavigatorRoute
} from '../navigator/navigatorRoutes';

// [start redux functions]
import { setIsRunner } from './../actions/userStatusActions';
import {
  animateMenuAppear,
  animateMenuHide
} from './../actions/componentsActions/menuActions';
import { setBusyWaitingUserModeSwitch } from './../actions/busyWaitingActions';
// [end redux functions]

// constants
const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;
export const menuWidth = WIDTH;

class Menu extends Component {
  constructor() {
    super();
    this.state = {
      userModeSwitchBtnClicked: false
    };
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

    this.props.animMenu.addListener(value => {
      this.animMenuValue = value.value;
      /**
       * todo: resolve issue only in Android
       * msg: The specified child already has a parent. You must call removeView() on the child's parent first.
       */
      this.props.refBlurView.setNativeProps({style: {opacity: -value.value / menuWidth + 0.2}});
    });
  }

  checkIfMenuInMiddle() {
    return (this.animMenuValue < 0 || this.animMenuValue > -WIDTH * 0.8);
  }

  menuHandlePanResponderMove(e, gestureState) {
    const { dx } = gestureState;
    // console.log(this.animMenuValue);
    if (this.props.busyWaitingUserModeSwitch === false && this.checkIfMenuInMiddle()) {
      // menu is touched while animating
      this.props.animMenu.stopAnimation();
    }
    if (this.animMenuValue + dx < 0) {
      this.refMenu.setNativeProps({style: {left: dx + this.animMenuValue}});
      this.props.refBlurView.setNativeProps({style: {opacity: -(dx + this.animMenuValue) / menuWidth + 0.2}});
    }
  }

  menuHandlePanResponderRelease(e, gestureState) {
    const { dx } = gestureState;
    if (this.checkIfMenuInMiddle() && (this.animMenuValue + dx) < 0) {
      if (this.props.busyWaitingUserModeSwitch === false && this.animMenuValue + dx > -WIDTH * 0.4) {
        animateMenuAppear(this.animMenuValue + dx);
      } else {
        animateMenuHide(this.animMenuValue + dx);
      }
    }
  }

  /*
   * switch to either runner/order
   */
  handleSwitch() {
    this.props.setBusyWaitingUserModeSwitch(true);
    animateMenuHide();

    // todo: this should be done dynamically. Remove.
    setTimeout(() => {
      this.props.setBusyWaitingUserModeSwitch(false);
      this.props.setIsRunner(!this.props.isRunner);
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

  navigateToSettings() {
    this.props.navigator.push(settingsNavigatorRoute());
  }

  hideMenuWhenBackgroundTapped() {
    animateMenuHide();
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

  render() {
    return (
      <Animated.View
        ref={component => {
          this.refMenu = component;
        }}
        style={{
          position: 'absolute',
          left: this.props.animMenu,
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
}

Menu.propTypes = {
  navigator: PropTypes.any.isRequired,
  refBlurView: PropTypes.any.isRequired,

  // reducers/components/menu
  animMenu: PropTypes.any,

  // reducers/auth
  user: PropTypes.object,

  // reducers/userStatus
  isRunner: PropTypes.bool,
  setIsRunner: PropTypes.func,

  // reducers/busyWaiting
  busyWaitingUserModeSwitch: PropTypes.bool,
  setBusyWaitingUserModeSwitch: PropTypes.func
};

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
    isRunner: state.userStatus.isRunner,
    animMenu: state.menu.animMenu,
    busyWaitingUserModeSwitch: state.busyWaiting.busyWaitingUserModeSwitch
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setIsRunner: (isRunner) => dispatch(setIsRunner(isRunner)),
    setBusyWaitingUserModeSwitch: (busyWaitingUserModeSwitch) => dispatch(setBusyWaitingUserModeSwitch(busyWaitingUserModeSwitch))
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(Menu);
