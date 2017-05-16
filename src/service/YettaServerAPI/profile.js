import * as YettaServerAPIclient from './client';
import { handleError } from './../../utils/errorHandlers';
import { URL } from './../../utils';

const PROFILE_UPLOAD_URL = `${URL}/upload?query=mutation{userUploadProfileImage(input:{}){imgUrl clientMutationId}}`;

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
