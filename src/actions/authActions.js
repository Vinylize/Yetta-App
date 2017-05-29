import * as types from './actionTypes';
import store from './../store';
import * as firebase from 'firebase';
import * as YettaServerAPIauth from './../service/YettaServerAPI/auth';
import * as YettaServerAPIclient from './../service/YettaServerAPI/client';
import { NavigationActions } from 'react-navigation';

export const setUser = (user) => {
  return {
    type: types.setUser,
    user
  };
};

export const userSignout = () => {
  return YettaServerAPIauth.userSignOut()
    .then(() => firebase.auth().signOut())
    .then(() => {
      const { navigator } = store.getState().navigator;
      if (navigator) {
        const resetAction = NavigationActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({ routeName: 'Login' })
          ]
        });
        navigator.dispatch(resetAction);
      } else {
        console.log('ERROR: navigator is undefined');
      }
      YettaServerAPIclient.resetLokkaClient();
    })
    .catch(error => {
      console.log(error);
    });
};
