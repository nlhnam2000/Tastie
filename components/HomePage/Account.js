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
        <Button
          title="logout"
          onPress={() => {
            dispatch(signout());
            // props.navigation.navigate('Login');
          }}
        />
        <Button
          title="click here"
          // onPress={async () => {
          //   let token = await AsyncStorage.getItem('user_token');
          //   console.log(token);
          // }}
          onPress={() => console.log(state)}
        />
      </SafeAreaView>

      <NavigationBar active={props.tabname} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
});
