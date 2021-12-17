import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {SignupScreen} from '../components/UserAdmission/Signup/SignupScreen';
import {SignupScreen2} from '../components/UserAdmission/Signup/SignupScreen2';
import {SignupScreen3} from '../components/UserAdmission/Signup/SignupScreen3';

import {useSelector} from 'react-redux';

export const SignupForm = props => {
  const signupForm = useSelector(state => state.UserReducer.signup_form);
  if (signupForm === 1) {
    return <SignupScreen />;
  } else if (signupForm === 2) {
    return <SignupScreen2 />;
  } else if (signupForm === 3) {
    return <SignupScreen3 navigation={props.navigation} />;
  }
};
