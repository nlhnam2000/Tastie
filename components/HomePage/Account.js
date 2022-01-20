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
  ActivityIndicator,
} from 'react-native';
import {NavigationBar} from '../Menu/NavigationBar';
import {useDispatch, useSelector} from 'react-redux';
import {signout, retrieveToken, TokenNotFound} from '../../store/action/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AccountMenu} from '../../assets/dummy/AccountMenu';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import {IP_ADDRESS, getAccessToken} from '../../global';

const {width, height} = Dimensions.get('window');

export const Account = props => {
  const dispatch = useDispatch();
  const state = useSelector(state => state.UserReducer);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(async () => {
      let refreshToken = await AsyncStorage.getItem('user_token');
      let accessToken = await getAccessToken(refreshToken);
      dispatch(retrieveToken(accessToken));
      console.log(state);
      setLoading(false);
    }, 200);
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <ActivityIndicator size={'large'} color={'red'} />
        </View>
        <NavigationBar active={props.tabname} />
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
          <MaterialCommunity
            name="account-circle"
            size={30}
            color={'gray'}
            style={{marginRight: 15}}
          />
          <Text style={{fontWeight: '500', fontSize: 17}}>
            {state.first_name} {state.last_name}
          </Text>
        </TouchableOpacity>
        <ScrollView>
          <View style={{width, paddingHorizontal: 20, marginTop: 15}}>
            <TouchableOpacity style={styles.menuWrapper}>
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

            <TouchableOpacity style={styles.menuWrapper}>
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
            <TouchableOpacity style={styles.menuWrapper}>
              <MaterialCommunity
                color={'black'}
                name="home-account"
                size={26}
              />
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

            <TouchableOpacity style={styles.menuWrapper}>
              <MaterialCommunity
                color={'black'}
                name="ticket-percent"
                size={26}
              />
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
          </View>
        </ScrollView>
      </SafeAreaView>

      <NavigationBar active={props.tabname} />
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
