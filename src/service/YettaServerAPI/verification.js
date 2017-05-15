import * as YettaServerAPIclient from './client';
import { handleError } from './../../utils/errorHandlers';
import { URL } from './../../utils';
import store from './../../store';

// redux functions
import { setIsWaitingForJudge } from './../../actions/runnerStatusActions';
import { setBusyWaitingRunnerIdImageUpload } from './../../actions/busyWaitingActions';

const ID_UPLOAD_URL = `${URL}/upload?query=mutation{userUploadIdImage(input:{}){imgUrl clientMutationId}}`;

export const runnerApplyFirstJudge = () => {
  return new Promise((resolve, reject) => {
    return YettaServerAPIclient.getLokkaClient()
      .then(client => {
        return client.mutate(`{
          runnerApplyFirstJudge(
            input:{
            }
          ) {
            result
          }
        }`);
      })
      .then(res => {
        __DEV__ && console.log(res); // eslint-disable-line no-undef
        store.dispatch(setIsWaitingForJudge(true));
        store.dispatch(setBusyWaitingRunnerIdImageUpload(false));
        return resolve(res);
      })
      .catch(err => {
        __DEV__ && console.log(err); // eslint-disable-line no-undef
        store.dispatch(setBusyWaitingRunnerIdImageUpload(false));
        // handleError(err);
        return reject(err);
      });
  });
};

export const idVerificationImageUpload = (base64data) => {
  return YettaServerAPIclient.getFetchHeaders()
    .then(headers => {
      store.dispatch(setBusyWaitingRunnerIdImageUpload(true));

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
      const { status, ok, url } = response;
      __DEV__ && console.log(status, ok, url); // eslint-disable-line no-undef
      // todo: determine what to do with url
      if (ok === true) {
        return runnerApplyFirstJudge();
      }
      throw new Error();
    })
    .catch(err => {
      __DEV__ && console.log(err); // eslint-disable-line no-undef
      store.dispatch(setBusyWaitingRunnerIdImageUpload(false));
      handleError(err);
    });
};
