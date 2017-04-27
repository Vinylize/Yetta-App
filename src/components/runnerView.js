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

// const Lokka = require('lokka').Lokka;
// const Transport = require('lokka-transport-http').Transport;
//
// const client = new Lokka({
//   transport: new Transport(URL)
// });

import loadingJSON from './../../assets/lottie/loading-2.json';

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
      fill: 100
    };
  }

  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }

  handleStartRunnerBtn() {
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

  renderBodyFoundNewOrder() {
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
            (fill) => (
              <Text style={{}}>
                {this.state.fill}
              </Text>
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
        {top: (this.props.isRunner) ? 0 : HEIGHT}]}>
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
  setWaitingNewOrder: PropTypes.func.isRequired
};
