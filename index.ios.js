import { AppRegistry } from 'react-native';
import Vinyl from './src/app';
import * as firebase from 'firebase';

const config = {
  
};

firebase.initializeApp(config);

AppRegistry.registerComponent('pingstersApp', () => Vinyl);
