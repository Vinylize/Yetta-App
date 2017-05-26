import {
  NativeModules,
  Platform
} from 'react-native';
import * as firebase from 'firebase';
import Config from 'react-native-config';

const Lokka = require('lokka').Lokka;
const Transport = require('lokka-transport-http').Transport;

const client = new Lokka({
  transport: new Transport(Config.API_URL)
});

export const getDeviceID = () => {
  const iOSUUIDManager = NativeModules.YettaUUID;
  const AndroidUDIDManager = NativeModules.YettaUDIDManager;
  return new Promise((resolve, reject) => {
    if (Platform.OS === 'ios') {
      return iOSUUIDManager.getUUID((error, events) => {
        if (error) {
          // todo: handle error or edge cases
          __DEV__ && console.log(error); // eslint-disable-line no-undef
        }
        __DEV__ && console.log('UUID: ', events); // eslint-disable-line no-undef
        return resolve(events[0]);
      });
    } else if (Platform.OS === 'android') {
      return AndroidUDIDManager.getUDID(
        (msg) => {
          __DEV__ && console.log(msg); // eslint-disable-line no-undef
        },
        (UDID) => {
          __DEV__ && console.log(UDID); // eslint-disable-line no-undef
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

export const getFetchHeaders = () => {
  let fcmToken;
  return firebase.auth().currentUser.getToken()
    .then(token => {
      fcmToken = token;
      return getDeviceID();
    })
    .then(deviceID => {
      const headers = {
        authorization: fcmToken,
        device: deviceID
      };
      __DEV__ && console.log(headers); // eslint-disable-line no-undef
      return headers;
    })
    .catch(console.log);
};

export const getLokkaClientForRegistration = () => {
  return getDeviceID()
    .then(deviceID => {
      client._transport._httpOptions.headers = {
        device: deviceID
      };
      return client;
    })
    .catch(console.log);
};

export const resetLokkaClient = () => {
  client._transport._httpOptions.headers = {
    authorization: null
  };
};
