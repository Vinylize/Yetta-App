import * as YettaServerAPIclient from './client';
import { handleError } from './../../utils/errorHandlers';
import store from './../../store';

// redux actions
import { setRunnersOrderDetails } from './../../actions/orderStatusActions';

export const getInitialOrderDetailsForRunner = (orderId) => {
  __DEV__ && console.log('query order details at order id: ', orderId); // eslint-disable-line no-undef
  return new Promise((resolve, reject) => {
    return YettaServerAPIclient.getLokkaClient()
      .then(client => {
        return client.query(`{
          viewer{
            order (id: "${orderId}") {
              nId {
                id,
                n,
                p,
                type,
                imgUrl,
                addr,
                like,
                distance,
                formattedDistance,
                coordinate {
                  lat,
                  lon
                }
              },
              oId {
                id,
                e,
                n,
                p,
                pUrl,
                r,
                coordinate {
                  lat,
                  lon
                }
              },
              items {
                regItem {
                  iId,
                  n,
                  p,
                  cnt
                },
                customItem {
                  manu,
                  n,
                  cnt
                }
              },
              dest {
                n1,
                n2,
                lat,
                lon
              },
              status,
              cancAt,
              cancDesc,
              rSAt,
              dC,
              rC,
              eDP,
              tP,
              cAt
            }
          }
        }`);
      })
      .then(({viewer}) => {
        const { order } = viewer;
        if (order) {
          __DEV__ && console.log(order); // eslint-disable-line no-undef
          store.dispatch(setRunnersOrderDetails(order));
          return resolve(order);
        }
        throw new Error(viewer);
      })
      .catch(err => {
        handleError(err);
        return reject(err);
      });
  });
};
