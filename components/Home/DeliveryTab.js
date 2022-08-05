import React, {useState, useEffect, useRef} from 'react';
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
  Modal,
  Switch,
  TouchableWithoutFeedback,
  RefreshControl,
  TouchableHighlight,
} from 'react-native';

// components
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../../colors/colors';
import {BrowseCategory} from '../../components/Menu/BrowseCatergory';
import {CategoryList} from '../../components/Provider/CategoryList';
import {RecommendedProducts} from '../Menu/RecommendedProducts';

// reducer
import {SetUserLocation, AutoSetLocation, ToggleNavigationBar} from '../../store/action/auth';

// libraries
import {useDispatch, useSelector} from 'react-redux';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import {Modalize} from 'react-native-modalize';
import axios from 'axios';
import {ActivityIndicator} from 'react-native-paper';

const {width, height} = Dimensions.get('window');

export const DeliveryTab = props => {
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [animateModal, setAnimateModal] = useState(false);
  const [selectedSort, setSelectedSort] = useState('Order near you');
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
  const [selectedDietary, setSelectedDietary] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const dispatch = useDispatch();
  const state = useSelector(state => state.UserReducer);
  const [markerLocation, setMarkerLocation] = useState({
    latitude: state.userLocation.latitude ?? null,
    longitude: state.userLocation.longitude ?? null,
  });
  const [address, setAddress] = useState(state.userLocation.address ?? '');
  const filterModalize = useRef();
  const userLocationModalize = useRef();
  const [sortOption, setSortOption] = useState({
    groupID: 1,
    title: 'Order near you',
  });

  const openFilterModalize = () => {
    filterModalize.current?.open();
  };
  const openUserLocationModalize = () => {
    userLocationModalize.current?.open();
  };

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
    if (state.userLocation.address === null) {
      // auto set location
      dispatch(AutoSetLocation());
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    switch (selectedSort) {
      case 'Order near you':
        setSortOption(prev => ({
          ...prev,
          groupID: 1,
          title: selectedSort,
        }));
        break;
      case 'Most rating':
        setSortOption(prev => ({
          ...prev,
          groupID: 3,
          title: selectedSort,
        }));
        break;
      case 'In a rush':
        setSortOption(prev => ({
          ...prev,
          groupID: 4,
          title: selectedSort,
        }));
        break;
      case 'New on Tastie':
        setSortOption(prev => ({
          ...prev,
          groupID: 5,
          title: selectedSort,
        }));
        break;

      default:
        break;
    }
  }, [selectedSort]);

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
        <View style={[styles.content]}>
          <View style={styles.headerWrapper}>
            <View style={[styles.tabWrapper, {marginTop: -15, position: 'relative'}]}>
              <Text style={{fontSize: 18, fontWeight: '500'}}>Delivery to • </Text>
              <TouchableOpacity
                onPress={() => props.navigation.navigate('CustomerAddress')}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '50%',
                  marginLeft: 5,
                }}>
                <Text numberOfLines={1} style={{fontWeight: '400', fontSize: 18, width: '90%'}}>
                  {state.userLocation.address ?? 'Select'}
                </Text>
                <Feather name="chevron-down" size={20} color={'black'} />
              </TouchableOpacity>
              <TouchableOpacity
                style={{position: 'absolute', left: '100%'}}
                // onPress={() => setShowFilter(true)}
                onPress={() => openFilterModalize()}>
                <Feather name="filter" size={20} color="black" />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView
            style={{width}}
            contentContainerStyle={{backgroundColor: '#f2f2f2'}}
            // onScrollBeginDrag={() => dispatch(ToggleNavigationBar())}
            // onMomentumScrollEnd={() => dispatch(ToggleNavigationBar())}
            refreshControl={
              <RefreshControl
                tintColor={colors.boldred}
                refreshing={isRefreshing}
                onRefresh={() => {
                  setIsRefreshing(true);
                  setTimeout(() => {
                    if (state.userLocation.latitude === 0 && state.userLocation.longitude === 0) {
                      console.log('auto set location');
                      dispatch(AutoSetLocation());
                    }
                    setIsRefreshing(false);
                  }, 1000);
                }}
              />
            }>
            <View style={{width, backgroundColor: 'white'}}>
              <BrowseCategory {...props} />
            </View>
            <View style={{width}}>
              <RecommendedProducts {...props} />
            </View>
            <View style={{width}}>
              <View style={{width}}>
                <CategoryList
                  {...props}
                  groupID={1}
                  location={state.userLocation}
                  offset={1}
                  categoryTitle="Order near you"
                />
              </View>
              <View style={{width}}>
                <CategoryList
                  {...props}
                  groupID={2}
                  location={state.userLocation}
                  offset={1}
                  categoryTitle="Today offer"
                />
              </View>
              <View style={{width}}>
                <CategoryList
                  {...props}
                  groupID={3}
                  location={state.userLocation}
                  offset={1}
                  categoryTitle="Most rating"
                />
              </View>
              <View style={{width}}>
                <CategoryList
                  {...props}
                  groupID={4}
                  location={state.userLocation}
                  offset={1}
                  categoryTitle="In a rush"
                />
              </View>
              <View style={{width}}>
                <CategoryList
                  {...props}
                  groupID={5}
                  location={state.userLocation}
                  categoryTitle="New on Tastie"
                />
              </View>
              <View style={{width}}>
                <CategoryList
                  {...props}
                  groupID={6}
                  location={state.userLocation}
                  categoryTitle="Most popular"
                />
              </View>
            </View>
          </ScrollView>
        </View>
        <Modalize
          ref={userLocationModalize}
          modalHeight={Dimensions.get('window').height - 130}
          HeaderComponent={
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                marginBottom: 10,
                position: 'relative',
                paddingHorizontal: 20,
                paddingVertical: 10,
              }}>
              <TouchableOpacity
                style={[styles.modalHeader, {position: 'absolute', left: '5%'}]}
                onPress={() => userLocationModalize.current.close()}>
                <Feather name="x" size={20} color={'black'} />
              </TouchableOpacity>
              <Text style={{fontSize: 18, fontWeight: 'bold', textAlign: 'center'}}>
                Select your location
              </Text>
            </View>
          }>
          <View style={styles.modalContainer}>
            <MapView
              cacheEnabled
              initialRegion={{
                latitude:
                  state.userLocation.latitude === 0
                    ? 12.203214000000004
                    : state.userLocation.latitude,
                longitude:
                  state.userLocation.longitude === 0
                    ? 109.19345021534353
                    : state.userLocation.longitude,
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
              mapType="terrain"
              loadingEnabled
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
                onPress={() => {
                  submitLocation();
                  userLocationModalize.current.close();
                }}
                style={{padding: 10, backgroundColor: 'black', borderRadius: 5}}>
                <Text style={{fontWeight: '500', color: 'white'}}>Done</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.providerName}>
              <Text style={{fontSize: 15, fontWeight: '500'}}>Your recent address</Text>
            </View>
            <View style={{width, paddingHorizontal: 10}}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <MaterialCommunityIcon name="map-marker" size={30} color="black" />
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '88%',
                  }}>
                  <Text style={{fontWeight: '600', fontSize: 17}}>135B Tran Hung Dao</Text>
                  <TouchableOpacity
                    style={{
                      padding: 10,
                      borderRadius: 20,
                      backgroundColor: 'rgba(230,230,230,0.7)',
                    }}>
                    <Feather name="edit-2" size={17} color="black" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modalize>
        <Modalize
          ref={filterModalize}
          modalHeight={Dimensions.get('window').height - 115}
          HeaderComponent={
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
                style={{position: 'absolute', left: '8%', top: '2%'}}
                onPress={() => filterModalize.current.close()}>
                <Feather name="x" size={20} color={'black'} />
              </TouchableOpacity>
              <Text style={{fontSize: 17, fontWeight: '500'}}>All stores</Text>
            </View>
          }>
          <View
            style={{
              width: '100%',
              paddingHorizontal: 20,
              justifyContent: 'space-between',
            }}>
            <ScrollView style={{width: '100%', paddingHorizontal: 20}}>
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
                <View
                  style={{
                    marginBottom: 20,
                  }}>
                  {['Order near you', 'Most rating', 'In a rush', 'New on Tastie'].map(
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
                  {['Vegetarian', 'Vegan', 'Gluten-free', 'Good for health', 'Alergy-friendly'].map(
                    (item, index) => (
                      <TouchableOpacity
                        onPress={() => {
                          let pos = selectedDietary.indexOf(item);
                          let copy = [...selectedDietary];
                          if (pos !== -1) {
                            copy.splice(pos, 1); // remove item
                            setSelectedDietary(copy);
                          } else {
                            copy.push(item); // add item
                            setSelectedDietary(copy);
                          }
                        }}
                        key={index}
                        style={{
                          padding: 10,
                          borderRadius: 15,
                          backgroundColor: selectedDietary.includes(item)
                            ? 'black'
                            : 'rgba(230,230,230,0.8)',
                          marginRight: 10,
                          marginBottom: 10,
                        }}>
                        <Text style={{color: selectedDietary.includes(item) ? 'white' : 'black'}}>
                          {item}
                        </Text>
                      </TouchableOpacity>
                    ),
                  )}
                </View>
              )}
              <View style={{width: '100%', marginTop: 25}}>
                <TouchableOpacity
                  style={{padding: 15, backgroundColor: 'black'}}
                  onPress={() => {
                    filterModalize.current.close();
                    setTimeout(() => {
                      props.navigation.navigate('ResultContent', {
                        groupID: sortOption.groupID,
                        title: sortOption.title,
                      });
                    }, 200);
                  }}>
                  <Text
                    style={{fontSize: 17, color: 'white', fontWeight: '500', textAlign: 'center'}}>
                    Done
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </Modalize>
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
    // marginTop: Platform.OS === 'ios' ? 40 : 0,
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
    paddingHorizontal: 15,
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
    paddingHorizontal: 20,
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
    width: '100%',
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
  modal: {
    height: height,
    width: width,
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: '#ededed',
    justifyContent: 'center',
  },
});
