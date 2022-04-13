import React, {useEffect, useRef, useState} from 'react';
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
  ActivityIndicator,
  Platform,
  Modal,
  SectionList,
  RefreshControl,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import colors from '../../../colors/colors';
import {useSelector, useDispatch} from 'react-redux';
import {NavigateToCart} from '../../../store/action/navigation';
import {Rating} from '../../../components/Rating/Rating';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {UpcomingProduct} from '../../../components/Modal/UpcomingProduct';
import {Modalize} from 'react-native-modalize';
import axios from 'axios';
import {IP_ADDRESS} from '../../../global';
import {popularData} from '../../../assets/dummy/popularData';

const FULL_WIDTH = Dimensions.get('screen').width;
const NAVBAR_VERTICAL_PADDING = 10;
export const HEADER_IMAGE_HEIGHT = 150;

export const DetailProvider = props => {
  const [loading, setLoading] = useState(true);
  const [openInfo, setOpenInfo] = useState(false);
  const [openAddress, setOpenAddress] = useState(false);
  const [openRating, setOpenRating] = useState(false);
  const [firstScroll, setFirstScroll] = useState(true);
  const {data} = props.route.params;
  const scrollY = useRef(new Animated.Value(0)).current;
  const state = useSelector(state => state.UserReducer);
  const mapref = useRef();
  const modalizeRef = useRef();
  const dispatch = useDispatch();
  const [menuCategory, setMenuCategory] = useState([]);
  const [item, setItem] = useState([]);
  const [info, setInfo] = useState({});
  const [isRefreshing, setIsRefreshing] = useState(false);

  const providerInfoModal = useRef();
  const openProviderInfoModal = () => {
    providerInfoModal.current?.open();
  };

  const getListProduct = async provider_id => {
    let res = await axios.get(
      `http://${IP_ADDRESS}:3008/v1/api/provider/dashboard/menu-overview/${provider_id}/get-list-product`,
    );

    return res.data;
  };

  const getProviderInfo = async provider_id => {
    let res = await axios.get(
      `http://${IP_ADDRESS}:3008/v1/api/provider/dashboard/${provider_id}/get-info`,
    );

    return res.data;
  };

  const loadDetailProvider = provider_id => {
    const res1 = getListProduct(provider_id);
    const res2 = getProviderInfo(provider_id);
    Promise.all([res1, res2]).then(data => {
      // data[0] means the response from 1st api call
      if (data[0].result) {
        data[0].result.forEach((item, index) => {
          setMenuCategory(prev => [
            ...prev,
            {menuCategoryId: item.menu_category_id, menuCategoryName: item.menu_category_name},
          ]);
          if (index === 0) {
            setSelectedTab(item.menu_category_name);
          }
        });

        // clone the "products" property to "data" property to use SectionList
        let providerDetailResult = data[0].result.reduce((r, s) => {
          r.push({...s, data: s.products});
          return r;
        }, []);

        setItem(providerDetailResult);
      }

      // data[1] means the response from 2nd api call
      if (data[1].provider_info) {
        setInfo(prev => ({...prev, ...data[1].provider_info}));
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    loadDetailProvider(data.provider_id);
  }, []);

  // useEffect(() => {
  //   console.log(menuCategory);
  // }, [menuCategory]);

  const openModalize = () => {
    modalizeRef.current?.open();
  };

  let modes = ['Delivery', 'Pickup'];
  let contentTabs = ['Menu', 'Comments', 'Info'];
  const [selectedMode, setSelectedMode] = useState(modes[0]);
  const [selectedContentTabs, setSelectedContentTabs] = useState(contentTabs[0]);

  let tabs = [];
  menuCategory.forEach(item => {
    tabs.push(item.menuCategoryName);
  });
  const [selectedTab, setSelectedTab] = useState('');

  const height = scrollY.interpolate({
    inputRange: [-100, 0, 100],
    outputRange: [HEADER_IMAGE_HEIGHT + 100, HEADER_IMAGE_HEIGHT, HEADER_IMAGE_HEIGHT - 100],
    extrapolate: 'clamp',
  });

  const opacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const navbarOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const navbarHeight = scrollY.interpolate({
    inputRange: [0, 500],
    outputRange: [0, 70 + NAVBAR_VERTICAL_PADDING],
    extrapolate: 'clamp',
  });

  const top = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -100],
    extrapolateLeft: 'clamp',
  });

  const [tabPosition, setTabPosition] = useState([]);
  const ref = useRef();

  const scrollToIndex = (index, categoryTitle) => {
    // if (tabPosition.length > index) {
    //   ref.scrollTo({
    //     x: 0,
    //     y: tabPosition[index - 1],
    //     animated: true,
    //   });
    // } else {
    //   alert('Out of bound');
    // }
    ref.current.scrollTo({
      x: 0,
      y: tabPosition[index - 1] + 150,
      animated: true,
    });
    setSelectedTab(categoryTitle);
  };

  const renderCategoryTitle = ({item}) => {
    // let index = item.menu_category_id;
    let categoryTitle = item.menuCategoryName;
    return (
      <TouchableOpacity
        style={
          item.menuCategoryName === selectedTab ? styles.categoryTitleClicked : styles.categoryTitle
        }
        // onPress={() => {
        //   scrollToIndex(index, categoryTitle);
        // }}
        onPress={() => {
          // ref.current.scrollToLocation({
          //   sectionIndex: 0,
          //   itemIndex: 1,
          //   animated: true,
          // });
          setSelectedTab(item.menuCategoryName);
        }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: 'bold',
            opacity: item.menuCategoryName === selectedTab ? 1 : 0.4,
          }}>
          {item.menuCategoryName}
        </Text>
      </TouchableOpacity>
    );
  };

  const UpcomingProductList = React.memo(function UpcomingProductList(props) {
    return (
      <FlatList
        data={[{id: 1}, {id: 2}]}
        keyExtractor={item => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({item}) => (
          <View style={{flexDirection: 'row', alignItems: 'center', marginRight: 20}}>
            <TouchableOpacity
              style={{borderRadius: 40}}
              // onPress={() => setOpenUpcoming(true)}
              onPress={() => openModalize()}>
              <ImageBackground
                source={require('../../../assets/image/upcomingproduct.png')}
                style={{width: 120, height: 120, marginTop: 10}}></ImageBackground>
            </TouchableOpacity>
          </View>
        )}
      />
    );
  });

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size={'large'} color={colors.red} />
      </SafeAreaView>
    );
  } else {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.container}>
          <Animated.View
            style={[
              {
                justifyContent: 'center',
                alignItems: 'center',
                width: FULL_WIDTH,
              },
              {opacity: navbarOpacity, height: navbarHeight},
            ]}>
            <Animated.View style={[styles.navbar, {opacity: navbarOpacity}]}>
              <TouchableOpacity onPress={() => props.navigation.navigate('Home Page')}>
                <Feather name="arrow-left" size={22} color={'#000'} />
              </TouchableOpacity>
              <Text numberOfLines={1} style={{fontWeight: 'bold', fontSize: 20, width: '70%'}}>
                {data.provider_name}
              </Text>
              <TouchableOpacity>
                <Feather name="info" size={22} color={'#000'} />
              </TouchableOpacity>
            </Animated.View>
            <Animated.View
              style={{
                width: '100%',
                paddingHorizontal: 20,
                paddingVertical: 15,
              }}>
              <FlatList
                data={menuCategory}
                keyExtractor={(item, index) => index.toString()}
                horizontal={true}
                renderItem={renderCategoryTitle}
                showsHorizontalScrollIndicator={false}
              />
            </Animated.View>
          </Animated.View>

          <SectionList
            sections={item}
            keyExtractor={(item, index) => index.toString()}
            stickySectionHeadersEnabled={false}
            refreshControl={
              <RefreshControl
                tintColor={colors.boldred}
                refreshing={isRefreshing}
                onRefresh={() => {
                  setIsRefreshing(true);

                  setTimeout(async () => {
                    await loadDetailProvider(data.provider_id);
                    setIsRefreshing(false);
                  }, 500);
                }}
              />
            }
            onScroll={Animated.event([{nativeEvent: {contentOffset: {y: scrollY}}}], {
              useNativeDriver: false,
            })}
            removeClippedSubviews={true}
            ref={ref}
            renderItem={({item}) => (
              <View style={styles.menuContentWrapper}>
                <View style={styles.menuContent}>
                  <TouchableOpacity
                    onPress={() =>
                      props.navigation.navigate('ProductOptions', {
                        data: item,
                        provider_id: info.data.provider_id,
                      })
                    }
                    style={styles.foodWrapper}>
                    <View style={[styles.foodInfo, {width: '70%'}]}>
                      <Text style={{fontWeight: '600', fontSize: 18, marginBottom: 10}}>
                        {item.product_name}
                      </Text>
                      <Text>${item.price.toFixed(2)}</Text>
                      <Text style={{color: 'gray', marginTop: 10}} numberOfLines={4}>
                        {item.description}
                      </Text>
                    </View>
                    <ImageBackground
                      style={styles.foodImage}
                      source={{uri: item.product_image}}></ImageBackground>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            renderSectionHeader={({section: {menu_category_name}}) => (
              <Text
                style={{
                  textAlign: 'left',
                  fontWeight: 'bold',
                  fontSize: 25,
                  paddingHorizontal: 20,
                }}>
                {menu_category_name}
              </Text>
            )}
            // renderSectionHeader={({section}) => <Text>{section.menu_category_name}</Text>}
            ListEmptyComponent={() => <Text>Empty</Text>}
            ListHeaderComponent={() => (
              <>
                <Animated.Image
                  source={{uri: info.data.cover_picture}}
                  resizeMode="cover"
                  style={[styles.providerCover, {opacity}]}
                />
                <Animated.View style={[styles.navbarButtonWrapper, {opacity}]}>
                  <TouchableOpacity
                    onPress={() => props.navigation.navigate('Home Page')}
                    style={{
                      borderRadius: 40,
                      padding: 5,
                      backgroundColor: 'white',
                    }}>
                    <Feather name="arrow-left" size={22} color={'#000'} />
                  </TouchableOpacity>

                  <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity
                      style={{
                        borderRadius: 40,
                        padding: 5,
                        backgroundColor: 'white',
                      }}>
                      <Feather name="heart" size={22} color={'#000'} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        borderRadius: 40,
                        padding: 5,
                        backgroundColor: 'white',
                        marginLeft: 10,
                      }}>
                      <Feather name="info" size={22} color={'#000'} />
                    </TouchableOpacity>
                  </View>
                </Animated.View>
                <View style={styles.content}>
                  <View
                    style={{
                      height: 5,
                      width: '20%',
                      backgroundColor: '#e6e6e6',
                      borderRadius: 20,
                    }}></View>
                </View>
                <View style={styles.mainContent}>
                  <Text style={{fontSize: 22, fontWeight: 'bold', paddingHorizontal: 20}}>
                    {info.data.merchant_name}
                  </Text>
                  <View style={styles.infoWrapper}>
                    <View style={styles.info}>
                      <Text style={{fontWeight: '600'}}>
                        {' '}
                        <Feather name="star" size={17} color={'#000'} /> {data.order_totals} (
                        {data.numberRating} ratings) • {data.mainCategory}
                      </Text>
                      <Text style={{color: 'gray', marginTop: 10}}>Open until {data.openHour}</Text>
                      <Text style={{color: 'gray'}}>Tap for hours, address and more</Text>
                    </View>
                    <TouchableOpacity onPress={() => openProviderInfoModal()}>
                      <Feather name="chevron-right" size={24} color={'#000'} />
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      backgroundColor: '#e6e6e6',
                      borderRadius: 30,
                      padding: 5,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      width: '88%',
                      marginTop: 20,
                    }}>
                    {modes.map((mode, index) => {
                      return (
                        <TouchableOpacity
                          onPress={() => setSelectedMode(mode)}
                          key={index}
                          style={
                            mode === selectedMode
                              ? {
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  backgroundColor: 'white',
                                  padding: 10,
                                  paddingHorizontal: 15,
                                  borderRadius: 30,
                                }
                              : {
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  backgroundColor: 'transparent',
                                  padding: 10,
                                  paddingHorizontal: 15,
                                  borderRadius: 30,
                                }
                          }>
                          <Text style={{fontWeight: 'bold'}}>{mode}</Text>
                          <Text style={{color: 'gray'}}>20-30 mins • $0.49</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                  <TouchableOpacity style={styles.promotionWrapper}>
                    <View style={styles.promotion}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}>
                        <View
                          style={{
                            backgroundColor: 'green',
                            borderRadius: 40,
                            marginRight: 10,
                            padding: 2,
                          }}>
                          <Feather name="star" size={20} color={'#fff'} />
                        </View>

                        <Text style={{fontWeight: 'bold', fontSize: 18}}>$25 until $100</Text>
                      </View>
                      <Feather name="chevron-right" size={20} color={'#000'} />
                    </View>
                  </TouchableOpacity>
                  <View
                    style={{
                      width: '100%',
                      paddingHorizontal: 20,
                      marginTop: 20,
                    }}>
                    <Text style={{fontSize: 19, fontWeight: '600'}}>Upcoming product</Text>
                    <UpcomingProductList />
                  </View>
                  <View style={styles.contentWrapper}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: 20,
                      }}>
                      {/* {contentTabs.map((tab, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setSelectedContentTabs(tab)}
                    style={{
                      width: '33%',
                      paddingVertical: 5,
                      borderBottomWidth: selectedContentTabs === tab ? 3 : 0,
                      borderBottomColor: 'black',
                    }}>
                    <Text style={{fontSize: 19, fontWeight: '600', textAlign: 'center'}}>
                      {tab}
                    </Text>
                  </TouchableOpacity>
                ))} */}
                      <Text style={{fontSize: 19, fontWeight: '600', textAlign: 'center'}}>
                        Menu
                      </Text>
                      <Feather name="search" size={20} color={'#000'} />
                    </View>
                  </View>
                  {/* {item.map((category, index) => {
                return (
                  <View
                    onLayout={event => {
                      const layout = event.nativeEvent.layout;
                      tabPosition[index] = layout.y;
                      setTabPosition(tabPosition);
                    }}
                    style={styles.menuContentWrapper}
                    key={category.menu_category_id}>
                    <Text
                      style={{
                        textAlign: 'left',
                        fontWeight: 'bold',
                        fontSize: 25,
                      }}>
                      {category.menu_category_name}
                    </Text>
                    <View style={styles.menuContent}>
                      {category.products.map((item, id) => {
                        if (state.userCart.cart.some(obj => obj.product_id === item.product_id)) {
                          return (
                            <TouchableOpacity
                              onPress={() =>
                                props.navigation.navigate('DetailFood', {
                                  item,
                                  provider: {provider_id: data.id, provider_name: data.title},
                                })
                              }
                              style={styles.foodWrapper}
                              key={item.product_id}>
                              <View style={[styles.foodInfo, {width: '60%'}]}>
                                <View>
                                  <Text numberOfLines={1} style={{fontWeight: '600', fontSize: 18}}>
                                    {item.product_name}
                                  </Text>
                                </View>
                                <Text>${item.price}</Text>
                                <View>
                                  <Text numberOfLines={3} style={{color: 'gray'}}>
                                    {item.description}
                                  </Text>
                                </View>
                              </View>
                              <ImageBackground
                                style={[styles.foodImage]}
                                source={{uri: item.product_image}}>
                                <View style={styles.productQuantity}>
                                  <Text
                                    style={{
                                      fontWeight: '500',
                                      color: 'white',
                                      textAlign: 'center',
                                    }}>
                                    {
                                      state.userCart.cart[
                                        state.userCart.cart.findIndex(
                                          obj => obj.product_id === item.product_id,
                                        )
                                      ].quantity
                                    }
                                  </Text>
                                </View>
                              </ImageBackground>
                            </TouchableOpacity>
                          );
                        }
                        return (
                          <TouchableOpacity
                            onPress={() =>
                              props.navigation.navigate('DetailFood', {
                                item,
                                provider: {provider_id: data.id, provider_name: data.title},
                              })
                            }
                            style={styles.foodWrapper}
                            key={item.product_id}>
                            <View style={[styles.foodInfo, {width: '75%'}]}>
                              <Text style={{fontWeight: '600', fontSize: 18}}>
                                {item.product_name}
                              </Text>
                              <Text>${item.price}</Text>
                              <Text numberOfLines={5} style={{color: 'gray'}}>
                                {item.description}
                              </Text>
                            </View>
                            <ImageBackground
                              style={styles.foodImage}
                              source={{uri: item.product_image}}></ImageBackground>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                );
              })} */}
                </View>
              </>
            )}
          />

          {state.userCart.cart.length > 0 ? (
            <TouchableOpacity
              style={{
                width: '95%',
                padding: 15,
                backgroundColor: 'black',
                position: 'absolute',
                top: Platform.OS === 'ios' ? '99%' : '90%',
              }}
              onPress={() => {
                dispatch(NavigateToCart());
                props.navigation.navigate('Home Page');
              }}>
              <Text style={{color: 'white', textAlign: 'center', fontSize: 19, fontWeight: '500'}}>
                View cart ({state.userCart.cart.length})
              </Text>
            </TouchableOpacity>
          ) : null}
        </SafeAreaView>
        {/* Modal */}
        <Modalize ref={providerInfoModal} modalHeight={Dimensions.get('window').height - 100}>
          <View style={styles.modalContainer}>
            <MapView
              ref={mapref}
              scrollEnabled
              onLayout={() => {
                mapref.current.fitToCoordinates(
                  [
                    {
                      latitude: Number(data.latitude),
                      longitude: Number(data.longitude),
                    },
                    {
                      // latitude: 10.766575409142378,
                      // longitude: 106.69510799782778,
                      latitude: state.userLocation.latitude,
                      longitude: state.userLocation.longitude,
                    },
                  ],
                  {
                    edgePadding: {top: 30, right: 30, bottom: 20, left: 20},
                    animated: true,
                  },
                );
              }}
              initialRegion={{
                latitude: Number(data.latitude),
                longitude: Number(data.longitude),
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
              }}
              provider={PROVIDER_GOOGLE}
              style={styles.map}>
              <Marker
                tracksViewChanges={false}
                coordinate={{latitude: Number(data.latitude), longitude: Number(data.longitude)}}>
                <Image
                  source={require('../../../assets/image/providerMarker.png')}
                  style={{width: 40, height: 40}}
                />
              </Marker>
              <Marker
                coordinate={{
                  latitude: state.userLocation.latitude,
                  longitude: state.userLocation.longitude,
                }}
                tracksViewChanges={false}
              />
            </MapView>
            <TouchableOpacity
              style={styles.modalHeader}
              onPress={() => providerInfoModal.current.close()}>
              <Feather name="x" size={20} color={'black'} />
            </TouchableOpacity>
            <ScrollView style={{width: FULL_WIDTH}}>
              <View style={{width: FULL_WIDTH}}>
                <View style={styles.providerName}>
                  <Text style={{fontSize: 20, fontWeight: 'bold'}}>{data.provider_name}</Text>
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
                      borderBottomColor: 'rgba(230,230,230,1)',
                      borderBottomWidth: 2,
                      paddingVertical: 25,
                    }}>
                    <Text style={{fontSize: 17, fontWeight: '600'}}>
                      {info.data.address} {info.data.road}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => setOpenAddress(prev => !prev)}
                  style={styles.sectionWrapper}>
                  <View>
                    <Feather name="clock" size={22} color={'black'} />
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      paddingHorizontal: 15,
                      borderBottomColor: 'rgba(230,230,230,1)',
                      borderBottomWidth: 2,
                      paddingVertical: 25,
                    }}>
                    {/* <View>
                        <Text
                          style={{
                            fontSize: 17,
                            fontWeight: '600',
                            marginBottom: openAddress ? 10 : 0,
                          }}>
                          Open until {data.closedHour}
                        </Text>
                        {openAddress ? (
                          <>
                            <Text>Monday - Saturday</Text>
                            <Text>
                              {data.openHour} - {data.closedHour}
                            </Text>
                          </>
                        ) : null}
                      </View> */}

                    <Feather name={openAddress ? 'minus' : 'plus'} size={22} color={'gray'} />
                  </View>
                </TouchableOpacity>
                {/* <View style={[styles.sectionWrapper, {alignItems: 'flex-start'}]}>
                    <View style={{paddingVertical: 25}}>
                      <Feather name="star" size={22} color={'black'} />
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        width: '100%',
                        paddingHorizontal: 15,
                        borderBottomColor: 'rgba(230,230,230,1)',
                        borderBottomWidth: 2,
                        paddingVertical: 25,
                      }}>
                      <TouchableOpacity onPress={() => setOpenRating(prev => !prev)}>
                        <Text style={{fontSize: 17, fontWeight: '600'}}>Rating & Reviews</Text>
                        {openRating
                          ? data.reviews.map((review, index) => {
                              return (
                                <View key={index} style={{width: '100%', marginTop: 20}}>
                                  <View
                                    style={{
                                      flexDirection: 'row',
                                      alignItems: 'center',
                                      width: '100%',
                                      marginBottom: 5,
                                    }}>
                                    <Text style={{fontSize: 17, fontWeight: '500', marginRight: 5}}>
                                      {review.customer}
                                    </Text>
                                    <Rating rating={review.ratings} />
                                  </View>

                                  <Text style={{color: 'gray'}}>{review.comments}</Text>
                                </View>
                              );
                            })
                          : null}
                      </TouchableOpacity>

                      <TouchableOpacity onPress={() => setOpenRating(prev => !prev)}>
                        <Feather name={openRating ? 'minus' : 'plus'} size={22} color={'gray'} />
                      </TouchableOpacity>
                    </View>
                  </View> */}
              </View>
            </ScrollView>
          </View>
        </Modalize>
        <Modalize
          ref={modalizeRef}
          // HeaderComponent={() => (
          //   <View style={{padding: 10, alignSelf: 'center'}}>
          //     <View style={{padding: 5, backgroundColor: 'gray'}}></View>
          //   </View>
          // )}
        >
          <UpcomingProduct />
        </Modalize>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  wrapper: {
    backgroundColor: 'white',
  },
  providerCover: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: Dimensions.get('window').width,
    height: HEADER_IMAGE_HEIGHT,
    zIndex: -10,
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    marginTop: Platform.OS === 'ios' ? 10 : 20,
  },
  categoryTitle: {
    marginRight: 20,
    paddingVertical: 5,
  },
  categoryTitleClicked: {
    marginRight: 20,
    paddingVertical: 5,
    // borderBottomWidth: 2,
    // borderBottomColor: 'black',
  },
  navbarButtonWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
    width: FULL_WIDTH,
    height: 50,
    zIndex: 10,
    position: 'absolute',
    top: 70,
    paddingHorizontal: 20,
  },
  content: {
    marginTop: -15,
    backgroundColor: 'white',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
    padding: 10,
  },
  mainContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: FULL_WIDTH,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  info: {},
  promotionWrapper: {
    width: FULL_WIDTH,
    paddingHorizontal: 20,
    marginTop: 20,
    paddingVertical: 2,
  },

  promotion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#e6e6e6',
    padding: 20,
  },
  contentWrapper: {
    width: FULL_WIDTH,
    marginTop: 20,
  },
  menuContentWrapper: {
    width: FULL_WIDTH,
    paddingHorizontal: 20,
    marginBottom: 20,
    // borderBottomColor: '#e6e6e6',
    // borderBottomWidth: 1,
    // paddingBottom: 20,
  },
  menuContent: {
    // flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  foodWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    width: FULL_WIDTH,
    paddingHorizontal: 20,
    marginTop: 20,
    borderTopColor: '#e6e6e6',
    borderTopWidth: 1,
    paddingTop: 20,
  },
  foodInfo: {},
  foodImage: {
    width: 90,
    height: 90,
    position: 'relative',
  },
  addtocartButton: {
    padding: 5,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.red,
    width: '40%',
    marginTop: 15,
  },
  productQuantity: {
    marginTop: 5,
    borderRadius: 100,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    width: 30,
    height: 30,
    paddingVertical: 5,
    position: 'absolute',
    borderWidth: 2,
    borderColor: 'white',
    left: '65%',
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
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 4,
    // elevation: 5,
    borderWidth: 2,
    borderColor: colors.secondary,
    borderBottomWidth: 0,
    width: FULL_WIDTH,
    height: '90%',
    overflow: 'hidden',
  },
  map: {
    width: '100%',
    height: 200,
  },
  modalHeader: {
    position: 'absolute',
    left: '1%',
    top: '1%',
    backgroundColor: 'white',
    borderRadius: 40,
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
