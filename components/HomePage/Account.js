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
import {NavigationBar} from '../Menu/NavigationBar';
import {useDispatch} from 'react-redux';

export const Account = props => {
  const dispatch = useDispatch();
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.content}>
        <Text>Account</Text>
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
