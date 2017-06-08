import * as YettaServerAPIclient from './client';
import { handleError } from './../../utils/errorHandlers';
import store from './../../store';

// redux actions
import { setIsRunner } from './../../actions/userStatusActions';
import { setIdVerified, setIsWaitingForJudge } from './../../actions/runnerStatusActions';

export const queryUser = () => {
  return new Promise((resolve, reject) => {
    return YettaServerAPIclient.getLokkaClient()
      .then(client => {
        __DEV__ && console.log('got client: ' + JSON.stringify(client)); // eslint-disable-line no-undef
        return client.query(`{
          viewer{
            isPV,
            isRA,
            isWJ,
            mode,
            r,
            e,
            n,
            p,
            pUrl,
            userPaymentInfo {
              type,
              num,
              provider
            }
          }
        }`);
      })
      .then(({viewer}) => {
        __DEV__ && console.log(viewer); // eslint-disable-line no-undef
        const { mode, isRA, isWJ } = viewer;
        if (mode === 0) {
          store.dispatch(setIsRunner(false));
        } else if (mode === 1) {
          store.dispatch(setIsRunner(true));
        }
        if (isRA === true) {
          store.dispatch(setIdVerified(true));
        } else if (isRA === false) {
          store.dispatch(setIdVerified(false));
        }
        if (isWJ === true) {
          store.dispatch(setIsWaitingForJudge(true));
        } else if (isWJ === false) {
          store.dispatch(setIsWaitingForJudge(false));
        }
        return resolve(viewer);
      })
      .catch(e => {
        console.log(e);
        return reject(e);
      });
  });
};

export const checkRunnerIDVerification = () => {
  return new Promise((resolve, reject) => {
    return YettaServerAPIclient.getLokkaClient()
      .then(client => {
        return client.query(`{
          viewer{
            isRA,
            isWJ
          }
        }`);
      })
      .then(({viewer}) => {
        return resolve(viewer);
      })
      .catch(e => {
        handleError(e);
        console.log(e);
        return reject(e);
      });
  });
};
