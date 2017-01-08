import { AsyncStorage } from 'react-native';

const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json'
};
const url = 'http://220.76.27.58:5001/';

export function register(email, name, password) {
  const endPoint = `${url}auth/signup`;
  const body = JSON.stringify({
    email: email,
    name: name,
    password: password
  });
  return fetch(endPoint, {method: 'POST', headers, body}).then(res => res.json());
}

export function login(email, password) {
  const endPoint = `${url}auth/login`;
  const body = JSON.stringify({
    email: email,
    password: password
  });
  return fetch(endPoint, {method: 'POST', headers, body}).then(res => res.json());
}

export const getAuthHeaders = async () => {
  const accessToken = await AsyncStorage.getItem('accessToken');
  const authHeaders = JSON.parse(JSON.stringify(headers));
  authHeaders.Authorization = `${accessToken}`;
  return authHeaders;
};
