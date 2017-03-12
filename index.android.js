import { AppRegistry } from 'react-native';
import Vinyl from './src/app';
import * as firebase from 'firebase';
import { firebaseConfig } from './src/utils';

firebase.initializeApp(firebaseConfig);

AppRegistry.registerComponent('pingstersApp', () => Vinyl);
