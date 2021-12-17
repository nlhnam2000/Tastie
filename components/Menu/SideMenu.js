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
} from 'react-native';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import {useDispatch, useSelector} from 'react-redux';
import {signout} from '../../store/action/auth';

export const SideMenu = props => {
  const dispatch = useDispatch();
  const state = useSelector(state => state.UserReducer);
  useEffect(() => {
    console.log(state);
  }, [1000]);
  return (
    <SafeAreaView style={styles.container}>
      <Text>{state.first_name}</Text>
      <View style={styles.logoutBtn}>
        <Button title="Logout" onPress={() => dispatch(signout())} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  logoutBtn: {
    paddingHorizontal: 20,
  },
});
