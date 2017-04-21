import React, { Component, PropTypes } from 'react';
import {
  Alert,
  Dimensions,
  Text,
  TouchableOpacity,
  StyleSheet,
  View
} from 'react-native';
import { loginNavigatorRoute } from './../../navigator/navigatorRoutes';
import * as firebase from 'firebase';

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
  settingsList: {
    height: 60,
    paddingLeft: DEFAULT_LEFT,
    backgroundColor: 'white',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: LIST_BORDER_COLOR,
    justifyContent: 'center'
  },
  settingsSubject: {
    color: 'gray',
    fontSize: 14,
    fontWeight: '600'
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

  renderSettingsList(subject, func) {
    return (
      <TouchableOpacity
        style={styles.settingsList}
        onPress={func.bind(this)}
      >
        <Text style={styles.settingsSubject}>{subject}</Text>
      </TouchableOpacity>
    );
  }

  renderCopyright() {
    return (
      <View style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: WIDTH,
        height: 50,
        backgroundColor: '#f9f9f9',
        elevation: 1,
        alignItems: 'center',
        flexDirection: 'column'
      }}>
        <Text style={{
          color: 'grey',
          fontSize: 10}}
        >
          Copyright Yetta in Gang-nam, All Rights Reserved.
        </Text>
        <Text style={{
          color: 'grey',
          fontSize: 12,
          marginTop: 8
        }}>
          Version 1.0.0
        </Text>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <Text style={styles.topContainerText}>설정</Text>
        </View>
        {this.renderSettingsList('공지사항', () => {})}
        {this.renderSettingsList('이벤트', () => {})}
        {this.renderSettingsList('고객센터', () => {})}
        {this.renderSettingsList('환경설정', () => {})}
        <View style={{width: WIDTH, height: 50}}/>
        {this.renderSettingsList('로그아웃', this.handleLogout)}
        {this.renderCopyright()}
      </View>
    );
  }
}

Setting.propTypes = {
  navigator: PropTypes.any
};
