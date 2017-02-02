import { getAuthHeaders } from './auth';
import { URL } from './../utils';

export function getPortLocation() {
  const endPoint = `${URL}user/coordinate/586e47e5d8b972288f382f77`;
  return getAuthHeaders().then((authHeaders) => {
    // todo: use lokka
    //return fetch(endPoint, {method: 'GET', headers: authHeaders}).then(res => res.json());
  });
}
