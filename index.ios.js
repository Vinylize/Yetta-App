import { AppRegistry } from 'react-native';
import Vinyl from './src/app';
import * as firebase from 'firebase';
import Config from 'react-native-config';

__DEV__ && console.log(Config.firebaseConfig); // eslint-disable-line no-undef
const jsonFirebaseConfig = {
  apiKey: Config.firebaseConfig_apiKey,
  authDomain: Config.firebaseConfig_authDomain,
  databaseURL: Config.firebaseConfig_databaseURL,
  storageBucket: Config.firebaseConfig_storageBucket,
  messagingSenderId: Config.firebaseConfig_messagingSenderId
};
firebase.initializeApp(jsonFirebaseConfig);

AppRegistry.registerComponent('pingstersApp', () => Vinyl);
