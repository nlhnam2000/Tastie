import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Image,
} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {ActivityIndicator} from 'react-native-paper';
import {NavigationBar} from '../../components/Menu/NavigationBar';
import {useDispatch, useSelector} from 'react-redux';
import {signout, retrieveToken, TokenNotFound} from '../../store/action/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AccountMenu} from '../../assets/dummy/AccountMenu';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import {IP_ADDRESS, getAccessToken} from '../../global';
import axios from 'axios';
import colors from '../../colors/colors';

const {width, height} = Dimensions.get('window');

export const Account = props => {
  const dispatch = useDispatch();
  const state = useSelector(state => state.UserReducer);
  const [loading, setLoading] = useState(true);
  const [avatar, setAvatar] = useState(state.avatar);

  useEffect(() => {
    setTimeout(async () => {
      let refreshToken = await AsyncStorage.getItem('user_token');
      let accessToken = await getAccessToken(refreshToken);
      dispatch(retrieveToken(accessToken));
      // if (state.userCart.cart.length > 0) {
      //   state.userCart.cart.additionalOptions.forEach(c => {
      //     console.log(c);
      //   });
      // }
      // console.log(state.userCart.cart[0].additionalOptions);
      setLoading(false);
    }, 200);

    const getUserAvatar = async () => {
      let cachedAavatar = await AsyncStorage.getItem('@userAvatar');
      if (cachedAavatar) {
        console.log('Cached available');
        setAvatar(cachedAavatar);
        setLoading(false);
      } else {
        console.log('There is no cached image');
        try {
          const res = await axios.get(
            `http://${IP_ADDRESS}:3777/upload/image-user/${state.user_id}`,
          );
          if (res.data.status && res.data.response.length > 0) {
            setAvatar(`data:image/png;base64,${res.data.response.at(-1).url_str}`);

            // await AsyncStorage.setItem(
            //   '@userAvatar',
            //   `data:image/png;base64,${res.data.response.at(-1).url_str}`,
            // );
          }
        } catch (error) {
          console.error('cannot get user image', error);
        } finally {
          setLoading(false);
        }
      }
    };

    const getUserAvatarCloudinary = async () => {
      try {
        const res = await axios.get(
          `http://${'localhost'}:3777/upload/image-user-cloudinary/${state.user_id}`,
        );
        if (res.data.url) {
          setAvatar(res.data.url);
        }
      } catch (error) {
        console.log('cannot get user image', error);
      } finally {
        setLoading(false);
      }
    };
    // getUserAvatarCloudinary();

    // setLoading(false);
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.container}>
          <ActivityIndicator size={'small'} color={colors.boldred} />
        </View>
        <NavigationBar active={props.tabname} {...props} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.content}>
        <StatusBar barStyle="dark-content" />
        <TouchableOpacity
          style={styles.headerWrapper}
          onPress={() => props.navigation.navigate('DetailAccount')}>
          {/* <Image
            source={require('../../assets/image/anonymous.png')}
            style={styles.avatar}
          /> */}
          {state.avatar ? (
            <Image
              source={{uri: state.avatar}}
              style={{width: 30, height: 30, borderRadius: 40, marginRight: 15}}
            />
          ) : (
            <MaterialCommunity
              name="account-circle"
              size={30}
              color={'gray'}
              style={{marginRight: 15}}
            />
          )}

          <Text style={{fontWeight: '500', fontSize: 17}}>
            {state.first_name} {state.last_name}
          </Text>
        </TouchableOpacity>
        <ScrollView>
          <View style={{width, paddingHorizontal: 20, marginTop: 15}}>
            <TouchableOpacity
              style={styles.menuWrapper}
              // onPress={() => props.navigation.navigate('DetailOrder')}
              onPress={() => props.navigation.navigate('OrderHistoryTab')}>
              <MaterialCommunity name="bookmark" size={26} color={'black'} />
              <Text
                style={{
                  fontWeight: '500',
                  marginLeft: 15,
                  fontSize: 16,
                  textTransform: 'capitalize',
                }}>
                Orders
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuWrapper}
              onPress={() =>
                props.navigation.navigate('ResultContent', {
                  isFavorite: true,
                  title: 'Your favorite',
                })
              }>
              <MaterialCommunity color={'black'} name="heart" size={26} />
              <Text
                style={{
                  fontWeight: '500',
                  marginLeft: 15,
                  fontSize: 16,
                  textTransform: 'capitalize',
                }}>
                Your favorites
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuWrapper}
              onPress={() => props.navigation.navigate('CustomerAddress')}>
              <MaterialCommunity color={'black'} name="home-account" size={26} />
              <Text
                style={{
                  fontWeight: '500',
                  marginLeft: 15,
                  fontSize: 16,
                  textTransform: 'capitalize',
                }}>
                Your address
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuWrapper}
              onPress={() =>
                props.navigation.navigate('ResultContent', {
                  groupID: 2,
                  title: 'Today offer',
                })
              }>
              <MaterialCommunity color={'black'} name="ticket-percent" size={26} />
              <Text
                style={{
                  fontWeight: '500',
                  marginLeft: 15,
                  fontSize: 16,
                  textTransform: 'capitalize',
                }}>
                Promotions
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuWrapper}
              onPress={() => props.navigation.navigate('TestScreen')}>
              <MaterialCommunity color={'black'} name="ticket-percent" size={26} />
              <Text
                style={{
                  fontWeight: '500',
                  marginLeft: 15,
                  fontSize: 16,
                  textTransform: 'capitalize',
                }}>
                Test Screen
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>

      <NavigationBar active={props.tabname} {...props} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  headerWrapper: {
    width,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(230, 230, 230, 0.8)',
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 100,
    marginRight: 10,
  },
  menuWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 20,
  },
});
