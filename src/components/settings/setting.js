import React, { Component, PropTypes } from 'react';
import {
  Alert,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { loginNavigatorRoute } from './../../navigator/navigatorRoutes';
import * as firebase from 'firebase';

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#feffff'
  }
};

export default class Setting extends Component {
  handleLogout() {
    firebase.auth().signOut().then((res) => {
      console.log(res, 'signed out');
      Alert.alert('signed out');
      this.props.navigator.replace(loginNavigatorRoute());
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={{}}
          onPress={this.handleLogout.bind(this)}
        >
          <Text>로그아웃</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

Setting.propTypes = {
  navigator: PropTypes.any
};
