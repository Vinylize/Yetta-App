import * as YettaServerAPIclient from './client';
import { handleError } from './../../utils/errorHandlers';
// import store from './../../store';

// redux actions
// import { setIsRunner } from './../../actions/userStatusActions';

export const queryUser = () => {
  return new Promise((resolve, reject) => {
    return YettaServerAPIclient.getLokkaClient()
      .then(client => {
        return client.query(`{
          viewer{
            isPV,
            isRA,
            isWJ,
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
        // if (viewer.mode === 0) {
        //   store.dispatch(setIsRunner(false));
        // } else if (viewer.mode === 1) {
        //   store.dispatch(setIsRunner(true));
        // }
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
