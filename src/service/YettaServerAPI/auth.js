import * as YettaServerAPIclient from './client';
import { handleError } from './../../utils/errorHandlers';

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
