import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  Dimensions,
  Image,
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import AddNewCard from './addNewCard';

// assets
import IMG_BACK from './../../../assets/left-arrow-key.png';

const WIDTH = Dimensions.get('window').width;
const DEFAULT_LEFT = WIDTH * 0.1;
const LIST_BORDER_COLOR = '#eee';

const styles = {
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#f9f9f9'
  },
  topContainer: {
    ...Platform.select({
      ios: {
        height: 100
      },
      android: {
        height: 80
      }
    }),
    padding: DEFAULT_LEFT,
    marginTop: 30,
    justifyContent: 'center'
  },
  topContainerText: {
    fontSize: 30,
    fontWeight: '500',
    color: 'black'
  },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginLeft: DEFAULT_LEFT,
    marginBottom: 30,
    backgroundColor: '#ddd'
  },
  profileList: {
    height: 60,
    paddingLeft: DEFAULT_LEFT,
    backgroundColor: 'white',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: LIST_BORDER_COLOR
  },
  profileSubject: {
    marginTop: 14,
    color: 'gray',
    fontSize: 10,
    fontWeight: '600'
  },
  profileContent: {
    marginTop: 4,
    fontSize: 16,
    fontWeight: '300'
  }
};

class PaymentInfo extends Component {
  constructor() {
    super();
    this.state = {
      showAddNewCardView: false
    };
    this.renderCardInfoRow = this.renderCardInfoRow.bind(this);
    this.handleAddNewCard = this.handleAddNewCard.bind(this);
    this.handleBackButton = this.handleBackButton.bind(this);
  }

  handleAddNewCard() {
    this.setState(() => {
      return {showAddNewCardView: true};
    });
  }

  handleBackButton() {
    if (this.state.showAddNewCardView === true) {
      this.setState(() => {
        return {showAddNewCardView: false};
      });
    } else {
      this.props.navigation.goBack();
    }
  }

  renderCardInfoList() {
    const { userPaymentInfo } = this.props.user;
    __DEV__ && console.log(userPaymentInfo); // eslint-disable-line no-undef
    if (!userPaymentInfo) {
      return (
        <View style={[styles.profileList, { justifyContent: 'center' }]}>
          <Text style={{
            fontSize: 16,
            fontWeight: '300'
          }}>
            등록된 카드가 없습니다
          </Text>
        </View>
      );
    }
    return userPaymentInfo.map(this.renderCardInfoRow);
  }

  renderCardInfoRow(userPaymentInfoType) {
    const { type, num, provider } = userPaymentInfoType;
    return (
      <View style={styles.profileList}>
        <Text style={styles.profileSubject}>{provider} {type}</Text>
        <Text style={styles.profileContent}>{num}</Text>
      </View>
    );
  }

  renderAddNewCard() {
    return (
      <TouchableOpacity
        style={[styles.profileList, {justifyContent: 'center'}]}
        onPress={this.handleAddNewCard.bind(this)}
      >
        <Text style={{
          fontSize: 16,
          fontWeight: '500',
          color: '#205D98'
        }}>
          결제 수단 추가
        </Text>
      </TouchableOpacity>
    );
  }

  renderBody() {
    if (this.state.showAddNewCardView) {
      return <AddNewCard navigation={this.props.navigation}/>;
    }
    return (
      <View>
        {this.renderCardInfoList()}
        {this.renderAddNewCard()}
      </View>
    );
  }

  render() {
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={Keyboard.dismiss}
        activeOpacity={1}
      >
        <TouchableOpacity
          style={{
            height: 24,
            width: 24,
            top: 46,
            marginLeft: 20,
            marginBottom: (Platform.OS === 'ios') ? 16 : 4
          }}
          onPress={this.handleBackButton.bind(this)}
        >
          <Image
            style={{height: 24, width: 24}}
            source={IMG_BACK}
          />
        </TouchableOpacity>
        <View style={styles.topContainer}>
          <Text style={styles.topContainerText}>
            {(this.state.showAddNewCardView) ? '결제 추가' : '결제 정보'}
          </Text>
        </View>
        {this.renderBody()}
      </TouchableOpacity>
    );
  }
}

PaymentInfo.propTypes = {
  navigation: PropTypes.object.isRequired,
  user: PropTypes.object
};

let mapStateToProps = (state) => {
  return {
    user: state.auth.user
  };
};

export default connect(mapStateToProps, undefined)(PaymentInfo);
