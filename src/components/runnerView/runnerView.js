import React, { Component, PropTypes} from 'react';
import {
  View,
  Dimensions,
  Text,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager
} from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import Animation from 'lottie-react-native';
import BackgroundTimer from 'react-native-background-timer';
import { handleError } from './../../utils/errorHandlers';

import * as YettaServerAPI from './../../service/YettaServerAPI/client';

import loadingJSON from '../../../assets/lottie/loading-2.json';

const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;

UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

const styles = {
  container: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: WIDTH,
    height: HEIGHT,
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
    paddingTop: 100,
    elevation: 50,
    zIndex: 1
  }
};

export default class RunnerView extends Component {
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
    console.log(runnerNotification);
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

  renderHeadText() {
    return (
      <View style={{flex: 0.3}}>
        <Text style={{
          color: 'black',
          fontSize: 30,
          fontWeight: '600'
        }}>
          러너
        </Text>
      </View>
    );
  }

  renderBody() {
    if (this.props.waitingNewOrder === true) {
      if (this.state.receivedNewOrder === true) {
        return this.renderBodyFoundNewOrder();
      }
      return this.renderBodyWaitingNewOrder();
    }
    return this.renderBodyDefault();
  }

  renderBodyDefault() {
    return (
      <View style={{flex: 1.5}}>
        <Text>별점: 5</Text>
        <Text>이번달 수입: $100000 </Text>
        <Text>심사 여부: yes </Text>
      </View>
    );
  }

  renderBodyWaitingNewOrder() {
    return (
      <View style={{flex: 1.5, backgroundColor: 'transparent'}}>
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

  renderBottom() {
    return (
      <View style={{flex: (Platform.OS === 'ios') ? 0.3 : 0.4}}>
        {this.renderStartRunnerBtn()}
      </View>
    );
  }

  renderStartRunnerBtn() {
    return (
      <TouchableOpacity
        style={{
          width: WIDTH * 0.7,
          height: 40,
          backgroundColor: 'black',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 5
        }}
        onPress={this.handleStartRunnerBtn.bind(this)}
      >
        <Text style={{
          color: 'white',
          fontSize: 20
        }}>{(this.props.waitingNewOrder) ? '취소' : '배달하기'}</Text>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <View style={[styles.container,
        {top: (this.props.isRunner && !this.props.onDelivery) ? 0 : HEIGHT}]}>
        {this.renderHeadText()}
        {this.renderBody()}
        {this.renderBottom()}
      </View>
    );
  }
}

RunnerView.propTypes = {
  navigator: PropTypes.any,
  isRunner: PropTypes.bool.isRequired,
  waitingNewOrder: PropTypes.bool.isRequired,
  setWaitingNewOrder: PropTypes.func.isRequired,
  runnerNotification: PropTypes.any.isRequired,
  onDelivery: PropTypes.bool.isRequired,
  setOnDelivery: PropTypes.func.isRequired
};
