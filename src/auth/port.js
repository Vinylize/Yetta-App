import { getAuthHeaders } from './auth';

const url = 'http://192.168.0.76:5001/';

export function getPortLocation() {
  const endPoint = `${url}user/coordinate/586e47e5d8b972288f382f77`;
  return getAuthHeaders().then((authHeaders) => {
    return fetch(endPoint, {method: 'GET', headers: authHeaders}).then(res => res.json());
  });
}
