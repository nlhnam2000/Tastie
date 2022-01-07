import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {signout} from '../store/action/auth';

import {SideMenu} from '../components/Menu/SideMenu';
import {NavigationBar} from '../components/Menu/NavigationBar';
import {Home} from '../components/HomePage/Home';
import {Account} from '../components/HomePage/Account';
import {Cart} from '../components/HomePage/Cart';
import {Browse} from '../components/HomePage/Browse';

import {useSelector, useDispatch} from 'react-redux';

const Stack = createNativeStackNavigator();

export const HomeScreen = props => {
  const currentTab = useSelector(state => state.UserReducer.currentTab);
  if (currentTab === 'Home') {
    return <Home tabname={currentTab} {...props} />;
  } else if (currentTab === 'Account') {
    return <Account tabname={currentTab} {...props} />;
  } else if (currentTab === 'Cart') {
    return <Cart tabname={currentTab} {...props} />;
  } else if (currentTab === 'Browse') {
    return <Browse tabname={currentTab} {...props} />;
  }

  // return (
  //   <Stack.Navigator initialRouteName="Home">
  //     <Stack.Screen
  //       name="Home"
  //       component={HomePage}
  //       options={{headerShown: false}}
  //       // navigation={props.navigation}
  //     />
  //     <Stack.Screen
  //       name="Account"
  //       component={Account}
  //       options={{headerShown: false}}
  //       navigation={props.navigation}
  //     />
  //   </Stack.Navigator>
  // );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    flex: 1,
  },
});
