/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  ActivityIndicator,
  Image,
  Button,
  Platform,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import fontAwesome from 'react-native-vector-icons/FontAwesome';
import IonIcon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// import components
import {SignupScreen} from './components/UserAdmission/Signup/SignupScreen';
import {SignupScreen2} from './components/UserAdmission/Signup/SignupScreen2';
import {SignupScreen3} from './components/UserAdmission/Signup/SignupScreen3';
import {LoginForm} from './components/UserAdmission/Login/LoginForm';
import {Authentication} from './page/Authentication';
import {SignupForm} from './screens/SignupForm';
import {HomeScreen} from './screens/HomeScreen';
import {SideMenu} from './components/Menu/SideMenu';
import {Home} from './components/HomePage/Home';
import {DetailProvider} from './components/HomePage/Detail/DetailProvider';
import {DetailOrder} from './components/HomePage/Detail/DetailFood';
import {Account} from './components/HomePage/Account';
import {ForgotForm} from './components/UserAdmission/ForgotPassword/ForgotForm';
import {ResetPasswordDone} from './components/UserAdmission/ForgotPassword/ResetPasswordDone';
import {Cart} from './components/HomePage/Cart';
import {Begin} from './screens/Begin';
import {PhoneInputForm} from './components/UserAdmission/Signup/PhoneInputForm';
import {EmailInputForm} from './components/UserAdmission/Signup/EmailInputForm';
import {NameInputForm} from './components/UserAdmission/Signup/NameInputForm';
import {PasswordInputForm} from './components/UserAdmission/Signup/PasswordInputForm';
import {ChangePasswordForm} from './components/UserAdmission/ForgotPassword/ChangePasswordForm';
import {DetailAccount} from './components/HomePage/Detail/DetailAccount';

// redux
import {useSelector, useDispatch} from 'react-redux';

import {
  EmailVerification,
  retrieveToken,
  signout,
  TokenNotFound,
} from './store/action/auth';
import colors from './colors/colors';
import axios from 'axios';
import {IP_ADDRESS, getAccessToken} from './global';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

Feather.loadFont();
fontAwesome.loadFont();
IonIcon.loadFont();
MaterialCommunity.loadFont();

export default function App(props) {
  const state = useSelector(state => state.UserReducer);
  const dispatch = useDispatch();

  // Get user profile for each time the app is rendered
  useEffect(() => {
    setTimeout(async () => {
      let refreshToken = await AsyncStorage.getItem('user_token');

      // console.log('refresh token', refreshToken);
      if (refreshToken !== null) {
        let accessToken = await getAccessToken(refreshToken);
        dispatch(retrieveToken(accessToken));
      } else {
        dispatch(TokenNotFound());
      }
      console.log(state);
    }, 1000);
  }, []);

  if (state.isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.red} />
      </View>
    );
  } else {
    return (
      <NavigationContainer>
        {state.user_token !== null ? (
          // <Drawer.Navigator drawerContent={props => <SideMenu {...props} />}>
          //   <Drawer.Screen
          //     name="Home Page"
          //     component={HomeScreen}
          //     options={{headerShown: false}}
          //   />
          // </Drawer.Navigator>
          <Stack.Navigator initialRouteName="Home Page">
            <Stack.Screen
              name="Home Page"
              component={HomeScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="DetailProvider"
              component={DetailProvider}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="DetailOrder"
              component={DetailOrder}
              options={{headerShown: false}}
            />
            {/* <Stack.Screen name="Cart" component={Cart} /> */}
            <Stack.Screen
              name="Account"
              component={Account}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="DetailAccount"
              component={DetailAccount}
              options={{
                // headerTitle: 'Profile',
                // headerStyle: {backgroundColor: 'white'},
                headerShown: false,
              }}
            />
          </Stack.Navigator>
        ) : (
          <Stack.Navigator initialRouteName="Begin">
            <Stack.Screen
              name="Begin"
              component={Begin}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Login"
              component={LoginForm}
              options={{headerShown: false, animationTypeForReplace: 'pop'}}
            />
            <Stack.Screen
              name="PhoneInputForm"
              component={PhoneInputForm}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="EmailVerification"
              component={SignupScreen2}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="EmailInputForm"
              component={EmailInputForm}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="NameInputForm"
              component={NameInputForm}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="PasswordInputForm"
              component={PasswordInputForm}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="ForgotForm"
              component={ForgotForm}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="ChangePasswordForm"
              component={ChangePasswordForm}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="ResetPasswordDone"
              component={ResetPasswordDone}
            />
          </Stack.Navigator>
        )}
      </NavigationContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
