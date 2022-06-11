/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import {GestureHandlerRootView} from 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
import {StyleSheet, View, ActivityIndicator} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import fontAwesome from 'react-native-vector-icons/FontAwesome';
import IonIcon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ActionAlertDialog} from './components/Error/AlertDialog';

// import components
import {SignupScreen2} from './components/UserAdmission/Signup/SignupScreen2';
import {LoginForm} from './components/UserAdmission/Login/LoginForm';
import {HomeScreen} from './screens/HomeScreen';
import {DetailProvider} from './screens/HomePage/Detail/DetailProvider';
import {DetailFood} from './screens/HomePage/Detail/DetailFood';
import {Account} from './screens/HomePage/Account';
import {ForgotForm} from './components/UserAdmission/ForgotPassword/ForgotForm';
import {ResetPasswordDone} from './components/UserAdmission/ForgotPassword/ResetPasswordDone';
import {Begin} from './screens/Begin';
import {PhoneInputForm} from './components/UserAdmission/Signup/PhoneInputForm';
import {EmailInputForm} from './components/UserAdmission/Signup/EmailInputForm';
import {NameInputForm} from './components/UserAdmission/Signup/NameInputForm';
import {PasswordInputForm} from './components/UserAdmission/Signup/PasswordInputForm';
import {ChangePasswordForm} from './components/UserAdmission/ForgotPassword/ChangePasswordForm';
import {DetailAccount} from './screens/HomePage/Detail/DetailAccount';
import {Chat} from './screens/HomePage/Detail/Chat';
import {OrderStatus} from './screens/OrderStatus';
import {GoToCheckout} from './screens/GoToCheckout';
import {OrderHistory} from './screens/HomePage/Account/OrderHistory';
import {YourFavorites} from './screens/HomePage/Account/YourFavorites';
import {DetailOrder} from './screens/HomePage/Detail/DetailOrder';
import {RatingProvider} from './screens/HomePage/Account/Rating/RatingProvider';
import {RatingShipper} from './screens/HomePage/Account/Rating/RatingShipper';
import {ProductOptions} from './screens/HomePage/Detail/ProductOptions';
import {PromotionsList} from './screens/HomePage/Detail/Promotion/PromotionList';
import {ResultContent} from './screens/HomePage/HomeContent/ResultContent';
import {CustomerAddress} from './screens/CustomerAddress';
import {CustomerAddressForm} from './screens/CustomerAddressForm';
import {ChatScreen} from './screens/ChatScreen';
import {DetailEcoupon} from './screens/HomePage/Detail/Ecoupon/DetailEcoupon';
import {EditCustomerAddress} from './screens/EditCustomerAddress';
import {OrderHistoryTab} from './screens/HomePage/Account/OrderHistoryTab';
import {MapScreen} from './screens/MapScreen';
import {Review} from './screens/HomePage/Detail/Reviews/review';

// redux
import {useSelector, useDispatch} from 'react-redux';

import {
  EmailVerification,
  retrieveToken,
  signout,
  TokenNotFound,
  SetUserLocation,
  AutoSetLocation,
  clearAlertMessage,
} from './store/action/auth';
import colors from './colors/colors';
import {IP_ADDRESS, getAccessToken} from './global';
import PushNotification from 'react-native-push-notification';
import notifee, {AuthorizationStatus} from '@notifee/react-native';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

Feather.loadFont();
fontAwesome.loadFont();
IonIcon.loadFont();
MaterialCommunity.loadFont();

export default function App(props) {
  const state = useSelector(state => state.UserReducer);
  const dispatch = useDispatch();

  const onDisplayNotification = async (title, message) => {
    // Create a channel
    // const channelId = await notifee.createChannel({
    //   id: 'tastie-channel',
    //   name: 'Tastie Channel',
    // });

    await notifee.cancelAllNotifications();

    // Display a notification
    await notifee.displayNotification({
      title: title,
      body: message,
      ios: {
        foregroundPresentationOptions: {
          alert: true,
          badge: true,
          sound: true,
        },
      },
    });
  };

  // Get user profile for each time the app is rendered
  useEffect(() => {
    setTimeout(async () => {
      let refreshToken = await AsyncStorage.getItem('user_token');

      // console.log('refresh token', refreshToken);
      if (refreshToken !== null) {
        let accessToken = await getAccessToken(refreshToken);
        // console.log('access token', accessToken);
        dispatch(retrieveToken(accessToken));
      } else {
        console.log('token not found');
        dispatch(TokenNotFound());
      }

      if (state.socketServer.rooms.length > 0) {
        console.log('rooms: ', state.socketServer.rooms);
        state.socketServer.rooms.forEach(room => {
          state.socketServer.host.on('join-room', room);
        });
      }
    }, 100);
  }, []);

  if (state.isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.red} />
      </View>
    );
  } else {
    return (
      // For android gesture handling
      <GestureHandlerRootView style={{flex: 1}}>
        <NavigationContainer>
          <ActionAlertDialog
            visible={state.triggerAlertMessage}
            message={state.alertMessage ?? ''}
            onCancel={() => dispatch(clearAlertMessage())}
          />
          {state.user_token !== null ? (
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
                name="DetailFood"
                component={DetailFood}
                options={{headerShown: false}}
              />
              {/* <Stack.Screen name="Cart" component={Cart} /> */}
              <Stack.Screen name="Account" component={Account} options={{headerShown: false}} />
              <Stack.Screen
                name="DetailAccount"
                component={DetailAccount}
                options={{
                  // headerTitle: 'Profile',
                  // headerStyle: {backgroundColor: 'white'},
                  headerShown: false,
                }}
              />
              <Stack.Screen name="Chat" component={Chat} options={{headerShown: false}} />
              <Stack.Screen
                name="OrderStatus"
                component={OrderStatus}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="GoToCheckout"
                component={GoToCheckout}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="OrderHistory"
                component={OrderHistory}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="YourFavorites"
                component={YourFavorites}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="DetailOrder"
                component={DetailOrder}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="RatingProvider"
                component={RatingProvider}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="RatingShipper"
                component={RatingShipper}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="ProductOptions"
                component={ProductOptions}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="PromotionList"
                component={PromotionsList}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="ResultContent"
                component={ResultContent}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="CustomerAddress"
                component={CustomerAddress}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="CustomerAddressForm"
                component={CustomerAddressForm}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="ChatScreen"
                component={ChatScreen}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="DetailEcoupon"
                component={DetailEcoupon}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="EditCustomerAddress"
                component={EditCustomerAddress}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="OrderHistoryTab"
                component={OrderHistoryTab}
                options={{headerShown: false}}
              />
              <Stack.Screen name="MapScreen" component={MapScreen} options={{headerShown: false}} />
              <Stack.Screen name="Review" component={Review} options={{headerShown: false}} />
            </Stack.Navigator>
          ) : (
            <Stack.Navigator initialRouteName="Begin">
              <Stack.Screen
                name="Begin"
                component={Begin}
                options={{headerShown: false, animationTypeForReplace: 'pop'}}
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
              <Stack.Screen name="ResetPasswordDone" component={ResetPasswordDone} />
            </Stack.Navigator>
          )}
        </NavigationContainer>
      </GestureHandlerRootView>
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
