import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
  TouchableOpacity,
  TextInput,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  Platform,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {useDispatch, useSelector} from 'react-redux';
import {
  NavigateToAccount,
  NavigateToHome,
  NavigateToBrowse,
  NavigateToCart,
  NavigateToNotification,
} from '../../store/action/navigation';
import colors from '../../colors/colors';
import {RetrieveCart} from '../../store/action/cart';
import {InitSocket, ToggleNotification, CheckedNotification} from '../../store/action/auth';
import PushNotification from 'react-native-push-notification';
import notifee from '@notifee/react-native';

export const NavigationBar = props => {
  const dispatch = useDispatch();
  const cart = useSelector(state => state.UserReducer.userCart.cart);
  const state = useSelector(state => state.UserReducer);
  const [newNoti, setNewNoti] = useState(false);

  async function onDisplayNotification(title, message) {
    // Create a channel
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });

    await notifee.cancelAllNotifications();

    // Display a notification
    await notifee.displayNotification({
      title: title,
      body: message,
      ios: {
        channelId,
      },
    });
  }

  useEffect(() => {
    console.log(state.userCart);
    dispatch(RetrieveCart(state.user_id));
    // dispatch(InitSocket());
    // setTimeout(() => {
    //   PushNotification.localNotification({
    //     channelId: 'homescreen-channel',
    //     title: 'Notification Testing',
    //     message: 'test123',
    //   });
    // }, 4000);
  }, []);

  useEffect(() => {
    if (state.socketServer.host) {
      state.socketServer.host.on('customer-receive-notification', number => {
        // dispatch(ToggleNotification());
        setNewNoti(true);
        console.log('customer received from admin');
      });

      if (state.socketServer.rooms.length > 0) {
        console.log('rooms: ', state.socketServer.rooms);
        state.socketServer.rooms.forEach(room => {
          state.socketServer.host.on('join-room', room);
        });

        state.socketServer.host.on('receive-shipper-inbox', async message => {
          console.log('shipper inbox: ', message);
          if (Platform.OS === 'android') {
            PushNotification.cancelAllLocalNotifications();
            PushNotification.localNotification({
              channelId: 'homescreen-channel',
              title: 'Message from shipper:',
              message: message,
            });
          } else {
            onDisplayNotification('Message from shipper', message);
          }
        });

        state.socketServer.host.on('shipper-on-the-way', message => {
          if (Platform.OS === 'android') {
            PushNotification.cancelAllLocalNotifications();
            PushNotification.localNotification({
              channelId: 'homescreen-channel',
              title: 'The shipper is on the way',
              message: message,
            });
          } else {
            onDisplayNotification('The shipper is on the way', message);
          }
        });

        state.socketServer.host.on('shipper-has-arrived', async message => {
          if (Platform.OS === 'android') {
            PushNotification.cancelAllLocalNotifications();
            PushNotification.localNotification({
              channelId: 'homescreen-channel',
              title: 'The shipper has arrived at your place',
              message: message,
            });
          } else {
            onDisplayNotification('Shipper has arrived !!!', message);
          }
        });
      }
    } else {
      dispatch(InitSocket());
    }
  }, [state.socketServer.host]);

  useEffect(() => {
    if (props.active === 'Notification') {
      // dispatch(CheckedNotification());
      setNewNoti(false);
    }
  }, [props.active]);

  // useEffect(() => {
  //   setNewNoti(state.toggleNotification);
  // }, [state.toggleNotification]);

  // useEffect(() => {
  //   // clear the badge when user navigate to Notification screen
  //   setNewNoti(state.currentTab !== 'Notification');
  // }, [state.currentTab]);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.iconWrapper} onPress={() => dispatch(NavigateToHome())}>
        {(props.active === 'Home' && <MaterialCommunity name="home" size={30} color={'red'} />) || (
          <MaterialCommunity name="home" size={30} color="black" />
        )}
        <Text
          style={
            props.active === 'Home'
              ? {fontWeight: 'bold', color: 'red', marginTop: 5}
              : styles.label
          }>
          Home
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconWrapper} onPress={() => dispatch(NavigateToBrowse())}>
        {(props.active === 'Browse' && (
          <MaterialCommunity name="magnify" size={30} color={'red'} />
        )) || <MaterialCommunity name="magnify" size={30} color="black" />}
        <Text
          style={
            props.active === 'Browse'
              ? {fontWeight: 'bold', color: 'red', marginTop: 5}
              : styles.label
          }>
          Browse
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.iconWrapper}
        onPress={() => dispatch(NavigateToNotification())}>
        {(props.active === 'Notification' && (
          <MaterialCommunity name="email" size={30} color={'red'} />
        )) || <MaterialCommunity name="email" size={30} color="black" />}
        <Text
          style={
            props.active === 'Notification'
              ? {fontWeight: 'bold', color: 'red', marginTop: 5}
              : styles.label
          }>
          Notification
        </Text>
        {newNoti ? (
          <View
            style={{
              position: 'absolute',
              padding: 5,
              borderRadius: 15,
              backgroundColor: 'red',
              left: '55%',
              top: 0,
              width: 15,
              height: 15,
              alignItems: 'center',
              justifyContent: 'center',
            }}></View>
        ) : null}
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconWrapper} onPress={() => dispatch(NavigateToCart())}>
        {(props.active === 'Cart' && <MaterialCommunity name="cart" size={30} color={'red'} />) || (
          <MaterialCommunity name="cart" size={30} color="black" />
        )}
        <Text
          style={
            props.active === 'Cart'
              ? {fontWeight: 'bold', color: 'red', marginTop: 5}
              : styles.label
          }>
          Cart
        </Text>
        {cart.length > 0 ? (
          <View
            style={{
              position: 'absolute',
              padding: 5,
              borderRadius: 15,
              backgroundColor: 'red',
              left: '55%',
              top: -5,
              width: 25,
              height: 25,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={{color: 'white', textAlign: 'center', fontWeight: '600'}}>
              {cart.length}
            </Text>
          </View>
        ) : null}
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconWrapper} onPress={() => dispatch(NavigateToAccount())}>
        {(props.active === 'Account' && (
          <MaterialCommunity name="account" size={30} color={'red'} />
        )) || <MaterialCommunity name="account" size={30} color="black" />}
        <Text
          style={
            props.active === 'Account'
              ? {fontWeight: 'bold', color: 'red', marginTop: 5}
              : styles.label
          }>
          Account
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    width: Dimensions.get('screen').width,
    paddingHorizontal: 30,
    paddingVertical: 20,
    backgroundColor: 'white',
    borderTopColor: 'rgb(230,230,230)',
    borderTopWidth: 1,
  },
  iconWrapper: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  label: {
    marginTop: 5,
    color: 'black',
  },
});
