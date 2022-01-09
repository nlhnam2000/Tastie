import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SignupScreen} from '../components/UserAdmission/Signup/SignupScreen';
import {SignupScreen2} from '../components/UserAdmission/Signup/SignupScreen2';
import {SignupScreen3} from '../components/UserAdmission/Signup/SignupScreen3';
import {PhoneInputForm} from '../components/UserAdmission/Signup/PhoneInputForm';
import {LoginForm} from '../components/UserAdmission/Login/LoginForm';

import {useSelector} from 'react-redux';

const Stack = createNativeStackNavigator();

export const SignupForm = props => {
  // const signupForm = useSelector(state => state.UserReducer.signup_form);
  // if (signupForm === 1) {
  //   return <SignupScreen {...props} />;
  // } else if (signupForm === 2) {
  //   return <SignupScreen2 {...props} />;
  // } else if (signupForm === 3) {
  //   return <SignupScreen3 navigation={props.navigation} />;
  // }
  // const signupScreen = useSelector(state => state.UserReducer.signup_screen);
  // switch (signupScreen) {
  //   case 'Login': {
  //     return <LoginForm {...props} />;
  //   }
  //   case 'EmailVerification': {
  //     return <SignupScreen2 {...props} />;
  //   }
  //   default: {
  //     return <PhoneInputForm {...props} />;
  //   }
  // }
};
