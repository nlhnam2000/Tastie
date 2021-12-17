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
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {NavigationContainer} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {signout} from '../../store/action/auth';
import Feather from 'react-native-vector-icons/Feather';
import colors from '../../colors/colors';
import {categoryData} from '../../assets/dummy/categoryData';
import {popularData} from '../../assets/dummy/popularData';

const Drawer = createDrawerNavigator();

export const HomePage = () => {
  const dispatch = useDispatch();

  const renderCategoryList = ({item}) => {
    return (
      <View style={styles.categoryItem}>
        <Image
          style={styles.categoryImage}
          source={item.image}
          resizeMode="contain"
        />
        <Text style={styles.categoryTitle}>{item.title}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerWrapper}>
        <View style={styles.tabWrapper}>
          <TouchableOpacity style={styles.tabButton}>
            <Text style={styles.labelTabButton}>Delivery</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabButton}>
            <Text style={styles.labelTabButton}>Pickup</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          <View style={styles.searchWrapper}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Feather name="map-pin" size={22} />
              <TextInput
                placeholder="Search"
                style={{marginLeft: 5}}
                maxLength={25}
              />
            </View>
            <TouchableOpacity style={styles.searchButton}>
              <Feather name="clock" size={20} style={{marginRight: 5}} />
              <Text>Search</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.categoryWrapper}>
        <FlatList
          data={categoryData}
          renderItem={renderCategoryList}
          keyExtractor={item => item.id}
          horizontal={true}
        />
      </View>
      <ScrollView style={styles.contentWrapper}>
        {popularData.map((item, index) => {
          return (
            <TouchableOpacity key={index}>
              <View style={styles.popularDataWrapper}>
                <ImageBackground
                  style={styles.popularImage}
                  resizeMode="cover"
                  source={item.image}
                />
                <View style={styles.popularDetail}>
                  <View style={styles.popularInfo}>
                    <Text style={{fontWeight: 'bold'}}>{item.title}</Text>
                    <Text>{item.deliveryTime}</Text>
                  </View>
                  <View style={styles.popularRating}>
                    <Text>{item.rating}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
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
