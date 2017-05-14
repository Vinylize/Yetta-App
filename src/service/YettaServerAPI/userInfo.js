import * as YettaServerAPIclient from './client';

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
