import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  ImageBackground,
  Dimensions,
  Platform,
  Animated,
} from 'react-native';

// components
import colors from '../../../colors/colors';
import {IP_ADDRESS, convertDollar} from '../../../global';
import {SimpleSkeleton} from '../../../components/Skeleton/SimpleSkeleton';
import {Header} from '../../../components/Layout/Header/Header';
import {DisplayAlertMessage} from '../../../store/action/auth';
// libraries
import Feather from 'react-native-vector-icons/Feather';
import axios from 'axios';
import FastImage from 'react-native-fast-image';

import {useSelector} from 'react-redux';

const {width, height} = Dimensions.get('window');
const CATEGORY_IMAGE_HEIGHT = 150;
const PROVIDER_TEXT_MAX_WIDTH = width - 15 - 150 - 10 - 30;

export const ResultContent = ({navigation, route}) => {
  const [loading, setLoading] = useState(true);
  const {groupID, title, keyword, categoryFilter, image, ecoupon_id, isFavorite} = route.params;
  const [data, setData] = useState([]);
  const [offset, setOffset] = useState(1);
  const state = useSelector(state => state.UserReducer);
  const [imageError, setImageError] = useState(false);

  const scrollY = useRef(new Animated.Value(0)).current;
  const headerImageHeiht = scrollY.interpolate({
    inputRange: [0, CATEGORY_IMAGE_HEIGHT],
    outputRange: [CATEGORY_IMAGE_HEIGHT - 50, 0],
    extrapolate: 'clamp',
  });
  const headerContentOpacity = scrollY.interpolate({
    inputRange: [0, CATEGORY_IMAGE_HEIGHT],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });
  const headerTitleOpacity = scrollY.interpolate({
    inputRange: [0, CATEGORY_IMAGE_HEIGHT],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  const headerContentPaddingBottom = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [25, 0],
    extrapolate: 'clamp',
  });

  const LoadProvider = async (group_id, offset, limit = 20) => {
    try {
      let res = await axios.post(
        `http://${IP_ADDRESS}:3008/v1/api/provider/dashboard/home/get-group-provider`,
        {
          group_provider_id: group_id,
          limit: 20,
          offset: offset,
          latitude: state.userLocation.latitude,
          longitude: state.userLocation.longitude,
          user_id: state.user_id,
        },
      );
      if (res.data.response) {
        setData(res.data.response);
      }
    } catch (error) {
      console.error('Cannot get group provider', error);
    } finally {
      setLoading(false);
    }
  };

  const LoadMoreProvider = async () => {
    try {
      let res = await axios.post(
        `http://${IP_ADDRESS}:3008/v1/api/provider/dashboard/home/get-group-provider`,
        {
          group_provider_id: groupID,
          limit: 20,
          offset: offset + 1,
          latitude: state.userLocation.latitude,
          longitude: state.userLocation.longitude,
          user_id: state.user_id,
        },
      );
      if (res.data.response) {
        setData(prev => [...prev, ...res.data.response]);
        setOffset(offset + 1);
      }
    } catch (error) {
      console.error('Cannot get group provider', error);
    }
  };

  const LoadSearchResult = async keyword => {
    try {
      let res = await axios.post(`http://${IP_ADDRESS}:3007/v1/api/tastie/search`, {
        q: keyword,
        type: '1',
        longitude: state.userLocation.longitude,
        latitude: state.userLocation.latitude,
        user_id: state.user_id,
      });
      if (res.data.status) {
        setData(res.data.data.items);
      }
    } catch (error) {
      console.error('Cannot get group provider', error);
    } finally {
      setLoading(false);
    }
  };

  const LoadCategoryResult = async filter => {
    try {
      let res = await axios.post(`http://${IP_ADDRESS}:3007/v1/api/tastie/search`, {
        type: '3',
        longitude: state.userLocation.longitude,
        latitude: state.userLocation.latitude,
        category_infor: {
          category_type: filter.type.toString(),
          category_id: filter.categoryID,
        },
        user_id: state.user_id,
      });
      if (res.data.status) {
        setData(res.data.data.items);
      }
    } catch (error) {
      console.error('Cannot filter category', error);
    } finally {
      setLoading(false);
    }
  };

  const LoadProviderByEcoupon = async ecoupon_id => {
    try {
      const res = await axios.post(
        `http://${IP_ADDRESS}:3007/v1/api/tastie/home/get-list-provider-by-ecoupon`,
        {
          ecoupon_id: ecoupon_id,
          longitude: state.userLocation.longitude.toString(),
          latitude: state.userLocation.latitude.toString(),
          limit: 100,
          offset: 1,
        },
      );

      if (res.data.status) {
        setData(res.data.response);
      }
    } catch (error) {
      console.error('Cannot load provider by ecoupon', error);
    } finally {
      setLoading(false);
    }
  };

  const LoadFavoriteProvider = async (user_id, longitude, latitude) => {
    try {
      const res = await axios.post(
        `http://${IP_ADDRESS}:3007/v1/api/tastie/home/get-list-provider-favorite`,
        {
          user_id: user_id,
          longitude: longitude.toString(),
          latitude: latitude.toString(),
        },
      );
      if (res.data.status) {
        setData(res.data.response);
      }
    } catch (error) {
      DisplayAlertMessage('Cannot get favorite provider');
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (keyword) {
      LoadSearchResult(keyword);
    } else if (categoryFilter) {
      LoadCategoryResult(categoryFilter);
      // console.log(categoryFilter);
    } else if (ecoupon_id) {
      LoadProviderByEcoupon(ecoupon_id);
    } else if (isFavorite) {
      LoadFavoriteProvider(
        state.user_id,
        state.userLocation.longitude,
        state.userLocation.latitude,
      );
    } else {
      LoadProvider(groupID, offset);
    }
  }, []);

  const Item = ({item}) => {
    const [isError, setIsError] = useState(false);

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('DetailProvider', {data: item.provider_id})}
        style={[styles.providerWrapper, {marginTop: 20}]}>
        <FastImage
          onError={() => setIsError(true)}
          source={
            isError
              ? require('../../../assets/image/SlideShowImg/Picture1.jpg')
              : {uri: item.profile_pic ?? item.avatar}
          }
          resizeMode={FastImage.resizeMode.cover}
          style={{height: 100, width: 100}}
        />
        <View style={[styles.flexRowBetween, {marginLeft: 15}]}>
          <View>
            <View style={{justifyContent: 'space-between'}}>
              <Text
                numberOfLines={1}
                style={[styles.subheading, {width: PROVIDER_TEXT_MAX_WIDTH, marginVertical: 1}]}>
                {item.provider_name ?? item.name}
              </Text>
              <Text style={{marginVertical: 1}}>
                • Delivery fee ${convertDollar(item.delivery_fee)}
              </Text>
              <Text style={{marginVertical: 1}}>{item.estimated_cooking_time} minutes</Text>
            </View>
            <Text>{item.promotionCode && ''}</Text>
          </View>
          <View style={{padding: 10, borderRadius: 40, backgroundColor: 'rgba(230,230,230,0.6)'}}>
            <Text>{item.order_totals ?? 4.5}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderItem = ({item, index}) => {
    return <Item item={item} />;
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, {justifyContent: 'center'}]}>
        {[0, 1, 2, 3, 4].map((_, index) => (
          <SimpleSkeleton key={index} />
        ))}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          paddingHorizontal: 10,
          paddingVertical: 15,
          position: 'relative',
          width: '100%',
          zIndex: 0,
          backgroundColor: '#f2f2f2',
        }}>
        <TouchableOpacity
          style={{position: 'absolute', top: 15, left: 10, zIndex: 10}}
          onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={20} color="black" />
        </TouchableOpacity>
        <Animated.Text
          style={{
            textAlign: 'center',
            fontSize: 17,
            fontWeight: '600',
            opacity: headerTitleOpacity,
          }}>
          {title}
        </Animated.Text>
      </View>
      <Animated.View style={[styles.headerWrapper, {height: headerImageHeiht}]}>
        <Animated.Text style={{fontSize: 24, fontWeight: '600', opacity: headerContentOpacity}}>
          {title}
        </Animated.Text>
        <Animated.View
          style={{opacity: headerContentOpacity, paddingBottom: headerContentPaddingBottom}}>
          <Image
            source={image}
            style={{
              width: 150,
              height: CATEGORY_IMAGE_HEIGHT,
            }}
          />
        </Animated.View>
      </Animated.View>
      <View
        style={{
          width: '100%',
          height: '100%',
        }}>
        <FlatList
          data={data}
          keyExtractor={(item, index) => item.provider_id + index}
          showsVerticalScrollIndicator={false}
          onEndReachedThreshold={2}
          onEndReached={() => {
            if (keyword) {
              LoadMoreProvider();
            }
          }}
          renderItem={renderItem}
          style={{
            height,
          }}
          contentContainerStyle={{
            paddingBottom: Platform.OS === 'android' ? 150 : 30,
          }}
          onScroll={Animated.event([{nativeEvent: {contentOffset: {y: scrollY}}}], {
            useNativeDriver: false,
          })}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  headerWrapper: {
    width: '100%',
    position: 'relative',
    backgroundColor: '#f2f2f2',
    paddingLeft: 15,
    // paddingBottom: 25,
    height: CATEGORY_IMAGE_HEIGHT - 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 10,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  flexRowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    width: width - 15 - 100 - 10 - 15,
  },
  providerWrapper: {
    paddingHorizontal: 15,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    // borderWidth: 1,
  },
  subheading: {
    fontWeight: '600',
    fontSize: 17,
  },
});
