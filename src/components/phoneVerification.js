import React, { Component, PropTypes } from 'react';
import {
  Text,
  View,
  PanResponder,
  TouchableOpacity
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
      digit: ''
    };
    this.back = '<';
    this.handleKeyboardBtn = this.handleKeyboardBtn.bind(this);
    this.checkPuttingNumComplete = this.checkPuttingNumComplete.bind(this);
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
    const { digit } = this.state;
    return (
      <View style={{
        flex: 1,
        marginTop: 70,
        marginBottom: HEIGHT * 0.4,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        flexDirection: 'column'
      }}>
        <View style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 50
        }}>
          <Text>
            니 폰 번호
          </Text>
        </View>
        <View style={{
          height: 70,
          width: WIDTH,
          flexDirection: 'row',
          backgroundColor: 'transparent',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingLeft: 20
        }}>
          {this.renderPhoneNumBox(digit[0])}
          {this.renderPhoneNumBox(digit[1])}
          {this.renderPhoneNumBox(digit[2])}
          <View style={{width: 30}}/>
          {this.renderPhoneNumBox(digit[3])}
          {this.renderPhoneNumBox(digit[4])}
          {this.renderPhoneNumBox(digit[5])}
          {this.renderPhoneNumBox(digit[6])}
          <View style={{width: 30}}/>
          {this.renderPhoneNumBox(digit[7])}
          {this.renderPhoneNumBox(digit[8])}
          {this.renderPhoneNumBox(digit[9])}
          {this.renderPhoneNumBox(digit[10])}
          <View style={{width: 20}}/>
        </View>
      </View>
    );
  }

  renderPhoneNumBox(number) {
    return (
      <View style={{
        marginRight: 3,
        width: 20,
        borderBottomWidth: 1.5,
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Text>{number}</Text>
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
    return (this.state.digit.length === 11);
  }

  renderRowEnterBtn() {
    return (
      <TouchableOpacity
        style={styles.phoneVerifKeyboardRowBtn}
        onPress={() => {
          if (this.checkPuttingNumComplete()) {
            // todo: do smt here
          }
        }}
      >
        <Text style={{
          color: (this.checkPuttingNumComplete()) ? 'blue' : '#ececec'
        }}>
          enter
        </Text>
      </TouchableOpacity>
    );
  }

  handleKeyboardBtn(number) {
    if (number === this.back) {
      const deeplyCopiedArr = this.state.digit.slice(0, -1);
      this.setState({digit: deeplyCopiedArr});
    } else if (this.state.digit.length <= 10) {
      const deeplyCopiedArr = this.state.digit.concat(number);
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
          {this.renderRow(this.back)}
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
          {this.renderRowEnterBtn()}
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
