import * as types from './actionTypes';
import store from './../store';
import * as firebase from 'firebase';
import * as YettaServerAPIauth from './../service/YettaServerAPI/auth';
import * as YettaServerAPIclient from './../service/YettaServerAPI/client';
import { loginNavigatorRoute } from './../navigator/navigatorRoutes';

export const setUser = (user) => {
  return {
    type: types.setUser,
    user
  };
};

export const userSignout = () => {
  YettaServerAPIauth.userSignOut()
    .then(() => firebase.auth().signOut())
    .then((res) => {
      console.log(res, 'signed out');
      const { navigator } = store.getState().navigator;
      console.log(navigator);
      if (navigator) {
        navigator.replace(loginNavigatorRoute());
      } else {
        console.log('ERROR: navigator is undefined');
      }
      YettaServerAPIclient.resetLokkaClient();
    })
    .catch(error => {
      console.log(error);
    });
};
