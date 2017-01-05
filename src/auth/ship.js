import { getAuthHeaders } from './auth';

const url = 'http://192.168.0.76:5001/';

export function updateShipLocation(location) {
  const endPoint = `${url}user/coordinate`;
  const body = JSON.stringify({
    location
  });
  return getAuthHeaders().then((authHeaders) => {
    return fetch(endPoint, {method: 'PUT', headers: authHeaders, body}).then(res => res.json());
  });
}
