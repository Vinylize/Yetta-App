import { APIKEY, URL_GEOCODING } from './../utils';

export const geocoding = (latitude, longitude) => {
  const uri = `${URL_GEOCODING}latlng=${latitude},${longitude}&key=${APIKEY}`;
  return fetch(uri)
    .then(res => res.json())
    .then(rjson => {
      console.log(rjson);
      if (rjson.status === 'OK') {
        // todo: use address_components for parsed result as array
        return rjson.results[0].address_components;
      }
      throw new Error();
    })
    .catch(console.log);
};
