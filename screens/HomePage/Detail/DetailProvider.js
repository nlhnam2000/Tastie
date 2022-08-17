import React, {useEffect, useRef, useState, useCallback, useMemo} from 'react';
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
// components
import {UpcomingProduct} from '../../../components/Modal/UpcomingProduct';
import {IP_ADDRESS, cleanOperationTime, discount} from '../../../global';
import {DetailProviderSkeleton} from '../../../components/Skeleton/DetailProviderSkeleton';
import {ProviderMarker, UserMarker} from '../../../components/Marker/Marker';

// actions
import {NavigateToCart} from '../../../store/action/navigation';

// libraries
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../../../colors/colors';
import {useSelector, useDispatch} from 'react-redux';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {Modalize} from 'react-native-modalize';
import axios from 'axios';
import FastImage from 'react-native-fast-image';
import BottomSheet, {
  BottomSheetModalProvider,
  BottomSheetBackdrop,
  BottomSheetModal,
} from '@gorhom/bottom-sheet';

const FULL_WIDTH = Dimensions.get('screen').width;
const NAVBAR_VERTICAL_PADDING = 10;
export const HEADER_IMAGE_HEIGHT = 150;

export const DetailProvider = props => {
  const [loading, setLoading] = useState(true);
  const [openInfo, setOpenInfo] = useState(false);
  const [openAddress, setOpenAddress] = useState(false);
  const [openRating, setOpenRating] = useState(false);
  const [firstScroll, setFirstScroll] = useState(true);
  const {data, productTarget} = props.route.params;
  const scrollY = useRef(new Animated.Value(0)).current;
  const state = useSelector(state => state.UserReducer);
  const mapref = useRef();
  const modalizeRef = useRef();
  const categoryListRef = useRef();
  const dispatch = useDispatch();
  const [menuCategory, setMenuCategory] = useState([]);
  const [item, setItem] = useState([]);
  const [info, setInfo] = useState({});
  const [upcomingProducts, setUpcomingProducts] = useState([]);
  const [selectedUpcomingProduct, setSelectedUpcomingProduct] = useState(upcomingProducts[0]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [operation_time, setOperation_time] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const searchBottomSheetRef = useRef();
  const searchBottomSheetSnapPoint = useMemo(() => ['95%'], []);
  const searchInputRef = useRef();
  const openSearchBottomSheet = useCallback(() => {
    searchBottomSheetRef.current?.present();
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 500);
  }, []);
  const closeSearchBottomSheet = useCallback(() => {
    searchBottomSheetRef.current?.dismiss();
  }, []);

  useEffect(() => {
    if (searchKeyword !== '') {
      let productList = [];
      for (let i = 0; i < item.length; i++) {
        productList = [...productList, ...item[i].data];
      }
      // console.log(productList.at(0));
      setSearchResults(
        productList.filter(product =>
          product.product_name.toLowerCase().includes(searchKeyword.toLowerCase()),
        ),
      );
    }
  }, [searchKeyword]);

  const providerInfoModal = useRef();
  const openProviderInfoModal = () => {
    providerInfoModal.current?.open();
  };

  const AnimatedImage = Animated.createAnimatedComponent(FastImage);

  const handleFavorite = async (provider_id, user_id) => {
    try {
      if (isFavorite) {
        const res = await axios.post(
          `http://${IP_ADDRESS}:3007/v1/api/tastie/remove-from-favorite`,
          {
            provider_id,
            user_id,
          },
        );

        if (res.data.status) {
          setIsFavorite(false);
        }
      } else {
        const res = await axios.post(`http://${IP_ADDRESS}:3007/v1/api/tastie/add-to-favorite`, {
          provider_id,
          user_id,
        });

        if (res.data.status) {
          setIsFavorite(true);
        }
      }
    } catch (error) {
      console.error('Cannot add to favorite', error);
    }
  };

  const getListProduct = async provider_id => {
    let res = await axios.get(
      `http://${IP_ADDRESS}:3008/v1/api/provider/dashboard/menu-overview/${provider_id}/get-list-product`,
    );

    return res.data;
  };

  const getProviderInfo = async provider_id => {
    let res = await axios.post(`http://${IP_ADDRESS}:3008/v1/api/provider/dashboard/get-info`, {
      provider_id: provider_id,
      user_id: state.user_id,
    });

    // let res = await axios.get(
    //   `http://${IP_ADDRESS}:3008/v1/api/provider/dashboard/${provider_id}/get-info`,
    // );

    return res.data;
  };

  const getUpcomingProduct = async provider_id => {
    let res = await axios.get(
      `http://${IP_ADDRESS}:3008/v1/api/provider/dashboard/get-up-coming-product/${provider_id}`,
    );

    return res.data;
  };

  const loadDetailProvider = async provider_id => {
    const res1 = getListProduct(provider_id);
    const res2 = getProviderInfo(provider_id);
    const res3 = getUpcomingProduct(provider_id);
    Promise.all([res1, res2, res3]).then(data => {
      // data[0] means the response from 1st api call
      // data[0].result.forEach((item, index) => {
      //   setMenuCategory(prev => [
      //     ...prev,
      //     {menuCategoryId: item.menu_category_id, menuCategoryName: item.menu_category_name},
      //   ]);
      //   if (index === 0) {
      //     setSelectedTab(item.menu_category_name);
      //   }
      // });

      // const _menuCategory = [...data[0].result].map(item => )

      // clone the "products" property to "data" property to use SectionList
      let providerDetailResult = data[0].result.reduce((r, s) => {
        r.push({...s, data: s.products});
        return r;
      }, []);

      setItem(providerDetailResult);

      // data[1] means the response from 2nd api call
      if (data[1].provider_info) {
        setInfo(prev => ({...prev, ...data[1].provider_info}));
        setIsFavorite(data[1].provider_info.isFavorite);
      }

      // data[2] means the response from 3rd api call
      if (data[2].status) {
        setUpcomingProducts(data[2].response);
      }

      setLoading(false);
      // if (productTarget) {
      //   scrollToProduct(productTarget);
      // }
    });
  };

  useEffect(() => {
    console.log(data);
    loadDetailProvider(data);
  }, []);

  useEffect(() => {
    if (info.operation_time) {
      setOperation_time(cleanOperationTime(info.operation_time));
    }
  }, [info]);

  useEffect(() => {
    if (!loading && productTarget && item.length > 0) {
      scrollToProduct(productTarget);
      setTimeout(() => {
        scrollToProduct(productTarget);
      }, 1000);
    }
  }, [loading, productTarget, item]);

  useEffect(() => {
    if (item.length > 0) {
      const copied = [...item].map(item => ({
        menuCategoryId: item.menu_category_id,
        menuCategoryName: item.menu_category_name,
      }));
      // console.log(copied);
      setMenuCategory(copied);
    }
  }, [item]);

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

  const scrollToProduct = product_id => {
    let sectionIndex = 0;
    let itemIndex = 0;

    for (let i = 0; i < item.length; i++) {
      let index = item[i].data.findIndex(p => p.product_id === product_id);
      if (index !== -1) {
        sectionIndex = i;
        itemIndex = index + 1;
        scrollToSection(sectionIndex, itemIndex);
        break;
      } else {
        continue;
      }
    }
    // console.log({sectionIndex, itemIndex});
  };

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

  const scrollToSection = (sectionIndex, itemIndex = 1) => {
    if (item.length > 0) {
      try {
        ref.current.scrollToLocation({sectionIndex, itemIndex});
      } catch (error) {
        console.log(error);
      }
    }
  };
  const scrollToOffset = offset => {
    ref.current.scrollToOffset({offset: offset});
  };
  const onScrollToIndexFailed = info => {
    const offset = info.averageItemLength * info.index;
    console.log(offset);
    //scrollToSection(offset);
    setTimeout(() => {
      scrollToSection(offset);
    }, 200);
  };
  const onViewChangeConfigRef = useRef({
    minimumViewTime: 1,
    waitForInteraction: true,
    viewAreaCoveragePercentThreshold: 100,
  });
  const onViewableItemsChanged = ({viewableItems}) => {
    // console.log(viewableItems);
    // if (viewableItems[0].item.menu_category_name) {
    //   setSelectedTab(viewableItems[0].item.menu_category_name);
    //   const categoryNameList = [...menuCategory].map(item => item.menuCategoryName);
    //   const index = categoryNameList.indexOf(viewableItems[0].item.menu_category_name);
    //   console.log('index:', index);
    //   if (index !== -1) {
    //     categoryListRef.current?.scrollToIndex({index: index});
    //   }
    // }
  };

  const renderCategoryTitle = ({item, index}) => {
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
          scrollToSection(index);
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
        data={upcomingProducts}
        keyExtractor={item => item.upcoming_product_id}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({item, index}) => (
          <View style={{flexDirection: 'row', alignItems: 'center', marginRight: 20}}>
            <TouchableOpacity
              style={{borderRadius: 40}}
              onPress={() => {
                setSelectedUpcomingProduct(upcomingProducts[index]);
                openModalize();
              }}>
              <ImageBackground
                source={{uri: item.product_image}}
                style={{width: 120, height: 120, marginTop: 10}}></ImageBackground>
            </TouchableOpacity>
          </View>
        )}
      />
    );
  });

  if (loading) {
    return <DetailProviderSkeleton />;
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
                {info.data.merchant_name}
              </Text>
              <TouchableOpacity onPress={() => openSearchBottomSheet()}>
                <Feather name="search" size={22} color={'#000'} />
              </TouchableOpacity>
            </Animated.View>
            <Animated.View
              style={{
                width: '100%',
                paddingHorizontal: 20,
                paddingVertical: 15,
              }}>
              <FlatList
                ref={categoryListRef}
                data={menuCategory}
                keyExtractor={(item, index) => index.toString()}
                horizontal={true}
                renderItem={renderCategoryTitle}
                showsHorizontalScrollIndicator={false}
                // initialNumToRender={menuCategory.length}
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
            initialNumToRender={1000}
            ref={ref}
            onScrollToIndexFailed={onScrollToIndexFailed}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={onViewChangeConfigRef.current}
            renderItem={({item}) =>
              item.product_status !== 3 ? (
                <View style={styles.menuContentWrapper}>
                  <View style={styles.menuContent}>
                    <TouchableOpacity
                      disabled={item.product_status === 2 ? true : false}
                      onPress={() =>
                        props.navigation.navigate('ProductOptions', {
                          data: item,
                          provider_id: info.data.provider_id,
                          provider_name: info.data.merchant_name,
                          location: {
                            latitude: parseFloat(info.data.latitude),
                            longitude: parseFloat(info.data.longitude),
                          },
                          address: `${info.data.address} ${info.data.road}`,
                        })
                      }
                      style={styles.foodWrapper}>
                      <View
                        style={[
                          styles.foodInfo,
                          {width: '70%', opacity: item.product_status === 2 ? 0.6 : 1},
                        ]}>
                        <Text style={{fontWeight: '600', fontSize: 18, marginBottom: 10}}>
                          {item.product_name}
                        </Text>
                        {/* <View style={{flexDirection: 'row', alignItems: 'center'}}>
                          <MaterialIcon name="sale" color={colors.boldred} size={17} />
                          <Text style={{color: colors.boldred, marginHorizontal: 5}}>50%</Text>
                          <Text style={{textDecorationLine: 'line-through', color: 'grey'}}>
                            ${item.price.toFixed(2)}
                          </Text>
                        </View>
                        <Text style={{marginTop: 10}}>${discount(item.price, 0.5).toFixed(2)}</Text> */}
                        <Text style={{marginTop: 10}}>${item.price.toFixed(2)}</Text>
                        <Text style={{color: 'gray', marginTop: 10}} numberOfLines={4}>
                          {item.description}
                        </Text>
                      </View>
                      <FastImage
                        style={[styles.foodImage, {opacity: item.product_status === 2 ? 0.6 : 1}]}
                        source={{uri: item.product_image}}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              ) : null
            }
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
                <AnimatedImage
                  source={{uri: info.data.avatar}}
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
                      }}
                      onPress={() => handleFavorite(info.data.provider_id, state.user_id)}>
                      {isFavorite ? (
                        <MaterialIcon name="heart" size={22} color={colors.boldred} />
                      ) : (
                        <Feather name="heart" size={22} color={'black'} />
                      )}
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
                  <TouchableOpacity
                    onPress={() => openProviderInfoModal()}
                    style={styles.infoWrapper}>
                    <View style={styles.info}>
                      <Text style={{fontWeight: '600'}}>
                        {' '}
                        <Feather name="star" size={17} color={'#000'} /> {info.data.order_totals} (
                        {info.data.rating} ratings) • {data.mainCategory}
                      </Text>
                      <Text style={{color: 'gray', marginTop: 10}}>Open until {data.openHour}</Text>
                      <Text style={{color: 'gray'}}>Tap for hours, address and more</Text>
                    </View>
                    <Feather name="chevron-right" size={24} color={'#000'} />
                  </TouchableOpacity>
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
                  <TouchableOpacity
                    style={styles.promotionWrapper}
                    onPress={() =>
                      props.navigation.navigate('PromotionList', {
                        provider_id: info.data.provider_id,
                      })
                    }>
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

                        <Text style={{fontWeight: 'bold', fontSize: 18}}>Available promotions</Text>
                      </View>
                      <Feather name="chevron-right" size={20} color={'#000'} />
                    </View>
                  </TouchableOpacity>
                  {upcomingProducts.length > 0 && (
                    <View
                      style={{
                        width: '100%',
                        paddingHorizontal: 20,
                        marginTop: 20,
                      }}>
                      <Text style={{fontSize: 19, fontWeight: '600'}}>Upcoming product</Text>
                      <UpcomingProductList />
                    </View>
                  )}

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
                      <TouchableOpacity onPress={() => openSearchBottomSheet()}>
                        <Feather name="search" size={20} color={'#000'} />
                      </TouchableOpacity>
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
              mapType="terrain"
              ref={mapref}
              scrollEnabled
              onMapLoaded={() => {
                mapref.current.fitToCoordinates(
                  [
                    {
                      latitude: parseFloat(info.data.latitude),
                      longitude: parseFloat(info.data.longitude),
                    },
                    {
                      // latitude: 10.766575409142378,
                      // longitude: 106.69510799782778,
                      latitude: state.userLocation.latitude,
                      longitude: state.userLocation.longitude,
                    },
                  ],
                  {
                    edgePadding: {top: 40, right: 20, bottom: 20, left: 20},
                    animated: true,
                  },
                );
              }}
              initialRegion={{
                latitude: parseFloat(info.data.latitude),
                longitude: parseFloat(info.data.longitude),
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
              }}
              provider={PROVIDER_GOOGLE}
              style={styles.map}>
              <Marker
                tracksViewChanges={false}
                coordinate={{
                  latitude: parseFloat(info.data.latitude),
                  longitude: parseFloat(info.data.longitude),
                }}>
                <ProviderMarker />
              </Marker>
              <Marker
                coordinate={{
                  latitude: state.userLocation.latitude,
                  longitude: state.userLocation.longitude,
                }}
                tracksViewChanges={false}>
                <UserMarker />
              </Marker>
            </MapView>
            {/* <TouchableOpacity
              style={styles.modalHeader}
              onPress={() => providerInfoModal.current.close()}>
              <Feather name="x" size={20} color={'black'} />
            </TouchableOpacity> */}
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
                  style={[styles.sectionWrapper, {paddingTop: 10}]}>
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
                      paddingTop: openAddress ? 10 : 20,
                    }}>
                    <View>
                      <Text
                        style={{
                          fontSize: 17,
                          fontWeight: '600',
                          marginBottom: openAddress ? 15 : 0,
                          marginTop: openAddress ? 0 : -20,
                        }}>
                        Open hour
                      </Text>
                    </View>

                    <Feather
                      name={openAddress ? 'minus' : 'plus'}
                      size={22}
                      color={'gray'}
                      style={{marginBottom: openAddress ? 15 : 0, marginTop: openAddress ? 0 : -20}}
                    />
                  </View>
                </TouchableOpacity>
                <View
                  style={{
                    marginLeft: 36,
                    borderBottomWidth: 2,
                    borderBottomColor: 'rgba(230,230,230,1)',
                    paddingBottom: 10,
                  }}>
                  {openAddress
                    ? operation_time.map((item, index) => (
                        <View key={index} style={{marginLeft: 10, marginBottom: 10}}>
                          <Text style={{fontWeight: '500', marginBottom: 5}}>{item.date}</Text>
                          <Text>{item.time}</Text>
                        </View>
                      ))
                    : null}
                </View>
                <View style={[styles.sectionWrapper, {alignItems: 'flex-start'}]}>
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
                    <TouchableOpacity
                      onPress={() =>
                        props.navigation.navigate('Review', {provider_id: info.data.provider_id})
                      }>
                      <Text style={{fontSize: 17, fontWeight: '600'}}>Rating & Reviews</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setOpenRating(prev => !prev)}>
                      <Feather name={'chevron-right'} size={22} color={'gray'} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
        </Modalize>
        <Modalize ref={modalizeRef}>
          <UpcomingProduct
            data={selectedUpcomingProduct}
            dismiss={() => modalizeRef.current?.close()}
          />
        </Modalize>
        <BottomSheetModalProvider>
          <BottomSheetModal
            ref={searchBottomSheetRef}
            snapPoints={searchBottomSheetSnapPoint}
            index={0}
            backdropComponent={props => (
              <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
            )}>
            <TextInput
              ref={searchInputRef}
              placeholder="Search for a food ... "
              placeholderTextColor={'#c4c4c4'}
              style={{width: '100%', padding: 15, backgroundColor: '#f2f2f2'}}
              returnKeyType="search"
              onChangeText={text => setSearchKeyword(text)}
            />
            <FlatList
              data={searchResults}
              keyExtractor={item => item.provider_id}
              renderItem={({item}) => (
                <View style={styles.menuContentWrapper}>
                  <View style={styles.menuContent}>
                    <TouchableOpacity
                      disabled={item.product_status === 2 ? true : false}
                      onPress={() => {
                        closeSearchBottomSheet();
                        props.navigation.navigate('ProductOptions', {
                          data: item,
                          provider_id: info.data.provider_id,
                          provider_name: info.data.merchant_name,
                          location: {
                            latitude: parseFloat(info.data.latitude),
                            longitude: parseFloat(info.data.longitude),
                          },
                          address: `${info.data.address} ${info.data.road}`,
                        });
                      }}
                      style={styles.foodWrapper}>
                      <View
                        style={[
                          styles.foodInfo,
                          {width: '70%', opacity: item.product_status === 2 ? 0.6 : 1},
                        ]}>
                        <Text style={{fontWeight: '600', fontSize: 18, marginBottom: 10}}>
                          {item.product_name}
                        </Text>
                        {/* <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <MaterialIcon name="sale" color={colors.boldred} size={17} />
                    <Text style={{color: colors.boldred, marginHorizontal: 5}}>50%</Text>
                    <Text style={{textDecorationLine: 'line-through', color: 'grey'}}>
                      ${item.price.toFixed(2)}
                    </Text>
                  </View>
                  <Text style={{marginTop: 10}}>${discount(item.price, 0.5).toFixed(2)}</Text> */}
                        <Text style={{marginTop: 10}}>${item.price.toFixed(2)}</Text>
                        <Text style={{color: 'gray', marginTop: 10}} numberOfLines={4}>
                          {item.description}
                        </Text>
                      </View>
                      <FastImage
                        style={[styles.foodImage, {opacity: item.product_status === 2 ? 0.6 : 1}]}
                        source={{uri: item.product_image}}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
          </BottomSheetModal>
        </BottomSheetModalProvider>
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
    paddingVertical: 10,
  },
});
