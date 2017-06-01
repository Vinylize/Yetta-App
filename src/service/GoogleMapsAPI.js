import Config from 'react-native-config';

export const geocoding = (latitude, longitude) => {
  const uri = `${Config.URL_GEOCODING}latlng=${latitude},${longitude}&key=${Config.GOOGLE_MAPS_API_KEY}`;
  return fetch(uri)
    .then(res => res.json())
    .then(rjson => {
      console.log(rjson);
      if (rjson.status === 'OK') {
        // todo: use address_components for parsed result as array
        return rjson.results[0].address_components;
      }
      throw new Error();
    });
};

export const placeDetails = (placeid) => {
  const uri = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeid}&key=${Config.GOOGLE_MAPS_API_KEY}`;
  return fetch(uri)
    .then(res => res.json())
    .then(rjson => {
      console.log(rjson);
      if (rjson.status === 'OK') {
        return rjson.result.geometry.location;
      }
      throw new Error();
    })
    .catch(console.log);
};

export const directions = (originCoordinate, destCoordinate) => {
  const uri = 'https://maps.googleapis.com/maps/api/directions/json?' +
    `origin=${originCoordinate.lat},${originCoordinate.lon}&` +
    `destination=${destCoordinate.lat},${destCoordinate.lon}&` +
    'mode=transit&' +
    `key=${Config.GOOGLE_MAPS_API_KEY}`;
  return fetch(uri)
    .then(res => res.json())
    .then(rjson => {
      __DEV__ && console.log(rjson); // eslint-disable-line no-undef
      if (rjson.status === 'OK' && rjson.routes) {
        return rjson.routes[0].overview_polyline.points;
      }
      throw new Error(rjson.status);
    })
    .catch(err => {
      __DEV__ && console.log(err); // eslint-disable-line no-undef
    });
};
