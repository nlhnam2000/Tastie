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
  Switch,
  TouchableWithoutFeedback,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import colors from '../../../colors/colors';
import {categoryData} from '../../../assets/dummy/categoryData';
import {popularData} from '../../../assets/dummy/popularData';
import {useDispatch, useSelector} from 'react-redux';
import {SetUserLocation} from '../../../store/action/auth';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import {BrowseCategory} from '../../../components/Menu/BrowseCatergory';

const {width} = Dimensions.get('window');

export const HomeContent = props => {
  const headerTab = ['Delivery', 'Pickup'];
  const [selectedTab, setSelectedTab] = useState(headerTab[0]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [animateModal, setAnimateModal] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedSort, setSelectedSort] = useState('Picked for you');
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);
  const [enableSwitches, setEnableSwitches] = useState({
    deals: false,
    mostorder: false,
  });
  const [filterToogled, setFilterToogled] = useState({
    sort: true,
    justforyou: true,
    pricerange: true,
    dietary: true,
  });

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
        <View style={[styles.content, {backgroundColor: showFilter ? 'rgba(0,0,0,0.4)' : 'white'}]}>
          <StatusBar barStyle="dark-content" />
          <View style={styles.headerWrapper}>
            <View style={[styles.tabWrapper, {}]}>
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
            <View style={[styles.tabWrapper, {marginTop: -15, position: 'relative'}]}>
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
                <Text numberOfLines={1} style={{fontWeight: '400', fontSize: 18, width: '90%'}}>
                  {state.userLocation.address || 'Select'}
                </Text>
                <Feather name="chevron-down" size={20} color={'black'} />
              </TouchableOpacity>
              <TouchableOpacity
                style={{position: 'absolute', left: '100%'}}
                onPress={() => setShowFilter(true)}>
                <Feather name="filter" size={20} color="black" />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView>
            {/* <View
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
            </View> */}

            {/* <View style={styles.categoryWrapper}>
              <FlatList
                data={categoryData}
                renderItem={renderCategoryList}
                keyExtractor={item => item.id}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
              />
            </View> */}
            <View style={{width}}>
              <BrowseCategory />
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
        <Modal animationType="slide" transparent visible={showFilter}>
          <View style={styles.modalContainer}>
            <View style={styles.modalView}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  marginBottom: 10,
                  position: 'relative',
                  marginTop: 10,
                }}>
                <TouchableOpacity
                  style={{position: 'absolute', left: '2%', top: '2%'}}
                  onPress={() => setShowFilter(false)}>
                  <Feather name="x" size={20} color={'black'} />
                </TouchableOpacity>
                <Text style={{fontSize: 17, fontWeight: '500'}}>All stores</Text>
              </View>
              <View
                style={{
                  width: '100%',
                  paddingHorizontal: 20,
                  justifyContent: 'space-between',
                  height: '90%',
                }}>
                <ScrollView style={{width: '100%', height: '90%'}}>
                  <View style={styles.flexRowBetween}>
                    <Text style={{fontSize: 17, fontWeight: '600'}}>Sort</Text>
                    <TouchableOpacity
                      onPress={() =>
                        setFilterToogled(prev => ({
                          ...prev,
                          sort: !prev.sort,
                        }))
                      }>
                      <Feather
                        name={filterToogled.sort ? 'chevron-up' : 'chevron-down'}
                        size={20}
                        color="black"
                      />
                    </TouchableOpacity>
                  </View>
                  {filterToogled.sort && (
                    <View style={{marginBottom: 20}}>
                      {['Picked for you', 'Most popular', 'Rating', 'Delivery time'].map(
                        (item, index) => (
                          <View
                            style={{flexDirection: 'row', alignItems: 'center', marginTop: 10}}
                            key={index}>
                            <TouchableOpacity
                              onPress={() => setSelectedSort(item)}
                              style={{
                                width: 25,
                                height: 25,
                                borderWidth: 2,
                                borderColor: colors.secondary,
                                marginRight: 10,
                                borderRadius: 40,
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}>
                              <View
                                style={{
                                  padding: 7,
                                  backgroundColor: selectedSort === item ? 'black' : 'white',
                                  borderRadius: 30,
                                }}></View>
                            </TouchableOpacity>
                            <Text>{item}</Text>
                          </View>
                        ),
                      )}
                    </View>
                  )}
                  <View style={styles.flexRowBetween}>
                    <Text style={{fontSize: 17, fontWeight: '600'}}>Just for you</Text>
                    <TouchableOpacity
                      onPress={() =>
                        setFilterToogled(prev => ({
                          ...prev,
                          justforyou: !prev.justforyou,
                        }))
                      }>
                      <Feather
                        name={filterToogled.justforyou ? 'chevron-up' : 'chevron-down'}
                        size={20}
                        color="black"
                      />
                    </TouchableOpacity>
                  </View>
                  {filterToogled.justforyou && (
                    <View style={{marginBottom: 20}}>
                      <View style={styles.flexRowBetween}>
                        <Text>Deals</Text>
                        <Switch
                          trackColor={{false: 'red', true: 'black'}}
                          onValueChange={() =>
                            setEnableSwitches(prev => ({
                              ...prev,
                              deals: !prev.deals,
                            }))
                          }
                          value={enableSwitches.deals}
                        />
                      </View>
                      <View style={styles.flexRowBetween}>
                        <Text>Most order</Text>
                        <Switch
                          trackColor={{false: 'red', true: 'black'}}
                          onValueChange={() =>
                            setEnableSwitches(prev => ({
                              ...prev,
                              mostorder: !prev.mostorder,
                            }))
                          }
                          value={enableSwitches.mostorder}
                        />
                      </View>
                    </View>
                  )}
                  <View style={styles.flexRowBetween}>
                    <Text style={{fontSize: 17, fontWeight: '600'}}>Price range</Text>
                    <TouchableOpacity
                      onPress={() =>
                        setFilterToogled(prev => ({
                          ...prev,
                          pricerange: !prev.pricerange,
                        }))
                      }>
                      <Feather
                        name={filterToogled.pricerange ? 'chevron-up' : 'chevron-down'}
                        size={20}
                        color="black"
                      />
                    </TouchableOpacity>
                  </View>
                  {filterToogled.pricerange && (
                    <View
                      style={{
                        width: '90%',
                        marginBottom: 20,
                        position: 'relative',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                      }}>
                      <View
                        style={{
                          width: '100%',
                          height: 1,
                          backgroundColor: 'black',
                          marginTop: 40,
                          zIndex: -1,
                          marginBottom: 20,
                        }}></View>
                      {['Free', '$', '$$', '$$$', '$$$$'].map((item, index) => (
                        <View
                          key={index}
                          style={{
                            position: 'absolute',
                            top: 25,
                            alignItems: 'center',
                            left: 23 * index + '%',
                          }}>
                          <TouchableOpacity
                            onPress={() => setSelectedPriceRange(item)}
                            style={{
                              width: 30,
                              height: 30,
                              borderWidth: 2,
                              borderColor: colors.secondary,
                              borderRadius: 40,
                              alignItems: 'center',
                              justifyContent: 'center',
                              zIndex: 1,
                              backgroundColor: 'white',
                              marginBottom: 5,
                            }}>
                            <View
                              style={{
                                padding: 10,
                                borderRadius: 40,
                                backgroundColor: selectedPriceRange === item ? 'black' : 'white',
                              }}></View>
                          </TouchableOpacity>
                          <Text>{item}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                  <View style={styles.flexRowBetween}>
                    <Text style={{fontSize: 17, fontWeight: '600'}}>Dietary</Text>
                    <TouchableOpacity
                      onPress={() =>
                        setFilterToogled(prev => ({
                          ...prev,
                          dietary: !prev.dietary,
                        }))
                      }>
                      <Feather
                        name={filterToogled.dietary ? 'chevron-up' : 'chevron-down'}
                        size={20}
                        color="black"
                      />
                    </TouchableOpacity>
                  </View>
                  {filterToogled.dietary && (
                    <View
                      style={{
                        marginTop: 10,
                        flexDirection: 'row',
                        alignItems: 'center',
                        flexBasis: '20%',
                        flexWrap: 'wrap',
                        width: '100%',
                      }}>
                      {[
                        'Vegetarian',
                        'Vegan',
                        'Gluten-free',
                        'Good for health',
                        'Alergy-friendly',
                      ].map((item, index) => (
                        <TouchableOpacity
                          key={index}
                          style={{
                            padding: 10,
                            borderRadius: 15,
                            backgroundColor: 'rgba(230,230,230,0.8)',
                            marginRight: 10,
                            marginBottom: 10,
                          }}>
                          <Text>{item}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </ScrollView>
                <TouchableOpacity style={{padding: 15, backgroundColor: 'black', width: '100%'}}>
                  <Text
                    style={{textAlign: 'center', color: 'white', fontSize: 17, fontWeight: 'bold'}}>
                    Apply
                  </Text>
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
    fontSize: 16,
  },
  labelTabButtonClicked: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'white',
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f2f2f2',
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
  flexRowBetween: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
});
