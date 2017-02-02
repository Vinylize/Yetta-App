import React, { Component, PropTypes } from 'react';
import {
  Text,
  View,
  PanResponder,
  TouchableOpacity,
  LayoutAnimation
} from 'react-native';
import { WIDTH, HEIGHT } from './../utils';
import { phoneVerificationNavigatorRoute } from './../navigator/navigatorRoutes';

const styles = {
  phoneVerifKeyboardContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: HEIGHT * 0.4,
    width: WIDTH,
    backgroundColor: 'white',
    flexDirection: 'row',
    borderRadius: 5
  },
  phoneVerifKeyboardCol: {
    flex: 1,
    flexDirection: 'column'
  },
  phoneVerifKeyboardRowBtn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  phoneVerifBodyContainer: {
    flex: 1,
    marginTop: 70,
    marginBottom: HEIGHT * 0.4,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column'
  },
  phoneVerifEnterBtn: {
    width: 50,
    height: 50,
    borderRadius: 30,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center'
  }
};

export class PhoneVerificationButton extends Component {
  componentWillMount() {
    this.phoneVerifBtnPanResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: this.phoneVerifBtnHandlePanResponderGrant.bind(this)
    });
  }

  phoneVerifBtnHandlePanResponderGrant() {
    this.props.navigator.push(phoneVerificationNavigatorRoute());
  }

  render() {
    return (
      <View
        style={{
          position: 'absolute',
          left: WIDTH / 2,
          top: HEIGHT / 2 + 50
        }}
        {...this.phoneVerifBtnPanResponder.panHandlers}
      >
        <Text>폰 인증하기</Text>
      </View>
    );
  }
}

export default class PhoneVerification extends Component {
  constructor() {
    super();
    this.state = {
      digit: '',
      showEnterBtn: false,
      toggleCursor: false
    };
    this.back = '<';
    this.handleKeyboardBtn = this.handleKeyboardBtn.bind(this);
    this.checkPuttingNumComplete = this.checkPuttingNumComplete.bind(this);
  }

  componentDidMount() {
    this.timer = setInterval(() => {
      this.setState({toggleCursor: !this.state.toggleCursor});
    }, 500);
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  renderHeader() {
    return (
      <View
        style={{
          position: 'absolute',
          top: 20,
          left: 0,
          height: 50,
          width: WIDTH,
          justifyContent: 'center',
          zIndex: 10
        }}
      >
        <TouchableOpacity
          style={{left: 20, width: 40}}
          onPress={() => this.props.navigator.pop()}
        >
          <Text>back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  renderBody() {
    return (
      <View style={styles.phoneVerifBodyContainer}>
        <View style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 40
        }}>
          <Text>
            휴대폰 인증을 위한 전화번호를 입력해주세요
          </Text>
        </View>
        <View style={{
          height: 50,
          width: WIDTH,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Text style={{fontSize: 30, marginBottom: 20}}>{this.state.digit}</Text>
          <Text style={{fontSize: 30, marginBottom: 23}}>
            {(this.state.toggleCursor && !this.checkPuttingNumComplete()) ? '|' : ' '}
          </Text>
        </View>
        {this.renderEnterBtn()}
      </View>
    );
  }

  renderRow(number) {
    return (
      <TouchableOpacity
        style={styles.phoneVerifKeyboardRowBtn}
        onPress={() => this.handleKeyboardBtn(number)}
      >
        <Text>{number}</Text>
      </TouchableOpacity>
    );
  }

  checkPuttingNumComplete() {
    return (this.state.digit.length === 11 + 2);
  }

  renderEnterBtn() {
    return (
      <View style={[styles.phoneVerifEnterBtn, {
        position: 'absolute',
        bottom: 30,
        right: (this.state.showEnterBtn) ? 20 : -30
      }]}>
        <TouchableOpacity
          style={styles.phoneVerifEnterBtn}
          onPress={() => {
            if (this.checkPuttingNumComplete()) {
              // todo: do smt here
            }
          }}
        >
          <Text style={{
            backgroundColor: 'transparent',
            fontSize: 30,
            color: '#1b83d3',
            top: -1,
            left: 2
          }}>
            >
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  handleKeyboardBtn(number) {
    const { digit } = this.state;
    if (number === this.back) {
      LayoutAnimation.easeInEaseOut();
      let deeplyCopiedArr = digit.slice(0, -1);
      if (digit.length === 13) {
        deeplyCopiedArr = ''.concat(deeplyCopiedArr.slice(0, 7), ' ', deeplyCopiedArr.slice(9));
      } else if (deeplyCopiedArr[deeplyCopiedArr.length - 1] === ' ') {
        deeplyCopiedArr = deeplyCopiedArr.slice(0, -1);
      }
      (deeplyCopiedArr.length < 12) && this.setState({showEnterBtn: false});
      this.setState({digit: deeplyCopiedArr});
    } else if (!this.checkPuttingNumComplete()) {
      LayoutAnimation.easeInEaseOut();
      let deeplyCopiedArr = digit.concat(number);
      if (digit.length === 3 || digit.length === 7) {
        deeplyCopiedArr = digit.concat(' ', number);
      } else if (deeplyCopiedArr.length === 13) {
        deeplyCopiedArr = ''.concat(digit.slice(0, 7), digit[8], ' ', digit.slice(9), number);
      }
      (deeplyCopiedArr.length >= 12) && this.setState({showEnterBtn: true});
      this.setState({digit: deeplyCopiedArr});
    }
  }

  renderKeyboard() {
    return (
      <View style={styles.phoneVerifKeyboardContainer}>
        <View style={styles.phoneVerifKeyboardCol}>
          {this.renderRow(1)}
          {this.renderRow(4)}
          {this.renderRow(7)}
          {this.renderRow()}
        </View>
        <View style={styles.phoneVerifKeyboardCol}>
          {this.renderRow(2)}
          {this.renderRow(5)}
          {this.renderRow(8)}
          {this.renderRow(0)}
        </View>
        <View style={styles.phoneVerifKeyboardCol}>
          {this.renderRow(3)}
          {this.renderRow(6)}
          {this.renderRow(9)}
          {this.renderRow(this.back)}
        </View>
      </View>
    );
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#1b83d3'}}>
        {this.renderHeader()}
        {this.renderBody()}
        {this.renderKeyboard()}
      </View>
    );
  }
}

PhoneVerificationButton.propTypes = {
  navigator: PropTypes.any.isRequired
};

PhoneVerification.propTypes = {
  navigator: PropTypes.any.isRequired
};
