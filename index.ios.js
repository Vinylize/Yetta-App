import { AppRegistry } from 'react-native';
import Vinyl from './src/app';
import * as firebase from 'firebase';

// firebase.initializeApp(config);

AppRegistry.registerComponent('pingstersApp', () => Vinyl);
