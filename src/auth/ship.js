import { getAuthHeaders } from './auth';
import { URL } from './../utils';

export function updateShipLocation(location) {
  const endPoint = `${URL}user/coordinate`;
  const body = JSON.stringify({
    location
  });
  return getAuthHeaders().then((authHeaders) => {
    return fetch(endPoint, {method: 'PUT', headers: authHeaders, body}).then(res => res.json());
  });
}
