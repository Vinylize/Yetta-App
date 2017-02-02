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
      showEnterBtn: false
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
    return (
      <View style={styles.phoneVerifBodyContainer}>
        <View style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 40
        }}>
          <Text>
            니 폰 번호
          </Text>
        </View>
        <View style={{marginBottom: 20, flexDirection: 'row'}}>
        <Text style={{fontSize: 30}}>{this.state.digit}</Text>
        <View style={{
          width: 10,
          backgroundColor: 'black'
        }}/>
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
    return (this.state.digit.length === 11);
  }

  renderEnterBtn() {
    return (
      <TouchableOpacity
        style={{
          width: 50,
          height: 50,
          borderRadius: 30,
          backgroundColor: 'white',
          position: 'absolute',
          bottom: 30,
          right: (this.state.showEnterBtn) ? 20 : -30,
          justifyContent: 'center',
          alignItems: 'center'
        }}
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
    );
  }

  handleKeyboardBtn(number) {
    if (number === this.back) {
      const deeplyCopiedArr = this.state.digit.slice(0, -1);
      (deeplyCopiedArr.length < 10) && this.setState({showEnterBtn: false});
      this.setState({digit: deeplyCopiedArr});
    } else if (!this.checkPuttingNumComplete()) {
      const deeplyCopiedArr = this.state.digit.concat(number);
      (deeplyCopiedArr.length >= 10) && this.setState({showEnterBtn: true});
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
