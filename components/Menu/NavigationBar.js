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
  TouchableOpacity,
  TextInput,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
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

// FontAwesome5.loadFont();

export const NavigationBar = props => {
  const dispatch = useDispatch();
  const cart = useSelector(state => state.UserReducer.userCart.cart);
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.iconWrapper} onPress={() => dispatch(NavigateToHome())}>
        {(props.active === 'Home' && <Feather name="home" size={25} color={'red'} />) || (
          <Feather name="home" size={25} color="black" />
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
        {(props.active === 'Browse' && <Feather name="search" size={25} color={'red'} />) || (
          <Feather name="search" size={25} color="black" />
        )}
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
        {(props.active === 'Notification' && <Feather name="mail" size={25} color={'red'} />) || (
          <Feather name="mail" size={25} color="black" />
        )}
        <Text
          style={
            props.active === 'Notification'
              ? {fontWeight: 'bold', color: 'red', marginTop: 5}
              : styles.label
          }>
          Notification
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconWrapper} onPress={() => dispatch(NavigateToCart())}>
        {(props.active === 'Cart' && <Feather name="shopping-bag" size={25} color={'red'} />) || (
          <Feather name="shopping-bag" size={25} color="black" />
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
        {(props.active === 'Account' && <Feather name="user" size={25} color={'red'} />) || (
          <Feather name="user" size={25} color="black" />
        )}
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
