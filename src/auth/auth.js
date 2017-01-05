const headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
};
const url = 'http://192.168.0.76:5001/';

export function register(email, name, password) {
  const endPoint = `${url}user/signup`;
  const body = JSON.stringify({
    email: email,
    name: name,
    password: password
  });
  return fetch(endPoint, {method: 'POST', headers, body}).then(res => res.json());
}

export function login(email, password) {
  const endPoint = `${url}user/login`;
  const body = JSON.stringify({
    email: email,
    password: password
  });
  return fetch(endPoint, {method: 'POST', headers, body}).then(res => res.json());
}
