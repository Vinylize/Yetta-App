import React, { Component, PropTypes } from 'react';
import {
  Alert,
  TextInput,
  View,
  Image,
  LayoutAnimation,
  Keyboard,
  PanResponder
} from 'react-native';

const Lokka = require('lokka').Lokka;
const Transport = require('lokka-transport-http').Transport;

const client = new Lokka({
  transport: new Transport()
});

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
    this.handleRegisterButton = this.handleRegisterButton.bind(this);
  }

  shouldComponentUpdate(nextState) {
    let { password, userEmail, userName } = this.state;
    if (password !== nextState.password) {
      return true;
    }
    if (userEmail !== nextState.userEmail) {
      return true;
    }
    return (userName !== nextState.userName);
  }

  componentWillMount() {
    this.registerBtnPanResponder = PanResponder.create({
      onStartShouldSetPanResponder: this.registerBtnHandleStartShouldSetPanResponder,
      onPanResponderGrant: this.registerBtnHandlePanResponderGrant.bind(this)
    });
  }

  registerBtnHandleStartShouldSetPanResponder() {
    return true;
  }
  registerBtnHandlePanResponderGrant() {
    this.handleRegisterButton();
  }

  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }

  registerHelper(email, name, password) {
    client.mutate(`{
      createUser(
        input:{
          email: "${email}",
          name: "${name}",
          password: "${password}"
        }
      ) {
        result
      }
    }`
    ).then(response => {
      // todo: handle errors on register
      console.log(response);
    });
  }

  register(email, name, password) {
    return new Promise(resolve => {
      resolve(this.registerHelper(email, name, password));
    });
  }

  handleRegisterButton() {
    const { userName, password, userEmail } = this.state;
    if (userName && password && userEmail) {
      this.register(userEmail, userName, password);
      // todo: determine what to do after register completion
      // this.props.goToLogin();
    } else {
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
        <View {...this.registerBtnPanResponder.panHandlers}>
          <Image
            style={(this.checkTextInputAllFilled()) ? styles.registerBtnActive : styles.registerBtn}
            source={imgHeart}
          />
        </View>
      </View>
    );
  }
}

Register.propTypes = {
  navigator: PropTypes.any,
  goToLogin: PropTypes.func
};
