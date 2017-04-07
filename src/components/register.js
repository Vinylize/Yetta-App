import React, { Component, PropTypes } from 'react';
import {
  Alert,
  Text,
  TextInput,
  View,
  Keyboard,
  TouchableOpacity,
  Dimensions,
  Image
} from 'react-native';
import { URL } from './../utils';

const Lokka = require('lokka').Lokka;
const Transport = require('lokka-transport-http').Transport;

const client = new Lokka({
  transport: new Transport(URL)
});

const WIDTH = Dimensions.get('window').width;

const styles = {
  container: {
    padding: WIDTH * 0.125,
    flex: 1
  },
  topContainer: {
    height: 100,
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
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 5
  },
  textInput: {
    height: 40,
    fontSize: 13,
    marginBottom: 12,
    paddingLeft: 15,
    borderColor: '#CCC',
    borderWidth: 1.2,
    backgroundColor: 'white'
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
    height: 15,
    width: 15
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
      userEmail: undefined
    };
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
      console.log(response);
      this.props.navigator.pop();
    }).catch((error) => {
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
      this.register(userEmail, userName, password);
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
      <View style={styles.topContainer}>
        <Text style={styles.topContainerText}>Sign up</Text>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.sectionText}>Name</Text>

        <TextInput
          style={styles.textInput}
          onChangeText={(text) => this.setState({userName: text})}
          value={this.state.userName}
        />
        <Text style={styles.sectionText}>Email</Text>
        <TextInput
          style={styles.textInput}
          onChangeText={(text) => this.setState({userEmail: text})}
          value={this.state.userEmail}
          onSubmitEditing={Keyboard.dismiss}
          autoCapitalize={'none'}
        />
        <Text style={styles.sectionText}>Password</Text>
        <TextInput
          style={styles.textInput}
          onChangeText={(text) => this.setState({password: text})}
          value={this.state.password}
          onSubmitEditing={Keyboard.dismiss}
          autoCapitalize={'none'}
          secureTextEntry={true}
        />
        <Text style={styles.sectionText}>Confirm password</Text>
        <TextInput
          style={styles.textInput}
          onChangeText={(text) => this.setState({cPassword: text})}
          value={this.state.cPassword}
          onSubmitEditing={Keyboard.dismiss}
          autoCapitalize={'none'}
          secureTextEntry={true}
        />
        <View style={{alignItems: 'flex-end'}}>
          <TouchableOpacity
            style={styles.registerBtn}
            onPress={this.handleRegisterButton.bind(this)}
          >
            <Image style={styles.registerBtnImg} source={require('../../assets/right-arrow-forward.png')} />
          </TouchableOpacity>
        </View>

      </View>
      <View style={styles.footer}>
        <Text
          style={{fontWeight: '500', color: '#bbb'}}
        >Already have your account? </Text>
        <TouchableOpacity
          onPress={() => this.props.navigator.pop()}
        >
          <Text
            style={{fontWeight: '600', color: '#ff9700'}}
          >Log in</Text>
        </TouchableOpacity>
      </View>
    </View>

    );
  }
}

Register.propTypes = {
  navigator: PropTypes.any,
  goToLogin: PropTypes.func
};
