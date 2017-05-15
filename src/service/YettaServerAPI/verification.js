import * as YettaServerAPIclient from './client';
import { handleError } from './../../utils/errorHandlers';
import { URL } from './../../utils';

const ID_UPLOAD_URL = `${URL}/upload?query=mutation{userUploadIdImage(input:{}){imgUrl clientMutationId}}`;

export const idVerificationImageUpload = (base64data) => {
  return YettaServerAPIclient.getFetchHeaders()
    .then(headers => {
      const data = new FormData();
      data.append('file', base64data);
      return fetch(ID_UPLOAD_URL, {
        method: 'POST',
        headers: {
          ...headers,
          Accept: 'application/json'
        },
        body: data
      });
    })
    .then(response => {
      return response.rjson();
    })
    .then(rjson => {
      __DEV__ && console.log(rjson); // eslint-disable-line no-undef
      const { ok } = rjson;
      if (ok === true) {
        return true;
      }
      throw new Error();
    })
    .catch(err => {
      __DEV__ && console.log(err); // eslint-disable-line no-undef
      handleError(err);
    });
};
