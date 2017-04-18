import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  Text,
  View,
  Dimensions
} from 'react-native';
import * as firebase from 'firebase';

import { setUser } from '../actions/authActions';
import { URL, handleError, handleFirebaseSignInError } from './../utils';
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

class Profile extends Component {
  constructor() {
    super();
  }

  componentWillMount() {
  }

  queryUser(token) {
    client._transport._httpOptions.headers = {
      authorization: token
    };
    return client.query(`{
      viewer{
        isPV,
        e,
        n,
        p
      }
    }`)
      .then(({viewer}) => {
        this.props.setUser(viewer);
        return viewer;
      })
      .catch(handleError);
  }

  login(email, password) {
    return firebase.auth().signInWithEmailAndPassword(email, password)
      .catch(handleFirebaseSignInError)
      .then(this.internalAuth.bind(this));
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <Text style={styles.topContainerText}>프로필</Text>
        </View>
        <View style={styles.inputContainer} />
      </View>

    );
  }
}

Profile.propTypes = {
  navigator: PropTypes.any,
  setUser: PropTypes.func
};

let mapDispatchToProps = (dispatch) => {
  return {
    setUser: (user) => dispatch(setUser(user))
  };
};

export default connect(undefined, mapDispatchToProps)(Profile);
