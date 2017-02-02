import React, { Component, PropTypes } from 'react';
import {
  Alert,
  Text,
  TextInput,
  View,
  Image,
  LayoutAnimation,
  Keyboard,
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
    flexDirection: 'row'
  },
  phoneVerifKeyboardCol: {
    flex: 1,
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
          borderBottomWidth: 1
        }}
      >
        <TouchableOpacity
          style={{left: 20}}
          onPress={() => this.props.navigator.pop()}
        >
          <Text>back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  renderBody() {
    return (
      null
    );
  }

  renderRow(number) {
    return (
      <TouchableOpacity
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Text>{number}</Text>
      </TouchableOpacity>
    );
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
          {this.renderRow('<')}
        </View>
      </View>
    );
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: 'blue'}}>
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
