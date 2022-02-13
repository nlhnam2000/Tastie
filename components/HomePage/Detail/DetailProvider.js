import React, {createRef, useEffect, useRef, useState} from 'react';
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
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import colors from '../../../colors/colors';
import {useSelector, useDispatch} from 'react-redux';
import {NavigateToCart} from '../../../store/action/navigation';

const FULL_WIDTH = Dimensions.get('screen').width;
const NAVBAR_VERTICAL_PADDING = 10;
export const HEADER_IMAGE_HEIGHT = 150;

export const DetailProvider = props => {
  const [loading, setLoading] = useState(true);
  const {data} = props.route.params;
  const scrollY = useRef(new Animated.Value(0)).current;
  const state = useSelector(state => state.UserReducer);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(tabPosition);
    setLoading(false);
  }, []);

  let modes = ['Delivery', 'Pickup'];
  const [selectedMode, setSelectedMode] = useState(modes[0]);

  let tabs = [];
  data.categories.forEach(item => {
    tabs.push(item.categoryTitle);
  });
  const [selectedTab, setSelectedTab] = useState(tabs[0]);

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

  const scrollToIndex = index => {
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
  };

  const renderCategoryTitle = ({item}) => {
    let index = item.categoryId;
    let categoryTitle = item.categoryTitle;
    return (
      <TouchableOpacity
        style={categoryTitle === selectedTab ? styles.categoryTitleClicked : styles.categoryTitle}
        onPress={() => {
          scrollToIndex(index);
          setSelectedTab(categoryTitle);
        }}>
        <Text style={{fontSize: 16, fontWeight: 'bold'}}>{item.categoryTitle}</Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size={'large'} color={colors.red} />
      </SafeAreaView>
    );
  } else {
    return (
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
            <Text style={{fontWeight: 'bold', fontSize: 20}}>{data.title}</Text>
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
              data={data.categories}
              keyExtractor={item => item.categoryId}
              horizontal={true}
              renderItem={renderCategoryTitle}
              showsHorizontalScrollIndicator={false}
            />
          </Animated.View>
        </Animated.View>

        <Animated.ScrollView
          ref={ref}
          onScroll={Animated.event([{nativeEvent: {contentOffset: {y: scrollY}}}], {
            useNativeDriver: false,
          })}
          scrollEventThrottle={1}
          // pagingEnabled={true}
          style={styles.wrapper}>
          <Animated.Image
            source={data.image}
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
            <Text style={{fontSize: 22, fontWeight: 'bold'}}>{data.title}</Text>
            <View style={styles.infoWrapper}>
              <View style={styles.info}>
                <Text style={{fontWeight: '600'}}>
                  {' '}
                  <Feather name="star" size={17} color={'#000'} /> {data.rating} (
                  {data.numberRating} ratings) • {data.mainCategory}
                </Text>
                <Text style={{color: 'gray'}}>Open until {data.openHour}</Text>
                <Text style={{color: 'gray'}}>Tap for hours, address and more</Text>
              </View>
              <TouchableOpacity>
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
            <View style={styles.promotionWrapper}>
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
            </View>
            <View style={styles.contentWrapper}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 20,
                }}>
                <Text style={{fontSize: 19}}>Menus</Text>
                <Feather name="search" size={20} color={'#000'} />
              </View>
            </View>
            {data.categories.map((category, index) => {
              return (
                <View
                  onLayout={event => {
                    const layout = event.nativeEvent.layout;
                    tabPosition[index] = layout.y;
                    setTabPosition(tabPosition);
                  }}
                  style={styles.menuContentWrapper}
                  key={category.categoryId}>
                  <Text
                    style={{
                      textAlign: 'left',
                      fontWeight: 'bold',
                      fontSize: 25,
                    }}>
                    {category.categoryTitle}
                  </Text>
                  <View style={styles.menuContent}>
                    {category.items.map((item, id) => {
                      if (state.userCart.cart.some(obj => obj.product_id === item.itemId)) {
                        return (
                          <TouchableOpacity
                            onPress={() =>
                              props.navigation.navigate('DetailFood', {
                                item,
                                provider: {provider_id: data.id, provider_name: data.title},
                              })
                            }
                            style={styles.foodWrapper}
                            key={item.itemId}>
                            <View style={styles.foodInfo}>
                              <Text style={{fontWeight: '600', fontSize: 18}}>
                                {item.itemTitle}
                              </Text>
                              <Text>${item.price}</Text>
                              <Text style={{color: 'gray'}}>{item.note}</Text>
                            </View>
                            <ImageBackground style={styles.foodImage} source={item.image}>
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
                                        obj => obj.product_id === item.itemId,
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
                          key={item.itemId}>
                          <View style={styles.foodInfo}>
                            <Text style={{fontWeight: '600', fontSize: 18}}>{item.itemTitle}</Text>
                            <Text>${item.price}</Text>
                            <Text style={{color: 'gray'}}>{item.note}</Text>
                          </View>
                          <ImageBackground
                            style={styles.foodImage}
                            source={item.image}></ImageBackground>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              );
            })}
          </View>
        </Animated.ScrollView>
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
    borderBottomWidth: 2,
    borderBottomColor: 'black',
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
    width: 100,
    height: 100,
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
});
