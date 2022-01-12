import React, {useEffect} from 'react';
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
import {NavigationBar} from '../Menu/NavigationBar';
import {useDispatch, useSelector} from 'react-redux';
import {signout, retrieveToken, TokenNotFound} from '../../store/action/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AccountMenu} from '../../assets/dummy/AccountMenu';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons';

const {width, height} = Dimensions.get('window');

export const Account = props => {
  const dispatch = useDispatch();
  const state = useSelector(state => state.UserReducer);

  // useEffect(() => {
  //   setTimeout(async () => {
  //     let user_token = await AsyncStorage.getItem('user_token');
  //     if (user_token !== null) {
  //       dispatch(retrieveToken(user_token));
  //     } else {
  //       dispatch(TokenNotFound());
  //     }
  //   }, 1000);
  // }, []);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.content}>
        <View style={styles.headerWrapper}>
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
        </View>
        <ScrollView>
          <View style={{width, paddingHorizontal: 20, marginTop: 15}}>
            <TouchableOpacity style={styles.menuWrapper}>
              <MaterialCommunity name="bookmark" size={26} />
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
              <MaterialCommunity name="shield-half-full" size={26} />
              <Text
                style={{
                  fontWeight: '500',
                  marginLeft: 15,
                  fontSize: 16,
                  textTransform: 'capitalize',
                }}>
                COVID-19 Safety Center
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuWrapper}>
              <MaterialCommunity name="heart" size={26} />
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
              <MaterialCommunity name="star-circle" size={26} />
              <Text
                style={{
                  fontWeight: '500',
                  marginLeft: 15,
                  fontSize: 16,
                  textTransform: 'capitalize',
                }}>
                Restaurant Reward
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuWrapper}>
              <MaterialCommunity name="wallet" size={26} />
              <Text
                style={{
                  fontWeight: '500',
                  marginLeft: 15,
                  fontSize: 16,
                  textTransform: 'capitalize',
                }}>
                wallet
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuWrapper}>
              <MaterialCommunity name="gift" size={26} />
              <Text
                style={{
                  fontWeight: '500',
                  marginLeft: 15,
                  fontSize: 16,
                  textTransform: 'capitalize',
                }}>
                Send a gift
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuWrapper}>
              <MaterialCommunity name="briefcase" size={26} />
              <Text
                style={{
                  fontWeight: '500',
                  marginLeft: 15,
                  fontSize: 16,
                  textTransform: 'capitalize',
                }}>
                Business Preferences
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuWrapper}>
              <MaterialCommunity name="help-circle" size={26} />
              <Text
                style={{
                  fontWeight: '500',
                  marginLeft: 15,
                  fontSize: 16,
                  textTransform: 'capitalize',
                }}>
                Help
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuWrapper}>
              <MaterialCommunity name="ticket-percent" size={26} />
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
            <TouchableOpacity style={styles.menuWrapper}>
              <MaterialCommunity name="cog" size={26} />
              <Text
                style={{
                  fontWeight: '500',
                  marginLeft: 15,
                  fontSize: 16,
                  textTransform: 'capitalize',
                }}>
                Setting
              </Text>
            </TouchableOpacity>
            <Button
              title="logout"
              onPress={() => {
                dispatch(signout());
              }}
            />
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
