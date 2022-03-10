import React, {useState, useEffect} from 'react';
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
  Platform,
  ActivityIndicator,
  Modal,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import colors from '../../../colors/colors';
import {categoryData} from '../../../assets/dummy/categoryData';
import {popularData} from '../../../assets/dummy/popularData';
import {useDispatch, useSelector} from 'react-redux';
import {SetUserLocation} from '../../../store/action/auth';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';

const {width} = Dimensions.get('window');

export const HomeContent = props => {
  const headerTab = ['Delivery', 'Pickup'];
  const [selectedTab, setSelectedTab] = useState(headerTab[0]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  const dispatch = useDispatch();
  const state = useSelector(state => state.UserReducer);
  const [markerLocation, setMarkerLocation] = useState({
    latitude: state.userLocation.latitude || null,
    longitude: state.userLocation.longitude || null,
  });
  const [address, setAddress] = useState(state.userLocation.address || '');

  const renderCategoryList = ({item}) => {
    return (
      <View style={styles.categoryItem}>
        <Image style={styles.categoryImage} source={item.image} resizeMode="contain" />
        <Text style={styles.categoryTitle}>{item.title}</Text>
      </View>
    );
  };

  const handleScroll = event => {
    console.log(event.nativeEvent.contentOffset);
  };

  const submitLocation = () => {
    let data = {
      latitude: markerLocation.latitude,
      longitude: markerLocation.longitude,
      address,
    };
    dispatch(SetUserLocation(data));
    setOpenModal(false);
  };

  useEffect(() => {
    setLoading(false);
    console.log(state.userLocation);
  }, []);

  if (loading) {
    return (
      <View style={styles.content}>
        <StatusBar barStyle="dark-content" />
        <ActivityIndicator size={'large'} color={colors.red} />
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <StatusBar barStyle="dark-content" />
          <View style={styles.headerWrapper}>
            <View style={styles.tabWrapper}>
              {headerTab.map((tab, index) => {
                return (
                  <TouchableOpacity
                    onPress={() => setSelectedTab(tab)}
                    // onPress={() => dispatch(signout())}
                    style={tab === selectedTab ? styles.tabButtonClicked : styles.tabButton}
                    key={index}>
                    <Text
                      style={
                        tab === selectedTab ? styles.labelTabButtonClicked : styles.labelTabButton
                      }>
                      {tab}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <View style={[styles.tabWrapper, {marginTop: -15}]}>
              <Text style={{fontSize: 18, fontWeight: '500'}}>Delivery to • </Text>
              <TouchableOpacity
                onPress={() => setOpenModal(true)}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '50%',
                  marginLeft: 5,
                }}>
                <Text numberOfLines={1} style={{fontWeight: '400', fontSize: 18}}>
                  {state.userLocation.address || 'Select'}
                </Text>
                <Feather name="chevron-down" size={20} color={'black'} />
              </TouchableOpacity>
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
                  <Feather name="search" size={20} color={'black'} />
                  <TextInput
                    placeholder="Search"
                    style={{marginLeft: 10}}
                    maxLength={25}
                    clearButtonMode="always"
                  />
                </View>
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
                    onPress={() => props.navigation.navigate('DetailProvider', {data: item})}>
                    <View style={styles.popularDataWrapper}>
                      <ImageBackground
                        style={styles.popularImage}
                        resizeMode="cover"
                        source={item.image}
                      />
                      <View style={styles.popularDetail}>
                        <View style={styles.popularInfo}>
                          <Text style={{fontWeight: 'bold', color: 'black'}}>{item.title}</Text>
                          <Text>{item.deliveryTime}</Text>
                        </View>
                        <View style={styles.popularRating}>
                          <Text style={{color: 'black'}}>{item.rating}</Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </View>
        <Modal animationType="slide" transparent={true} visible={openModal}>
          <View style={styles.modalContainer}>
            <View style={styles.modalView}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                  marginBottom: 10,
                }}>
                <TouchableOpacity style={styles.modalHeader} onPress={() => setOpenModal(false)}>
                  <Feather name="x" size={20} color={'black'} />
                </TouchableOpacity>
                <Text style={{fontSize: 18, fontWeight: 'bold'}}>Select your location</Text>
                <View style={{paddingHorizontal: 10}}></View>
              </View>
              <MapView
                initialRegion={{
                  latitude: state.userLocation.latitude || 12.203214000000004,
                  longitude: state.userLocation.longitude || 109.19345021534353,
                  latitudeDelta: 0.015,
                  longitudeDelta: 0.0121,
                }}
                onPress={event =>
                  setMarkerLocation({
                    latitude: event.nativeEvent.coordinate.latitude,
                    longitude: event.nativeEvent.coordinate.longitude,
                    latitudeDelta: 0.015,
                    longitudeDelta: 0.0121,
                  })
                }
                showsUserLocation
                showsMyLocationButton
                minZoomLevel={17}
                provider={PROVIDER_GOOGLE}
                style={styles.map}>
                {markerLocation.latitude && markerLocation.longitude ? (
                  <Marker coordinate={markerLocation} />
                ) : null}
              </MapView>

              <View style={styles.providerName}>
                <Text style={{fontSize: 20, fontWeight: 'bold'}}>Enter your address</Text>
              </View>
              <View style={styles.sectionWrapper}>
                <View>
                  <Feather name="map-pin" size={22} color={'black'} />
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    paddingHorizontal: 15,
                  }}>
                  <TextInput
                    style={{
                      width: '100%',
                      paddingVertical: 15,
                      borderBottomWidth: 1,
                    }}
                    onChangeText={text => setAddress(text)}
                    value={address}
                  />
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  width: '100%',
                  marginTop: 15,
                  paddingHorizontal: 20,
                }}>
                <TouchableOpacity
                  onPress={() => submitLocation()}
                  style={{padding: 10, backgroundColor: 'black', borderRadius: 5}}>
                  <Text style={{fontWeight: '500', color: 'white'}}>Done</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
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
    marginTop: Platform.OS === 'ios' ? 40 : 0,
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
    color: 'black',
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
    paddingVertical: Platform.OS === 'ios' ? 10 : 0,
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
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    // backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalView: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderWidth: 1,
    borderColor: colors.secondary,
    width,
    height: '90%',
    overflow: 'hidden',
  },
  map: {
    width: '100%',
    height: 200,
  },
  modalHeader: {
    padding: 10,
  },
  providerName: {
    padding: 15,
    width: '100%',
  },
  sectionWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 15,
  },
});
