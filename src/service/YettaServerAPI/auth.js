import * as YettaServerAPIclient from './client';
import {
  Platform,
  NativeModules
} from 'react-native';
import { handleError } from './../../utils/errorHandlers';

export const getFCMToken = () => {
  // this is for readability
  const iOSFCMManager = NativeModules.YettaFCMManager;
  const AndroidFCMManager = NativeModules.YettaFCMManager;
  return new Promise((resolve, reject) => {
    if (Platform.OS === 'ios') {
      return iOSFCMManager.getToken((error, events) => {
        if (error) {
          // todo: handle error or edge cases
          console.log(error);
          return reject(error);
        }
        console.log(events);
        return resolve(events[0]);
      });
    } else if (Platform.OS === 'android') {
      return AndroidFCMManager.getToken(
        (msg) => {
          console.log(msg);
          return reject(msg);
        },
        (FCMToken) => {
          console.log(FCMToken);
          return resolve(FCMToken);
        }
      );
    }
    return reject();
  });
};

export const userSignIn = () => {
  let lokkaClient;
  let tmpDeviceId;
  return YettaServerAPIclient.getLokkaClient()
    .then(client => {
      lokkaClient = client;
      return YettaServerAPIclient.getDeviceID();
    })
    .then(deviceID => {
      tmpDeviceId = deviceID;
      return getFCMToken();
    })
    .then(FCMtoken => {
      return new Promise((resolve, reject) => {
        return lokkaClient.mutate(`{
          userSignIn(
            input:{
              dt: "${FCMtoken}",
              d: "${tmpDeviceId}"
            }
          ) {
            result
          }
        }`)
          .then(res => {
            return resolve(res);
          })
          .catch(err => {
            console.log(err);
            handleError(err, true);
            return reject(err);
          });
      });
    });
};

/*
 * this should be internally used with firebase.signout
 * by userSignout from actions/authActions.js
 */
export const userSignOut = () => {
  return new Promise((resolve, reject) => {
    return YettaServerAPIclient.getLokkaClient()
      .then(client => {
        return client.mutate(`{
          userSignOut(
            input:{
            }
          ) {
            result
          }
        }`);
      })
      .then(res => {
        return resolve(res);
      })
      .catch(err => {
        handleError(err);
        return reject(err);
      });
  });
};

export const userSetMode = (mode) => {
  return new Promise((resolve, reject) => {
    return YettaServerAPIclient.getLokkaClient()
      .then(client => {
        return client.mutate(`{
          userSetMode(
            input: {
              mode: ${mode}
            }
          ) {
            result
          }
        }`);
      })
      .then(res => {
        console.log(res);
        return resolve(res);
      })
      .catch(err => {
        console.log(err);
        handleError(err);
        return reject(err);
      });
  });
};
