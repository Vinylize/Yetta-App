import * as YettaServerAPIclient from './client';
import { handleError } from './../../utils/errorHandlers';
import Config from 'react-native-config';

const PROFILE_UPLOAD_URL = `${Config.API_URL}/upload?query=mutation{userUploadProfileImage(input:{}){imgUrl clientMutationId}}`;

export const userProfileImageUpload = (base64data) => {
  return YettaServerAPIclient.getFetchHeaders()
    .then(headers => {
      const data = new FormData();
      data.append('file', base64data);

      return fetch(PROFILE_UPLOAD_URL, {
        method: 'POST',
        headers: {
          ...headers,
          Accept: 'application/json'
        },
        body: data
      });
    })
    .then(response => {
      const { status, ok, url } = response;
      __DEV__ && console.log(status, ok, url); // eslint-disable-line no-undef
      // todo: determine what to do with url
      if (ok === true) {
        return response;
      }
      throw new Error();
    })
    .catch(err => {
      __DEV__ && console.log(err); // eslint-disable-line no-undef
      handleError(err);
    });
};

export const userChangeName = (newName) => {
  return new Promise((resolve, reject) => {
    return YettaServerAPIclient.getLokkaClient()
      .then(client => {
        return client.mutate(`{
          userUpdatename(
            input:{
              n: "${newName}"
            }
          ) {
            result
          }
        }`);
      })
      .then(res => {
        __DEV__ && console.log(res); // eslint-disable-line no-undef
        return resolve(res);
      })
      .catch(err => {
        __DEV__ && console.log(err); // eslint-disable-line no-undef
        handleError(err);
        return reject(err);
      });
  });
};
