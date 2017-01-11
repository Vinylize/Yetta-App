import React, { Component, PropTypes } from 'react';
import {
  Alert,
  TextInput,
  View,
  TouchableOpacity,
  Image,
  LayoutAnimation,
  Keyboard
} from 'react-native';
import { register } from './../auth/auth';

import imgHeart from './../resources/heart.png';

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#42dcf4'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5
  },
  textInput: {
    height: 40,
    borderWidth: 1,
    marginLeft: 24,
    marginRight: 24,
    marginBottom: 5,
    padding: 10,
    borderRadius: 4,
    borderColor: '#ececec'
  },
  registerBtn: {
    height: 0,
    width: 0,
    marginTop: 20,
    opacity: 0.9
  },
  registerBtnActive: {
    height: 70,
    width: 70,
    marginTop: 20,
    opacity: 0.9
  }
};

export default class Register extends Component {
  constructor() {
    super();
    this.state = {
      userName: undefined,
      password: undefined,
      userEmail: undefined
    };
  }

  shouldComponentUpdate(nextState) {
    let { password, userEmail, userName } = this.state;
    if (password !== nextState.password) {
      return true;
    }
    if (userEmail !== nextState.userEmail) {
      return true;
    }
    if (userName !== nextState.userName) {
      return true;
    }
    return false;
  }

  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }

  handleRegisterButton() {
    if (this.state.userName && this.state.password && this.state.userEmail) {
      // todo: handle duplicate signup
      register(this.state.userEmail, this.state.userName, this.state.password)
        .then((rjson) => {
          console.log(rjson);
          this.props.goToLogin();
          //this.props.navigator.push(loginNavigatorRoute());
        })
        .catch(console.log);
    }
    else {
      Alert.alert(
        'OMG, TYPE SOMETHING'
      );
    }
  }

  checkTextInputAllFilled() {
    let { userName, password, userEmail } = this.state;
    return (userName && password && userEmail);
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.textInput}
          onChangeText={(text) => this.setState({userName: text})}
          value={this.state.userName}
          placeholder={'type your name!'}
        />
        <TextInput
          style={styles.textInput}
          onChangeText={(text) => this.setState({password: text})}
          value={this.state.password}
          placeholder={'password'}
          onSubmitEditing={Keyboard.dismiss}
        />
        <TextInput
          style={styles.textInput}
          onChangeText={(text) => this.setState({userEmail: text})}
          value={this.state.userEmail}
          placeholder={'email'}
          onSubmitEditing={Keyboard.dismiss}
        />
        <TouchableOpacity onPress={this.handleRegisterButton.bind(this)}>
          <Image
            style={(this.checkTextInputAllFilled()) ? styles.registerBtnActive : styles.registerBtn}
            source={imgHeart}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

Register.propTypes = {
  navigator: PropTypes.any,
  goToLogin: PropTypes.func
};
