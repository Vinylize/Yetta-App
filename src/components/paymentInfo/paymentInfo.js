import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  Text,
  View,
  Dimensions,
  StyleSheet
} from 'react-native';

const WIDTH = Dimensions.get('window').width;
const DEFAULT_LEFT = WIDTH * 0.1;
const LIST_BORDER_COLOR = '#eee';

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9'
  },
  topContainer: {
    height: 100,
    padding: DEFAULT_LEFT,
    marginTop: 30,
    justifyContent: 'center'
  },
  topContainerText: {
    fontSize: 30,
    fontWeight: '500'
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
  }

  renderProfileList(subject, content) {
    return (
      <View style={styles.profileList}>
        <Text style={styles.profileSubject}>{subject}</Text>
        <Text style={styles.profileContent}>{content}</Text>
      </View>);
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <Text style={styles.topContainerText}>결제 정보</Text>
        </View>
        {this.renderProfileList('카드1', '1111 **** 1111 ****')}
        {this.renderProfileList('카드2', '2222 **** 2222 ****')}
        {this.renderProfileList('카드3', '3333 **** 3333 ****')}
      </View>
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
