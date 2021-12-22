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
} from 'react-native';
import {onScroll} from 'react-native-redash';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';

const FULL_WIDTH = Dimensions.get('screen').width;
const NAVBAR_VERTICAL_PADDING = 10;
export const HEADER_IMAGE_HEIGHT = 150;

export const DetailProvider = props => {
  const {data} = props.route.params;
  const scrollY = useRef(new Animated.Value(0)).current;

  let modes = ['Delivery', 'Pickup'];
  const [selectedMode, setSelectedMode] = useState(modes[0]);

  let tabs = [];
  data.categories.forEach(item => {
    tabs.push(item.categoryTitle);
  });

  // useEffect(() => {
  //   console.log(tabs);
  // }, []);

  const height = scrollY.interpolate({
    inputRange: [-100, 0],
    outputRange: [HEADER_IMAGE_HEIGHT + 100, HEADER_IMAGE_HEIGHT],
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
    outputRange: [0, 60 + NAVBAR_VERTICAL_PADDING],
    extrapolate: 'clamp',
  });

  const top = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -100],
    extrapolateLeft: 'clamp',
  });

  const [tabPosition, setTabPosition] = useState([]);
  const [ref, setRef] = useState(null);

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
    ref.scrollTo({
      x: 0,
      y: tabPosition[index - 1] + 40,
      animated: true,
    });
  };

  const renderCategoryTitle = ({item}) => {
    let index = item.categoryId;
    return (
      <TouchableOpacity
        style={{marginRight: 20, paddingHorizontal: 10}}
        onPress={() => scrollToIndex(index)}>
        <Text style={{fontSize: 16, fontWeight: 'bold'}}>
          {item.categoryTitle}
        </Text>
      </TouchableOpacity>
    );
  };

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
          <TouchableOpacity onPress={() => props.navigation.goBack()}>
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
        ref={ref => setRef(ref)}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {useNativeDriver: false},
        )}
        scrollEventThrottle={16}
        style={styles.wrapper}>
        <Animated.Image
          source={data.image}
          resizeMode="cover"
          style={[styles.providerCover, {opacity}]}
        />
        <Animated.View style={[styles.navbarButtonWrapper, {opacity}]}>
          <TouchableOpacity
            onPress={() => props.navigation.goBack()}
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
              <Text style={{color: 'gray'}}>
                Tap for hours, address and more
              </Text>
            </View>
            <TouchableOpacity>
              <Feather name="arrow-right" size={24} color={'#000'} />
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
            {/* <TouchableOpacity
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'white',
                padding: 10,
                paddingHorizontal: 15,
                borderRadius: 30,
              }}>
              <Text style={{fontWeight: 'bold'}}>Delivery</Text>
              <Text style={{color: 'gray'}}>20-30 mins • $0.49</Text>
            </TouchableOpacity>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'transparent',
                padding: 10,
                paddingHorizontal: 15,
                borderRadius: 30,
              }}>
              <Text style={{fontWeight: 'bold'}}>Pickup</Text>
              <Text style={{color: 'gray'}}>5-15 mins • 1000+ mi</Text>
            </View> */}
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

                <Text style={{fontWeight: 'bold', fontSize: 18}}>
                  $25 until $100
                </Text>
              </View>
              <Feather name="arrow-right" size={20} color={'#000'} />
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
            {data.categories.map((category, index) => {
              return (
                <View
                  onLayout={event => {
                    const layout = event.nativeEvent.layout;
                    tabPosition[index] = layout.y;
                    setTabPosition(tabPosition);
                    // console.log(tabPosition);
                    // console.log('height:', layout.height);
                    // console.log('width:', layout.width);
                    // console.log('x:', layout.x);
                    // console.log('y:', layout.y);
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
                      return (
                        <View style={styles.foodWrapper} key={item.itemId}>
                          <View style={styles.foodInfo}>
                            <Text style={{fontWeight: '600', fontSize: 18}}>
                              {item.itemTitle}
                            </Text>
                            <Text>{item.price}</Text>
                            <Text style={{color: 'gray'}}>{item.note}</Text>
                          </View>
                          <ImageBackground
                            style={styles.foodImage}
                            source={item.image}
                          />
                        </View>
                      );
                    })}
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
    marginTop: 10,
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
  },
});
