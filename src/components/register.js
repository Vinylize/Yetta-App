import React, { Component, PropTypes } from 'react';
import {
  Alert,
  findNodeHandle,
  Text,
  TextInput,
  View,
  Keyboard,
  TouchableOpacity,
  Dimensions,
  Image
} from 'react-native';
import { URL } from './../utils';
import GlobalLoading from './globalViews/loading';

const Lokka = require('lokka').Lokka;
const Transport = require('lokka-transport-http').Transport;

const client = new Lokka({
  transport: new Transport(URL)
});

const WIDTH = Dimensions.get('window').width;

const styles = {
  container: {
    padding: WIDTH * 0.125,
    flex: 1,
    backgroundColor: '#f9f9f9'
  },
  topContainer: {
    height: 100,
    marginBottom: 23,
    justifyContent: 'center'
  },
  topContainerText: {
    fontSize: 30,
    fontWeight: '500'
  },
  inputContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 18
  },
  sectionText: {
    color: '#666',
    fontSize: 14,
    marginBottom: 5
  },
  textInput: {
    height: 40,
    fontSize: 13,
    marginBottom: 12,
    paddingLeft: 15,
    backgroundColor: '#fff',
    borderRadius: 2,
    // shadowColor: '#000000',
    shadowOffset: {
      height: 2,
      width: 0
    },
    shadowRadius: 2,
    shadowOpacity: 0.1,
    elevation: 2
  },
  registerBtn: {
    height: 44,
    width: 44,
    borderRadius: 22,
    backgroundColor: '#AAA',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    opacity: 0.9
  },
  registerBtnImg: {
    height: 40,
    width: 40
  },
  footer: {
    height: 50,
    width: WIDTH,
    position: 'absolute',
    justifyContent: 'center',
    bottom: 0,
    flexDirection: 'row'
  }
};

export default class Register extends Component {
  constructor() {
    super();
    this.state = {
      userName: undefined,
      password: undefined,
      userEmail: undefined,
      refViewForBlurView: null,
      busyWaiting: false
    };
  }

  registerHelper(email, name, password) {
    client.mutate(`{
      createUser(
        input:{
          e: "${email}",
          n: "${name}",
          pw: "${password}"
        }
      ) {
        result
      }
    }`
    ).then(response => {
      console.log(response);
      this.hideLoading();
      this.props.navigator.pop();
    }).catch((error) => {
      this.hideLoading();
      const { rawError } = error;
      if (rawError) {
        const { message } = rawError[0];
        Alert.alert(
          message
        );
      }
      // console.log(error);
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
      this.showLoading();
      this.register(userEmail, userName, password);
    } else {
      Alert.alert(
        'OMG, TYPE SOMETHING'
      );
    }
  }

  showLoading() {
    this.setState(() => {
      return {busyWaiting: true};
    });
  }

  hideLoading() {
    this.setState(() => {
      return {busyWaiting: false};
    });
  }

  checkTextInputAllFilled() {
    let { userName, password, userEmail } = this.state;
    return (userName && password && userEmail);
  }

  render() {
    return (
    <View
      ref={component => {
        this.refViewContainer = component;
      }}
      onLayout={() => {
        this.setState({ refViewForBlurView: findNodeHandle(this.refViewContainer) });
      }}
      style={styles.container}
    >
      <View style={styles.topContainer}>
        <Text style={styles.topContainerText}>회원가입</Text>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.sectionText}>이름</Text>
        <TextInput
          style={styles.textInput}
          onChangeText={(text) => this.setState({userName: text})}
          value={this.state.userName}
        />
        <View style={{height: 33}} />
        <Text style={styles.sectionText}>이메일주소</Text>
        <TextInput
          style={styles.textInput}
          onChangeText={(text) => this.setState({userEmail: text})}
          value={this.state.userEmail}
          onSubmitEditing={Keyboard.dismiss}
          autoCapitalize={'none'}
        />
        <Text style={styles.sectionText}>비밀번호</Text>
        <TextInput
          style={styles.textInput}
          onChangeText={(text) => this.setState({password: text})}
          value={this.state.password}
          onSubmitEditing={Keyboard.dismiss}
          autoCapitalize={'none'}
          secureTextEntry={true}
        />
        <Text style={styles.sectionText}>비밀번호 확인</Text>
        <TextInput
          style={styles.textInput}
          onChangeText={(text) => this.setState({cPassword: text})}
          value={this.state.cPassword}
          onSubmitEditing={Keyboard.dismiss}
          autoCapitalize={'none'}
          secureTextEntry={true}
        />
        <View style={{alignItems: 'flex-end', marginTop: 39}}>
          <TouchableOpacity onPress={this.handleRegisterButton.bind(this)}>
            <Image style={styles.registerBtnImg} source={require('../../assets/next-step.png')} />
          </TouchableOpacity>
        </View>

      </View>
      <View style={styles.footer}>
        <Text style={{fontSize: 14, fontWeight: '500', color: '#bbb'}}>이미 회원이신가요? </Text>
        <TouchableOpacity onPress={() => this.props.navigator.pop()}>
          <Text
            style={{marginTop: 1, fontSize: 14, fontWeight: '600', color: '#ff9700'}}
          >
            로그인
          </Text>
        </TouchableOpacity>
      </View>
      <GlobalLoading
        refViewForBlurView={this.state.refViewForBlurView}
        show={this.state.busyWaiting}
      />
    </View>
    );
  }
}

Register.propTypes = {
  navigator: PropTypes.any,
  goToLogin: PropTypes.func
};
