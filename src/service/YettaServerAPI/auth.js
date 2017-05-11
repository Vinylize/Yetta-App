import * as YettaServerAPIclient from './client';

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
        return reject(err);
      });
  });
};
