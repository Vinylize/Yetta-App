import React, { Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import {
  Dimensions,
  Image,
  LayoutAnimation,
  NativeModules,
  Platform,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import IdVerification from './../idVerification/idVerification';

import { AnimatedCircularProgress } from 'react-native-circular-progress';
import Animation from 'lottie-react-native';
import BackgroundTimer from 'react-native-background-timer';
import { handleError } from './../../utils/errorHandlers';
import RunnerDashboard from './runnerDashboard';

import * as YettaServerAPIclient from './../../service/YettaServerAPI/client';
import * as YettaServerAPIorder from './../../service/YettaServerAPI/order';

// redux functions
import { setRefRunnerView } from './../../actions/componentsActions/runnerViewActions';
import { setBusyWaitingRunnerCatchingOrder } from './../../actions/busyWaitingActions';
import {
  setWaitingNewOrder,
  setOnDelivery
} from '../../actions/runnerStatusActions';
import { setRunnerNotification } from '../../actions/pushNotificationActions';

// assets
import loadingJSON from './../../../assets/lottie/loading-2.json';
import IMG_CLOCK from './../../../assets/clock.png';

const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;

const styles = {
  container: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: WIDTH,
    height: HEIGHT,
    backgroundColor: 'black',
    alignItems: 'center',
    elevation: 50,
    zIndex: 1
  }
};

class RunnerView extends Component {
  constructor() {
    super();
    this.state = {
      fill: 100,
      receivedNewOrder: false,
      lastOrderId: undefined
    };
    this.startCount = this.startCount.bind(this);
    this.handleCancelLookingForNewOrderBtn = this.handleCancelLookingForNewOrderBtn.bind(this);
    this.handleCatchNewOrderBtn = this.handleCatchNewOrderBtn.bind(this);
  }

  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }

  componentWillReceiveProps(nextProps) {
    const { runnerNotification } = nextProps;
    if (this.state.receivedNewOrder === false) {
      if (runnerNotification && runnerNotification.length > 0) {
        const { data } = runnerNotification[runnerNotification.length - 1].data;
        __DEV__ && console.log(data); // eslint-disable-line no-undef

        // if newly received notification's data id is different from the previous one
        if (data && data !== this.state.lastOrderId) {
          YettaServerAPIorder.getInitialOrderDetailsForRunner(data)
            .then(() => {
              this.setState({
                receivedNewOrder: true,
                lastOrderId: data
              });
              this.startCount();
            })
            .catch(err => {
              __DEV__ && console.log(err); // eslint-disable-line no-undef
            });
        }
      }
    }
  }

  startCount() {
    const startedTime = Date.now();
    const maxTimeoutFactor = 10;
    const interval = 200;
    BackgroundTimer.clearTimeout(this.intervalId);
    this.intervalId = BackgroundTimer.setInterval(() => {
      const timeDiff = Date.now() - startedTime;
      this.setState({fill: 100 - timeDiff * maxTimeoutFactor / 1000});
      if (this.state.fill <= 0) {
        // when timeout
        BackgroundTimer.clearTimeout(this.intervalId);
        this.setState({receivedNewOrder: false});
        this.props.setWaitingNewOrder(true);
      }
    }, interval);
  }

  handleCancelLookingForNewOrderBtn() {
    this.setState({receivedNewOrder: false});
    BackgroundTimer.clearTimeout(this.intervalId);
    this.props.setWaitingNewOrder(false);
  }

  handleCatchNewOrderBtn() {
    this.props.setBusyWaitingRunnerCatchingOrder(true);
    YettaServerAPIclient.getLokkaClient()
      .then(client => {
        if (!this.props.currentLocation.lat || !this.props.currentLocation.lon) {
          throw new Error('Error: 현재 위치를 받아올수 없습니다');
        }
        return client.mutate(`{
          runnerCatchOrder(
            input:{
              orderId: "${this.state.lastOrderId}"
            }
          ) {
            result
          }
        }`);
      })
      .then(res => {
        __DEV__ && console.log(res); // eslint-disable-line no-undef
        BackgroundTimer.clearTimeout(this.intervalId);
        let vmm = NativeModules.VinylMapManager;
        const { dest, nId, oId, items } = this.props.runnersOrderDetails;

        if (vmm && dest && nId && oId && items) {
          let itemList = [];
          items.regItem.map(el => itemList.push(`${el.n} x ${el.cnt}`));
          items.customItem.map(el => itemList.push(`${el.n} x ${el.cnt}`));
          const coordinatesArray = [
            {latitude: dest.lat, longitude: dest.lon},
            {latitude: nId.coordinate.lat, longitude: nId.coordinate.lon},
            {latitude: parseFloat(this.props.currentLocation.lat), longitude: parseFloat(this.props.currentLocation.lon)}
          ];
          vmm.addMarkerNode(String(nId.coordinate.lat), String(nId.coordinate.lon), String(nId.n), String(nId.id), itemList);
          vmm.addMarkerDest(String(dest.lat), String(dest.lon), dest.n1, oId.id);
          __DEV__ && console.log('fitToCoordinates with: ', coordinatesArray); // eslint-disable-line no-undef
          const edgePadding = {
            left: 50,
            right: 50,
            top: 50,
            bottom: 50
          };
          const animated = true;
          vmm.fitToCoordinates(coordinatesArray, edgePadding, animated);
        }

        this.props.setWaitingNewOrder(false);
        this.props.setOnDelivery(true);
        this.props.setBusyWaitingRunnerCatchingOrder(false);
      }).catch(err => {
        handleError(err);
        this.props.setBusyWaitingRunnerCatchingOrder(false);
      });
  }

  renderBody() {
    if (this.props.idVerified === false) {
      if (this.props.isWaitingForJudge === true) {
        return this.renderBodyWaitingForJudge();
      }
      return this.renderBodyRequireIdVerification();
    }
    if (this.props.waitingNewOrder === false) {
      return <RunnerDashboard/>;
    }
    if (this.state.receivedNewOrder === true) {
      return this.renderBodyFoundNewOrder();
    }
    return this.renderBodyWaitingNewOrder();
  }

  renderBodyRequireIdVerification() {
    return (
      <View style={{flex: 1, paddingTop: (Platform.OS === 'ios') ? 100 : 80}}>
        <IdVerification/>
      </View>
    );
  }

  renderBodyWaitingForJudge() {
    return (
      <View style={{
        flex: 1,
        backgroundColor: 'transparent',
        top: HEIGHT * 0.15,
        alignItems: 'center',
        paddingTop: 100
      }}>
        <Image
          style={{height: 180, width: 180}}
          source={IMG_CLOCK}
          resizeMode="contain"
        />
        <Text style={{
          fontSize: 20,
          color: 'black',
          marginTop: 40,
          fontWeight: '600'
        }}>심사를 기다리는 중입니다.</Text>
      </View>
    );
  }

  renderBodyWaitingNewOrder() {
    return (
      <View style={{
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'transparent',
        alignItems: 'center',
        marginTop: HEIGHT * 0.1
      }}>
        <View style={{flex: 1, backgroundColor: 'transparent'}}>
          <View>
            <Animation
              onLayout={() => {
                // run animation when this did mount
                this.lottieAnimation.play();
              }}
              ref={animation => {
                this.lottieAnimation = animation;
              }}
              style={{
                width: 300,
                height: 200,
                marginTop: 50,
                backgroundColor: 'transparent'
              }}
              speed={1}
              source={loadingJSON}
              loop
            />
          </View>
          <Text style={{
            top: 40,
            alignSelf: 'center',
            fontSize: 20,
            fontWeight: '600'
          }}>
            기다리는중..
          </Text>
        </View>
        <View style={{
          flex: 0.3,
          justifyContent: 'center'
        }}>
          <TouchableOpacity
            style={{
              height: 60,
              width: WIDTH * 0.7,
              backgroundColor: 'black',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 2
            }}
            onPress={this.handleCancelLookingForNewOrderBtn}
          >
            <Text style={{
              fontSize: 18,
              color: 'white'
            }}>
              취소
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  renderBodyFoundNewOrder() {
    let lastNotif = '';
    let title = '';
    let body = '';
    if (this.props.runnerNotification) {
      lastNotif = this.props.runnerNotification[this.props.runnerNotification.length - 1];
      if (lastNotif) {
        const { message } = lastNotif;
        if (message) {
          title = message.title;
          body = message.body;
        }
      } else {
        return this.renderBodyWaitingNewOrder();
      }
    }

    let remainingTime = Math.floor(10 - (100 - this.state.fill) / 10);
    if (remainingTime < 0) {
      remainingTime = 0;
    }
    return (
      <View style={{flex: 1.5, backgroundColor: 'transparent', paddingTop: 100}}>
        <AnimatedCircularProgress
          ref="circularProgress"
          size={280}
          width={15}
          fill={this.state.fill}
          tintColor="#00e0ff"
          backgroundColor="#3d5875">
          {
            () => (
              <TouchableOpacity
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: 280,
                  height: 280,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
                onPress={this.handleCatchNewOrderBtn}
              >
                <Text style={{
                  fontSize: 27,
                  marginBottom: 10,
                  color: 'black',
                  fontWeight: '600'
                }}>{title}</Text>
                <Text style={{
                  fontSize: 10,
                  marginLeft: 20,
                  marginRight: 20,
                  textAlign: 'center'
                }}>{body}</Text>
                <Text style={{marginTop: 20}}>
                  {remainingTime}초 남았어요!
                </Text>
              </TouchableOpacity>
            )
          }
        </AnimatedCircularProgress>
      </View>
    );
  }

  render() {
    return (
      <View
        style={[styles.container,
        {top: (this.props.isRunner && !this.props.onDelivery) ? 0 : HEIGHT}]}
      >
        <View
          ref={component => {
            this.refRunnerView = component;
            this.props.setRefRunnerView(component);
          }}
          style={{
            flex: 1,
            width: WIDTH,
            backgroundColor: '#f9f9f9'
          }}
        >
          {this.renderBody()}
        </View>
      </View>
    );
  }
}

RunnerView.propTypes = {
  // reducers/runnerStatus
  waitingNewOrder: PropTypes.bool,
  setWaitingNewOrder: PropTypes.func,
  onDelivery: PropTypes.bool,
  setOnDelivery: PropTypes.func,

  // reducers/pushNotification
  runnerNotification: PropTypes.any,

  // reducers/userStatus
  isRunner: PropTypes.bool,

  // reducers/runnerStatus
  idVerified: PropTypes.bool,
  isWaitingForJudge: PropTypes.bool,

  // reducers/components/runnerView
  setRefRunnerView: PropTypes.func,

  // reducers/busyWaiting
  setBusyWaitingRunnerCatchingOrder: PropTypes.func,

  // reducers/orderStatus
  runnersOrderDetails: PropTypes.object,

  // reducers/home
  currentLocation: PropTypes.object
};

const mapStateToProps = (state) => {
  return {
    isRunner: state.userStatus.isRunner,
    idVerified: state.runnerStatus.idVerified,
    isWaitingForJudge: state.runnerStatus.isWaitingForJudge,
    waitingNewOrder: state.runnerStatus.waitingNewOrder,
    onDelivery: state.runnerStatus.onDelivery,
    runnerNotification: state.pushNotification.runnerNotification,
    runnersOrderDetails: state.orderStatus.runnersOrderDetails,
    currentLocation: state.home.currentLocation
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setRefRunnerView: (refRunnerView) => dispatch(setRefRunnerView(refRunnerView)),
    setWaitingNewOrder: (waitingNewOrder) => dispatch(setWaitingNewOrder(waitingNewOrder)),
    setRunnerNotification: (runnerNotification) => dispatch(setRunnerNotification(runnerNotification)),
    setOnDelivery: (onDelivery) => dispatch(setOnDelivery(onDelivery)),
    setBusyWaitingRunnerCatchingOrder: (busyWaitingRunnerCatchingOrder) => dispatch(setBusyWaitingRunnerCatchingOrder(busyWaitingRunnerCatchingOrder))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RunnerView);
