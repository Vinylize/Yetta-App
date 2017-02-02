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
  phoneVerifHeaderContainer: {
    position: 'absolute',
    top: 20,
    left: 0,
    height: 50,
    width: WIDTH,
    justifyContent: 'center',
    zIndex: 10
  },
  phoneVerifKeyboardCol: {
    flex: 1,
    flexDirection: 'column'
  },
  phoneVerifKeyboardRowBtn: {
    flex: 1,
    borderRadius: 5,
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
  },
  phoneVerifDigitContainer: {
    height: 50,
    width: WIDTH,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  phoneVerifInstrContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40
  },
  textPhoneVerifDelete: {
    backgroundColor: 'transparent',
    fontSize: 30,
    color: '#1b83d3',
    top: -1,
    left: 2
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
      code: '',
      showEnterBtn: false,
      toggleCursor: false,
      pressedDigit: undefined,
      showResponse: false
    };
    this.back = '<';
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
      <View style={styles.phoneVerifHeaderContainer}>
        <TouchableOpacity
          style={{left: 20, width: 40}}
          onPress={() => {
            if (this.state.showResponse === true) {
              LayoutAnimation.easeInEaseOut();
              this.setState({showResponse: false});
              (this.state.digit.length > 11) && this.setState({showEnterBtn: true});
            } else if (this.state.showResponse === false) {
              this.props.navigator.pop();
            }
          }}
        >
          <Text>back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  renderRequestView() {
    const requestViewOnResponse = {
      position: 'absolute',
      top: HEIGHT * 181.5 / 667 - 70,
      left: -WIDTH
    };
    return (
      <View style={[{width: WIDTH},
        (this.state.showResponse) ? requestViewOnResponse : {}
      ]}>
        <View style={styles.phoneVerifInstrContainer}>
          <Text>휴대폰 인증을 위한 전화번호를 입력해주세요</Text>
        </View>
        <View style={styles.phoneVerifDigitContainer}>
          <Text style={{fontSize: 30, marginBottom: 20}}>{this.state.digit}</Text>
          <Text style={{
            fontSize: 30,
            marginBottom: 23,
            color: (this.state.toggleCursor && !this.checkPuttingNumComplete()) ? 'black' : '#1b83d3'
          }}>
            |
          </Text>
        </View>
      </View>
    );
  }

  renderResponseView() {
    const requestViewOnResponse = {
      position: 'absolute',
      top: HEIGHT * 181.5 / 667 - 70,
      left: WIDTH
    };
    return (
      <View style={[{width: WIDTH},
        (!this.state.showResponse) ? requestViewOnResponse : {}
      ]}>
        <View style={styles.phoneVerifInstrContainer}>
          <Text>전송된 4자리 인증번호를 입력해주세요</Text>
        </View>
        <View style={styles.phoneVerifDigitContainer}>
          <Text style={{fontSize: 30, marginBottom: 20}}>{this.state.code}</Text>
          <Text style={{
            fontSize: 30,
            marginBottom: 23,
            color: (this.state.toggleCursor && !this.check4DigitComplete()) ? 'black' : '#1b83d3'
          }}>
            |
          </Text>
        </View>
      </View>
    );
  }

  renderBody() {
    return (
      <View style={styles.phoneVerifBodyContainer}>
        {this.renderRequestView()}
        {this.renderResponseView()}
        {this.renderEnterBtn()}
      </View>
    );
  }

  renderRow(number) {
    return (
      <TouchableOpacity
        style={[styles.phoneVerifKeyboardRowBtn,
          {backgroundColor: (this.state.pressedDigit === number) ? '#ececec' : 'white'}]}
        onPress={() => this.handleKeyboardBtn(number)}
        onPressIn={() => this.setState({pressedDigit: number})}
        onPressOut={() => this.setState({pressedDigit: ''})}
        activeOpacity={0.9}>
        <Text>{number}</Text>
      </TouchableOpacity>
    );
  }

  checkPuttingNumComplete() {
    const maxNumOfDigits = 11;
    const maxNumOfWhitespace = 2;
    return (this.state.digit.length === maxNumOfDigits + maxNumOfWhitespace);
  }

  check4DigitComplete() {
    return (this.state.code.length === 4);
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
            if (this.state.digit.length > 11) {
              const { showResponse } = this.state;
              if (showResponse === false) {
                LayoutAnimation.easeInEaseOut();
                this.setState({showResponse: true});
                (!this.check4DigitComplete()) && this.setState({showEnterBtn: false});
              } else if (showResponse === true) {
                // todo
              }
            }
          }}>
          <Text style={styles.textPhoneVerifDelete}>></Text>
        </TouchableOpacity>
      </View>
    );
  }

  handleKeyboardBtn(number) {
    if (this.state.showResponse) {
      this.handleKeyboardBtnOnResponse(number);
    } else {
      this.handleKeyboardBtnOnRequest(number);
    }
  }

  handleKeyboardBtnOnRequest(number) {
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

  handleKeyboardBtnOnResponse(number) {
    const { code } = this.state;
    if (number === this.back) {
      LayoutAnimation.easeInEaseOut();
      const deeplyCopiedStr = code.slice(0, -1);
      this.setState({code: deeplyCopiedStr});
      if (this.check4DigitComplete()) {
        this.setState({showEnterBtn: false});
      }
    } else if (!this.check4DigitComplete()) {
      LayoutAnimation.easeInEaseOut();
      const deeplyCopiedStr = code.concat(number);
      this.setState({code: deeplyCopiedStr});
      if (deeplyCopiedStr.length === 4) {
        this.setState({showEnterBtn: true});
      }
    }
  }

  renderKeyboard() {
    return (
      <View style={styles.phoneVerifKeyboardContainer}>
        <View style={styles.phoneVerifKeyboardCol}>
          {this.renderRow(1)}
          {this.renderRow(4)}
          {this.renderRow(7)}
          {this.renderRow(' ')}
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
