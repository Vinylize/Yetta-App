import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  Dimensions,
  Image,
  Keyboard,
  LayoutAnimation,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { NavigationActions } from 'react-navigation';

import * as YettaServerAPIpayment from './../../service/YettaServerAPI/payment';

// assets
import IMG_CREDIT_CARD from './../../../assets/credit-card.png';
import IMG_CANCEL from './../../../assets/error.png';

// constants
const WIDTH = Dimensions.get('window').width;
const DEFAULT_LEFT = WIDTH * 0.1;

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9'
  },
  title: {
    fontSize: 12,
    color: 'grey'
  }
};

const FOCUSED = {
  CARD_NUM: 'cardNum',
  EXPIRY: 'expiry',
  PW2: 'pw2',
  BIRTH: 'birth'
};

class AddNewCard extends Component {
  constructor() {
    super();
    this.state = {
      cardNum: '',
      expiry: '',
      pw2: '',
      birth: '',
      focused: FOCUSED.CARD_NUM,
      keyboardDidShow: true,
      keyboardHeight: 0
    };
  }

  componentWillMount() {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow.bind(this));
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide.bind(this));
  }

  componentWillUpdate(nextProps, nextState) {
    console.log(nextState);
    if (nextState.cardNum) {
      // [start user typing new numbers]
      if (nextState.cardNum.length === 4 && this.state.cardNum.length === 3) {
        this.setState({cardNum: `${nextState.cardNum}-`});
      } else if (nextState.cardNum.length === 9 && this.state.cardNum.length === 8) {
        this.setState({cardNum: `${nextState.cardNum}-`});
      } else if (nextState.cardNum.length === 14 && this.state.cardNum.length === 13) {
        this.setState({cardNum: `${nextState.cardNum}-`});
      }
      // [end user typing new numbers]
      // [start user deleting numbers]
      else if (nextState.cardNum.length === 15 && this.state.cardNum.length === 16) {
        this.setState({cardNum: nextState.cardNum.substring(0, 14)});
      } else if (nextState.cardNum.length === 10 && this.state.cardNum.length === 11) {
        this.setState({cardNum: nextState.cardNum.substring(0, 9)});
      } else if (nextState.cardNum.length === 5 && this.state.cardNum.length === 6) {
        this.setState({cardNum: nextState.cardNum.substring(0, 4)});
      }
      // [end user deleting numbers]
    }

    if (nextState.expiry) {
      if (nextState.expiry.length === 4 && this.state.expiry.length === 3) {
        this.setState({expiry: `${nextState.expiry}-`});
      } else if (nextState.expiry.length === 5 && this.state.expiry.length === 6) {
        this.setState({expiry: this.state.expiry.substring(0, 4)});
      }
    }
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

  handleCancelCardNum() {
    this.setState(() => {
      return {
        cardNum: null,
        formattedCardNum: null
      };
    });
  }

  handleSaveButton() {
    const userCreateIamportSubscribePaymentType = {
      num: this.state.cardNum,
      exp: this.state.expiry,
      birth: this.state.birth,
      pw2: this.state.pw2
    };
    YettaServerAPIpayment.userCreateIamportSubscribePayment(userCreateIamportSubscribePaymentType)
      .then(() => {
        const resetAction = NavigationActions.reset({
          index: 1,
          actions: [
            NavigationActions.navigate({ routeName: 'Home'}),
            NavigationActions.navigate({ routeName: 'PaymentInfo'})
          ]
        });
        this.props.navigation.dispatch(resetAction);
      })
      .catch(err => {
        __DEV__ && console.log(err); // eslint-disable-line no-undef
      });
  }

  onChangeTextCardNum(text) {
    this.setState(() => {
      return {cardNum: text};
    });
  }

  renderCardNum() {
    return (
      <View style={{
        height: 56,
        width: WIDTH * 0.8,
        backgroundColor: 'transparent',
        borderBottomWidth: 1,
        borderColor: (this.state.focused === FOCUSED.CARD_NUM) ? 'black' : '#b7b7b7',
        marginBottom: 20,
        marginLeft: DEFAULT_LEFT,
        flexDirection: 'column'
      }}>
        <Text style={styles.title}>카드 번호</Text>
        <View style={{
          height: 40,
          flexDirection: 'row',
          backgroundColor: 'transparent',
          alignItems: 'center'
        }}>
          <Image
            style={{height: 20, width: 20, marginLeft: 4}}
            source={IMG_CREDIT_CARD}
          />
          <TextInput
            style={{
              height: 40,
              width: WIDTH * 0.65,
              backgroundColor: 'transparent',
              marginLeft: 12
            }}
            onChangeText={(text) => this.onChangeTextCardNum(text)}
            value={this.state.cardNum}
            underlineColorAndroid={'transparent'}
            autoFocus
            keyboardType="numeric"
            maxLength={19}
            onFocus={() => this.setState({focused: FOCUSED.CARD_NUM})}
          />
          <TouchableOpacity
            style={{
              height: 20,
              width: 20,
              justifyContent: 'center'
            }}
            onPress={this.handleCancelCardNum.bind(this)}
          >
            <Image
              style={{height: 18, width: 18, opacity: 0.5}}
              source={IMG_CANCEL}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  renderExpiry() {
    return (
      <View style={{
        height: 50,
        width: WIDTH * 0.36,
        backgroundColor: 'transparent',
        marginLeft: DEFAULT_LEFT,
        borderBottomWidth: 1,
        borderColor: (this.state.focused === FOCUSED.EXPIRY) ? 'black' : '#b7b7b7'
      }}>
        <Text style={styles.title}>
          유효기간
        </Text>
        <TextInput
          style={{
            height: 40,
            width: WIDTH * 0.65,
            backgroundColor: 'transparent',
            marginLeft: 4
          }}
          placeholder="YYYY-MM"
          onChangeText={(text) => this.setState({expiry: text})}
          value={this.state.expiry}
          underlineColorAndroid={'transparent'}
          keyboardType="numeric"
          maxLength={7}
          onFocus={() => this.setState({focused: FOCUSED.EXPIRY})}
        />
      </View>
    );
  }

  renderPW2() {
    return (
      <View style={{
        height: 50,
        width: WIDTH * 0.36,
        backgroundColor: 'transparent',
        borderBottomWidth: 1,
        borderColor: (this.state.focused === FOCUSED.PW2) ? 'black' : '#b7b7b7',
        marginLeft: WIDTH * 0.08
      }}>
        <TextInput
          style={{
            height: 40,
            width: WIDTH * 0.34,
            backgroundColor: 'transparent',
            marginLeft: 4,
            marginTop: 14
          }}
          placeholder="비밀번호 앞 두자리"
          onChangeText={(text) => this.setState({pw2: text})}
          value={this.state.pw2}
          underlineColorAndroid={'transparent'}
          keyboardType="numeric"
          secureTextEntry
          maxLength={2}
          onFocus={() => this.setState({focused: FOCUSED.PW2})}
        />
      </View>
    );
  }

  renderBirth() {
    return (
      <View style={{
        height: 56,
        width: WIDTH * 0.8,
        backgroundColor: 'transparent',
        marginLeft: DEFAULT_LEFT,
        borderBottomWidth: 1,
        borderColor: (this.state.focused === FOCUSED.BIRTH) ? 'black' : '#b7b7b7',
        marginBottom: 10,
        flexDirection: 'column'
      }}>
        <Text style={styles.title}>생년월일 6자리</Text>
        <View style={{
          height: 34,
          flexDirection: 'row',
          backgroundColor: 'transparent',
          alignItems: 'center'
        }}>
          <TextInput
            style={{
              height: 40,
              width: WIDTH * 0.65,
              backgroundColor: 'transparent',
              marginLeft: 4
            }}
            onChangeText={(text) => this.setState({birth: text})}
            value={this.state.birth}
            underlineColorAndroid={'transparent'}
            keyboardType="numeric"
            maxLength={6}
            onFocus={() => this.setState({focused: FOCUSED.BIRTH})}
          />
        </View>
      </View>
    );
  }

  renderSaveButton() {
    return (
      <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: this.state.keyboardHeight,
          height: 40,
          width: WIDTH,
          backgroundColor: '#ff9700',
          justifyContent: 'center',
          alignItems: 'center'
        }}
        onPress={this.handleSaveButton.bind(this)}
      >
        <Text style={{
          fontSize: 14,
          color: '#f9f9f9'
        }}>카드 추가하기</Text>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={Keyboard.dismiss}
        activeOpacity={1}
      >
        {this.renderCardNum()}
        <View style={{flexDirection: 'row', marginBottom: 20}}>
          {this.renderExpiry()}
          {this.renderPW2()}
        </View>
        {this.renderBirth()}
        {this.renderSaveButton()}
      </TouchableOpacity>
    );
  }
}

AddNewCard.propTypes = {
  navigation: PropTypes.object.isRequired,
  user: PropTypes.object
};

let mapStateToProps = (state) => {
  return {
    user: state.auth.user
  };
};

export default connect(mapStateToProps, undefined)(AddNewCard);
