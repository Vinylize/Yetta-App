import React, { Component, PropTypes } from 'react';
import Relay from 'react-relay';
import {
  Text,
  View,
  TouchableHighlight
} from 'react-native';
import RegisterMutation from '../mutations/register';

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
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
  }
};

export function register(email, name, password) {
  return new Promise((resolve, reject) => {
    Relay.Store.commitUpdate(new RegisterMutation({
      input: {
        email: email,
        name: name,
        password: password
      }
    }), {
      onSuccess: (data) => {
        console.log(data);
        // resolve(login(username, password));
      },

      onFailure: (transaction) => {
        console.log(transaction.getError());
        reject(transaction.getError().message);
      },
    });
  });
}

export function login(username, password) {
  // return new Promise((resolve, reject) => {
  //   Relay.Store.commitUpdate(new LoginMutation({
  //     input: {
  //       username: username,
  //       password: password,
  //     },
  //     user: null,
  //   }), {
  //     onSuccess: (data) => {
  //       resolve(data);
  //     },
  //
  //     onFailure: (transaction) => {
  //       reject(transaction.getError().message);
  //     },
  //   });
  // });
}

export class Home extends Component {
  static propTypes = {
    Users: PropTypes.Object
  };

  constructor() {
    super();
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          {this.props.Users.name}
        </Text>
        <Text style={styles.instructions}>
          To get started, edit index.ios.js
        </Text>
        <Text style={styles.instructions}>
          Press Cmd+R to reload,{'\n'}
          Cmd+D or shake for dev menu
        </Text>
        <TouchableHighlight onPress={() => register("fffffffddff@gfmail.com", "fzzzfff", "12a34")}>
          <Text>Register</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

export default Relay.createContainer(Home, {
  initialVariables: {
    orderBy: null
  },
  fragments: {
    Users: () => {
      return Relay.QL `
          fragment on User {
              _id,
              email,
              name,
              createdAt
          }
      `;
    }
  }
});

