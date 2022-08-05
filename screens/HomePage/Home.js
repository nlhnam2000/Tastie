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
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';

import {NavigationBar} from '../../components/Menu/NavigationBar';
import {HomeContent} from './HomeContent/HomeContent';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

export const Home = props => {
  const dispatch = useDispatch();
  const state = useSelector(state => state.UserReducer);

  const renderCategoryList = ({item}) => {
    return (
      <View style={styles.categoryItem}>
        <Image style={styles.categoryImage} source={item.image} resizeMode="contain" />
        <Text style={styles.categoryTitle}>{item.title}</Text>
      </View>
    );
  };

  return (
    <>
      {/* <Stack.Navigator initialRouteName="HomeContent">
        <Stack.Screen
          name="HomeContent"
          component={HomeContent}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="DetailProvider"
          component={DetailProvider}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="DetailOrder"
          component={DetailOrder}
          options={{headerShown: false}}
        />
      </Stack.Navigator> */}
      <HomeContent {...props} />
      {state.toggleNavigationBar ? <NavigationBar {...props} active={props.tabname} /> : null}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    flex: 1,
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    flex: 1,
  },
  headerWrapper: {
    backgroundColor: '#fff',
    marginTop: 40,
    paddingHorizontal: 20,
  },
  tabWrapper: {
    flexDirection: 'row',
    width: Dimensions.get('screen').width,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  tabButton: {
    // backgroundColor: '#000',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginLeft: 10,
  },
  labelTabButton: {
    // color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },

  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#e6e6e6',
    width: '90%',
    paddingVertical: 15,
    paddingHorizontal: 8,
    borderRadius: 25,
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 25,
  },
  categoryWrapper: {
    backgroundColor: 'white',
    height: 100,
    marginTop: 20,
    width: '100%',
  },
  categoryItem: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryImage: {
    width: 80,
    height: 80,
  },
  categoryTitle: {
    fontWeight: 'bold',
  },
  contentWrapper: {
    backgroundColor: '#e6e6e6',
    marginTop: 20,
  },
  popularDataWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  popularImage: {
    height: 200,
    width: Dimensions.get('screen').width,
  },
  popularDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: Dimensions.get('screen').width,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'white',
  },
  popularInfo: {
    flexDirection: 'column',
  },
  popularRating: {
    padding: 10,
    borderRadius: 40,
    backgroundColor: '#e6e6e6',
  },
});
