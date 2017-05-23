import React, { Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import {
  Dimensions,
  Image,
  LayoutAnimation,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import IdVerification from './../idVerification/idVerification';

import { AnimatedCircularProgress } from 'react-native-circular-progress';
import Animation from 'lottie-react-native';
import BackgroundTimer from 'react-native-background-timer';
import { handleError } from './../../utils/errorHandlers';

import * as YettaServerAPI from './../../service/YettaServerAPI/client';

// redux functions
import { setRefRunnerView } from './../../actions/componentsActions/runnerViewActions';

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
    this.mutationRunnerCatchOrder = this.mutationRunnerCatchOrder.bind(this);
  }

  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }

  componentWillReceiveProps(nextProps) {
    const { runnerNotification } = nextProps;
    if (this.state.receivedNewOrder === false) {
      if (runnerNotification && runnerNotification.length > 0) {
        const { data } = runnerNotification[runnerNotification.length - 1].data;
        console.log(data);
        // if newly received notification's data id is different from the previous one
        if (data && data !== this.state.lastOrderId) {
          console.log(this.state.lastOrderId);
          this.setState({
            receivedNewOrder: true,
            lastOrderId: data
          });
          this.startCount();
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
      console.log(timeDiff);
      if (this.state.fill <= 0) {
        // when timeout
        BackgroundTimer.clearTimeout(this.intervalId);
        this.setState({receivedNewOrder: false});
        this.props.setWaitingNewOrder(true);
      }
    }, interval);
  }

  handleStartRunnerBtn() {
    this.setState({receivedNewOrder: false});
    BackgroundTimer.clearTimeout(this.intervalId);
    this.props.setWaitingNewOrder(!this.props.waitingNewOrder);
  }

  renderBody() {
    if (this.props.idVerified === false) {
      if (this.props.isWaitingForJudge === true) {
        return this.renderBodyWaitingForJudge();
      }
      return this.renderBodyRequireIdVerification();
    }
    if (this.state.receivedNewOrder === true) {
      return this.renderBodyFoundNewOrder();
    }
    return this.renderBodyWaitingNewOrder();
  }

  renderBodyRequireIdVerification() {
    return (
      <View style={{flex: 1}}>
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
        alignItems: 'center'
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
        backgroundColor: 'transparent',
        top: HEIGHT * 0.1
      }}>
        <Animation
          onLayout={() => {
            // run animation when this did mount
            this.lottieAnimation.play();
          }}
          ref={animation => {
            this.lottieAnimation = animation;
          }}
          style={{
            width: 200,
            height: 200,
            left: 0,
            backgroundColor: 'transparent'
          }}
          speed={1}
          source={loadingJSON}
          loop
        />
        <Text style={{
          top: 40,
          alignSelf: 'center',
          fontSize: 20,
          fontWeight: '600'
        }}>
          기다리는중..
        </Text>
      </View>
    );
  }

  mutationRunnerCatchOrder(orderId) {
    console.log(orderId);
    YettaServerAPI.getLokkaClient()
      .then(client => {
        return client.mutate(`{
          runnerCatchOrder(
            input:{
              orderId: "${orderId}"
            }
          ) {
            result
          }
        }`);
      })
      .then(res => {
        console.log(res);
      }).catch(handleError);
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
      <View style={{flex: 1.5, backgroundColor: 'transparent'}}>
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
                onPress={() => {
                  this.mutationRunnerCatchOrder(this.state.lastOrderId);
                  this.props.setWaitingNewOrder(false);
                  this.props.setOnDelivery(true);
                }}
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
            backgroundColor: '#f9f9f9',
            paddingTop: 100
          }}
        >
        {this.renderBody()}
        </View>
      </View>
    );
  }
}

RunnerView.propTypes = {
  navigation: PropTypes.object.isRequired,
  waitingNewOrder: PropTypes.bool.isRequired,
  setWaitingNewOrder: PropTypes.func.isRequired,
  runnerNotification: PropTypes.any.isRequired,
  onDelivery: PropTypes.bool.isRequired,
  setOnDelivery: PropTypes.func.isRequired,

  // reducers/userStatus
  isRunner: PropTypes.bool,

  // reducers/runnerStatus
  idVerified: PropTypes.bool,
  isWaitingForJudge: PropTypes.bool,

  // reducers/components/runnerView
  setRefRunnerView: PropTypes.func
};

const mapStateToProps = (state) => {
  return {
    isRunner: state.userStatus.isRunner,
    idVerified: state.runnerStatus.idVerified,
    isWaitingForJudge: state.runnerStatus.isWaitingForJudge
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setRefRunnerView: (refRunnerView) => dispatch(setRefRunnerView(refRunnerView))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RunnerView);
