import * as YettaServerAPIclient from './client';
import { handleError } from './../../utils/errorHandlers';

export const queryUser = () => {
  return new Promise((resolve, reject) => {
    return YettaServerAPIclient.getLokkaClient()
      .then(client => {
        return client.query(`{
          viewer{
            isPV,
            e,
            n,
            p
          }
        }`);
      })
      .then(({viewer}) => {
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
