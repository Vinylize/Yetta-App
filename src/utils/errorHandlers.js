/**
 * Created by jeyoungchan on 5/10/17.
 */
import { Alert } from 'react-native';
import * as authActions from './../actions/authActions';

export const handleError = (error, fromSignin) => {
  __DEV__ && console.log(error); // eslint-disable-line no-undef
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
    } else if (message.includes('There is no items selected')) {
      // error on creating order when no times selected
      Alert.alert('선택된 물품이 없습니다.');
    } else if (message.includes('Verify your phone first')) {
      Alert.alert('폰 인증을 먼저 해주세요');
    } else if (message.includes('GraphQL Error:')) {
      // handle general graphQL error
      const prettyErrorMessage = message.substring(message.indexOf('GraphQL Error:') + 14);
      Alert.alert(prettyErrorMessage);
    }
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
  __DEV__ && console.log(error); // eslint-disable-line no-undef
};
