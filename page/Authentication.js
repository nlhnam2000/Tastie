import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  ActivityIndicator,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MapboxGL from '@react-native-mapbox-gl/maps';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import fontAwesome from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {LoginForm} from '../components/UserAdmission/Login/LoginForm';
import {SignupScreen} from '../components/UserAdmission/Signup/SignupScreen';
import {SignupScreen2} from '../components/UserAdmission/Signup/SignupScreen2';
import {SignupScreen3} from '../components/UserAdmission/Signup/SignupScreen3';

const Stack = createNativeStackNavigator();

export const Authentication = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={LoginForm}
          options={{headerShown: false}}
        />
        <Stack.Screen name="Account Registration" component={SignupScreen} />
        <Stack.Screen name="Email Verification" component={SignupScreen2} />
        <Stack.Screen name="Update Profile" component={SignupScreen3} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
