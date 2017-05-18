import * as YettaServerAPIclient from './client';
import { handleError } from './../../utils/errorHandlers';

export const userCreateIamportSubscribePayment = (userCreateIamportSubscribePaymentInput) => {
  const { num, exp, birth, pw2 } = userCreateIamportSubscribePaymentInput;
  return new Promise((resolve, reject) => {
    return YettaServerAPIclient.getLokkaClient()
      .then(client => {
        return client.mutate(`{
          userCreateIamportSubscribePayment(
            input:{
              num: "${num}",
              exp: "${exp}",
              birth: "${birth}",
              pw2: "${pw2}"
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

export const userDeleteIamportSubscribePayment = () => {
  return new Promise((resolve, reject) => {
    return YettaServerAPIclient.getLokkaClient()
      .then(client => {
        return client.mutate(`{
          userCreateIamportSubscribePayment(
            input:{
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
