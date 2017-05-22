import React, { Component, PropTypes } from 'react';
import {
  Dimensions,
  Image,
  Keyboard,
  LayoutAnimation,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { NavigationActions } from 'react-navigation';

import * as YettaServerAPIverification from './../../service/YettaServerAPI/verification';

// assets
import IMG_BACK from './../../../assets/left-arrow-key.png';

const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;

const styles = {
  phoneVerificationContainer: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    alignItems: 'center'
  },
  phoneVerificationHeaderText: {
    fontSize: 30,
    fontWeight: '500',
    color: 'black',
    marginTop: HEIGHT * 0.05,
    alignSelf: 'flex-start',
    marginLeft: WIDTH * 0.1
  },
  phoneVerificationBodyText: {
    fontSize: 18,
    color: 'black',
    marginTop: HEIGHT * 0.05
  },
  phoneVerificationBottomText: {
    fontSize: 14,
    color: 'grey',
    marginTop: HEIGHT * 0.05
  },
  phoneVerificationPhoneNumberTextInput: {
    height: 40,
    width: WIDTH * 0.65,
    backgroundColor: '#f1f1f1',
    alignSelf: 'center',
    marginTop: HEIGHT * 0.07,
    borderRadius: 5
  },
  phoneVerificationSendButton: {
    width: WIDTH,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    bottom: 0
  },
  phoneVerificationHeaderBackButton: {
    height: 30,
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 20
  }
};

export default class PhoneVerification extends Component {
  constructor() {
    super();
    this.state = {
      phoneNumber: '',
      keyboardDidShow: false,
      keyboardHeight: 0,
      show4digitScreen: false
    };
    this.shouldActivateSendButton = this.shouldActivateSendButton.bind(this);
    this.handleSendButton = this.handleSendButton.bind(this);
    this.handleBackButton = this.handleBackButton.bind(this);
  }

  componentWillMount() {
    LayoutAnimation.easeInEaseOut();
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow.bind(this));
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide.bind(this));
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  keyboardDidShow(e) {
    const { height } = e.endCoordinates;
    LayoutAnimation.easeInEaseOut();
    this.setState(() => {
      return {
        keyboardDidShow: true,
        keyboardHeight: height
      };
    });
  }

  keyboardDidHide() {
    LayoutAnimation.easeInEaseOut();
    this.setState(() => {
      return {
        keyboardDidShow: false,
        keyboardHeight: 0
      };
    });
  }

  shouldActivateSendButton() {
    return (this.state.phoneNumber.length >= 10);
  }

  handleSendButton() {
    if (this.shouldActivateSendButton()) {
      YettaServerAPIverification.userRequestPhoneVerification(this.state.phoneNumber)
        .then(res => {
          __DEV__ && console.log(res); // eslint-disable-line no-undef
          this.setState(() => {
            return {show4digitScreen: false};
          });
        })
        .catch(err => {
          __DEV__ && console.log(err); // eslint-disable-line no-undef
        });
    }
  }

  handleBackButton() {
    if (this.state.show4digitScreen === false) {
      this.navigateBackToLogin();
    }
  }

  navigateBackToLogin() {
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: 'Login', params: {navigation: this.props.navigation}})
      ]
    });
    this.props.navigation.dispatch(resetAction);
  }

  renderHeader() {
    return (
      <View style={{
        height: (Platform.OS === 'ios') ? 70 : 50,
        width: WIDTH,
        justifyContent: 'flex-end',
        backgroundColor: 'transparent'
      }}>
        <TouchableOpacity
          style={styles.phoneVerificationHeaderBackButton}
          onPress={this.handleBackButton}
        >
          <Image
            style={{height: 24, width: 24}}
            source={IMG_BACK}
          />
        </TouchableOpacity>
      </View>
    );
  }

  renderBodyPhoneNumber() {
    return (
      <View style={{
        width: WIDTH,
        alignItems: 'center',
        backgroundColor: 'transparent'}}>
        <Text style={styles.phoneVerificationHeaderText}>
          휴대폰 인증
        </Text>
        <Text style={styles.phoneVerificationBodyText}>
          휴대전화번호를 입력해주세요
        </Text>
        <TextInput
          style={styles.phoneVerificationPhoneNumberTextInput}
          onChangeText={(text) => {
            LayoutAnimation.easeInEaseOut();
            this.setState({phoneNumber: text});
          }}
          value={this.state.phoneNumber}
          underlineColorAndroid={'transparent'}
          keyboardType="numeric"
          maxLength={11}
          autoFocus
        />
        <Text style={styles.phoneVerificationBottomText}>
          입력하신 번호로 4자리의 인증번호를 보내드립니다
        </Text>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.phoneVerificationContainer}>
        {this.renderHeader()}
        {this.renderBodyPhoneNumber()}
        <TouchableOpacity
          style={[styles.phoneVerificationSendButton, {
            backgroundColor: (this.shouldActivateSendButton()) ? '#ff9700' : 'grey',
            bottom: (this.state.keyboardDidShow === true) ? this.state.keyboardHeight : 0}
          ]}
          onPress={this.handleSendButton}
        >
          <Text style={{color: 'white', fontWeight: '500'}}>인증번호 받기</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

PhoneVerification.propTypes = {
  navigation: PropTypes.object.isRequired
};
