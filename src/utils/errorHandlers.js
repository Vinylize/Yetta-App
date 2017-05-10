/**
 * Created by jeyoungchan on 5/10/17.
 */
import { Alert } from 'react-native';
import * as authActions from './../actions/authActions';

export const handleError = (error, fromSignin) => {
  console.log(error);
  console.log(error.message);
  const { message } = error;
  if (message && message.constructor === String) {
    // sign out when unauthorized
    if (message.includes('unauthorizedError')) {
      authActions.userSignout();
      if (fromSignin) {
        Alert.alert('Another device logged in. Please login again.');
      } else {
        Alert.alert('Another device logged in, signing out');
      }
    }
  }
};

export const handleFbError = (error) => {
  const { message } = error;
  if (message) {
    Alert.alert(
      message
    );
  }
};

export const handleFirebaseSignInError = (error) => {
  const errorCode = error.code;
  const errorMessage = error.message;
  if (errorCode === 'auth/wrong-password') {
    Alert.alert('Wrong password');
  } else {
    Alert.alert(errorMessage);
  }
  console.log(error);
};
