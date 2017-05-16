import React from 'react';
import { StackNavigator } from 'react-navigation';

import MapView from '../components/homeScreen/mapView';
import LoginScreen from './../components/login';
import ProfileScreen from './../components/profile';
import RegisterScreen from './../components/register';
import PhoneVerificationScreen from './../components/phoneVerification';
import PaymentInfoScreen from './../components/paymentInfo/paymentInfo';
import CreateOrderScreen from './../components/createOrder/createOrder';
import SettingScreen from './../components/settings/setting';
import OrderHistoryScreen from './../components/orderHistory/orderHistory';
import RunnerHistoryScreen from './../components/runnerHistory/runnerHistory';
import SplashScreen from './../components/splash';
import IdVerification from './../components/idVerification/idVerification';

export const AppNavigator = StackNavigator({
  Login: { screen: LoginScreen },
  Register: { screen: RegisterScreen },
  PhoneVerification: { screen: PhoneVerificationScreen },
  CreateOrder: { screen: CreateOrderScreen },
  PaymentInfo: { screen: PaymentInfoScreen },
  Profile: { screen: ProfileScreen },
  Setting: { screen: SettingScreen },
  OrderHistory: { screen: OrderHistoryScreen },
  RunnerHistory: { screen: RunnerHistoryScreen },
  Splash: { screen: SplashScreen },
  Home: { screen: MapView },
  IdVerification: { screen: IdVerification }
}, {
  initialRouteName: 'Splash',
  headerMode: 'none'
});

export default () => <AppNavigator />;
