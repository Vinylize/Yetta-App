import Relay from 'react-relay';
import RegisterMutation from './../mutations/register';
import LoginMutation from './../mutations/login';

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
      }
    });
  });
}

export function login(email, password) {
  return new Promise((resolve, reject) => {
    Relay.Store.commitUpdate(new LoginMutation({
      input: {
        email: email,
        password: password
      }
    }), {
      onSuccess: (data) => {
        console.log(data);
        resolve(data);
      },

      onFailure: (transaction) => {
        console.log(transaction.getError().message);
        reject(transaction.getError().message);
      }
    });
  });
}
