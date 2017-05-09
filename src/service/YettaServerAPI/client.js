import {
  NativeModules,
  Platform
} from 'react-native';
import * as firebase from 'firebase';
import { URL } from './../../utils';

const Lokka = require('lokka').Lokka;
const Transport = require('lokka-transport-http').Transport;

const client = new Lokka({
  transport: new Transport(URL)
});

export const getDeviceID = () => {
  const iOSUUIDManager = NativeModules.YettaUUID;
  const AndroidUDIDManager = NativeModules.YettaUDIDManager;
  return new Promise((resolve, reject) => {
    if (Platform.OS === 'ios') {
      return iOSUUIDManager.getUUID((error, events) => {
        if (error) {
          // todo: handle error or edge cases
          console.log(error);
        }
        console.log('UUID: ', events);
        return resolve(events[0]);
      });
    } else if (Platform.OS === 'android') {
      return AndroidUDIDManager.getUDID(
        (msg) => {
          console.log(msg);
        },
        (UDID) => {
          console.log('UDID', UDID);
          return resolve(UDID);
        }
      );
    }
    // todo: handle error
    return reject();
  });
};

export const getLokkaClient = () => {
  let fcmToken;
  return firebase.auth().currentUser.getToken()
    .then(token => {
      fcmToken = token;
      return getDeviceID();
    })
    .then(deviceID => {
      client._transport._httpOptions.headers = {
        authorization: fcmToken,
        device: deviceID
      };
      return client;
    })
    .catch(console.log);
};
