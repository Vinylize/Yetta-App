import { AppRegistry } from 'react-native';
import Vinyl from './src/app';
import * as firebase from 'firebase';
import Config from 'react-native-config';

__DEV__ && console.log(Config.firebaseConfig); // eslint-disable-line no-undef
const jsonFirebaseConfig = JSON.parse(Config.firebaseConfig);
firebase.initializeApp(jsonFirebaseConfig);

AppRegistry.registerComponent('pingstersApp', () => Vinyl);
