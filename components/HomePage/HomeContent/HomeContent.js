import React, {useState} from 'react';
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
  Animated,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import colors from '../../../colors/colors';
import {categoryData} from '../../../assets/dummy/categoryData';
import {popularData} from '../../../assets/dummy/popularData';
import {useDispatch, useSelector} from 'react-redux';

import {signout} from '../../../store/action/auth';

export const HomeContent = props => {
  const headerTab = ['Delivery', 'Pickup'];

  const [selectedTab, setSelectedTab] = useState(headerTab[0]);
  const dispatch = useDispatch();
  const state = useSelector(state => state.UserReducer);

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

  const handleScroll = event => {
    console.log(event.nativeEvent.contentOffset);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.headerWrapper}>
          <View style={styles.tabWrapper}>
            {headerTab.map((tab, index) => {
              return (
                <TouchableOpacity
                  onPress={() => setSelectedTab(tab)}
                  // onPress={() => dispatch(signout())}
                  style={
                    tab === selectedTab
                      ? styles.tabButtonClicked
                      : styles.tabButton
                  }
                  key={index}>
                  <Text
                    style={
                      tab === selectedTab
                        ? styles.labelTabButtonClicked
                        : styles.labelTabButton
                    }>
                    {tab}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <ScrollView>
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

          <View style={styles.categoryWrapper}>
            <FlatList
              data={categoryData}
              renderItem={renderCategoryList}
              keyExtractor={item => item.id}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            />
          </View>
          <View
            style={styles.contentWrapper}
            // onScroll={handleScroll}
            // scrollEventThrottle={16}
          >
            {popularData.map((item, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() =>
                    props.navigation.navigate('DetailProvider', {data: item})
                  }>
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
          </View>
        </ScrollView>
      </View>
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
    // justifyContent: 'center',
    // alignItems: 'center',
    // flex: 1,
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
  tabButtonClicked: {
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginLeft: 10,
    backgroundColor: 'black',
  },
  labelTabButton: {
    // color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  labelTabButtonClicked: {
    fontWeight: 'bold',
    fontSize: 18,
    color: 'white',
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
