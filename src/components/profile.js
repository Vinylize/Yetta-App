import React, { Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import {
  Image,
  Text,
  View,
  Dimensions,
  StyleSheet
} from 'react-native';

// const Lokka = require('lokka').Lokka;
// const Transport = require('lokka-transport-http').Transport;
//
// const client = new Lokka({
//   transport: new Transport(URL)
// });

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
    marginBottom: 30
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

class Profile extends Component {
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

  renderBorder() {
    return (
      <View style={{borderBottomWidth: 1, borderBottomColor: LIST_BORDER_COLOR}}/>);
  }


  render() {
    return (
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <Text style={styles.topContainerText}>프로필</Text>
        </View>
        <Image style={styles.profileImage} source={require('../../assets/defaultProfileImg.png')}/>
        {this.renderProfileList('이름', this.props.user.n)}
        {this.renderProfileList('이메일', this.props.user.e)}
        {this.renderProfileList('전화 번호', this.props.user.p)}
      </View>
    );
  }
}

Profile.propTypes = {
  navigator: PropTypes.any,
  user: PropTypes.object
};

let mapStateToProps = (state) => {
  return {
    user: state.auth.user
  };
};

export default connect(mapStateToProps, undefined)(Profile);
