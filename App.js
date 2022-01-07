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
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import MapboxGL from '@react-native-mapbox-gl/maps';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import fontAwesome from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';

// import components
import {SignupScreen} from './components/UserAdmission/Signup/SignupScreen';
import {SignupScreen2} from './components/UserAdmission/Signup/SignupScreen2';
import {SignupScreen3} from './components/UserAdmission/Signup/SignupScreen3';
import {UserMap} from './components/UserLocation/UserMap';
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
// redux

import {useSelector, useDispatch} from 'react-redux';

import {retrieveToken, signout, TokenNotFound} from './store/action/auth';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

MapboxGL.setAccessToken(
  'pk.eyJ1IjoiaG9hbmduYW0yNDMiLCJhIjoiY2t1dHJxdjdlMHg5ZDJwbnlpcmo0a2NnMiJ9.DUrlIOzvO6-kWt-VCKZW1g',
);

Feather.loadFont();
fontAwesome.loadFont();
MaterialCommunity.loadFont();

export default function App(props) {
  const state = useSelector(state => state.UserReducer);
  const dispatch = useDispatch();

  // Get user profile for each time the app is rendered
  useEffect(() => {
    setTimeout(async () => {
      let token = await AsyncStorage.getItem('user_token');
      console.log(state);
      if (token) {
        dispatch(retrieveToken(token));
      } else {
        dispatch(TokenNotFound());
      }
    }, 1000);
  }, []);

  // useEffect(() => {
  //   setTimeout(() => {
  //     // await AsyncStorage.removeItem('token');
  //     dispatch(signout());
  //   }, 1000);
  // }, []);

  if (state.isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
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
              name="Signup"
              component={SignupForm}
              options={{headerShown: false}}
            />
            {/* <Stack.Screen
              name="Home Page"
              component={HomeScreen}
              options={{headerShown: false}}
            /> */}
            <Stack.Screen
              name="ForgotForm"
              component={ForgotForm}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="ResetPasswordDone"
              component={ResetPasswordDone}
            />
            <Stack.Screen name="Location" component={UserMap} />
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
