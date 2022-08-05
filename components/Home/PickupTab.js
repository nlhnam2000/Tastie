import React, {useState, useEffect, useRef, useMemo, useCallback} from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Dimensions,
  // FlatList,
  Image,
  ImageBackground,
  Animated,
  Platform,
} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../../colors/colors';
import {categoryData} from '../../assets/dummy/categoryData';
import {useDispatch, useSelector} from 'react-redux';
import MapView, {PROVIDER_GOOGLE, Marker, PROVIDER_DEFAULT} from 'react-native-maps';
import axios from 'axios';
import {IP_ADDRESS, convertDollar} from '../../global';
import BottomSheet, {BottomSheetFlatList} from '@gorhom/bottom-sheet';
import {gestureHandlerRootHOC, FlatList} from 'react-native-gesture-handler';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import FastImage from 'react-native-fast-image';
import {ProviderMarker} from '../Marker/Marker';

const {width, height} = Dimensions.get('window');

export const PickupTab = gestureHandlerRootHOC(props => {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const state = useSelector(state => state.UserReducer);
  const [providerList, setProviderList] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const bottomSheetRef1 = useRef();
  const bottomSheetRef2 = useRef();
  const mapRef = useRef();
  const providerHorizontalListRef = useRef();
  const filterModalize = useRef();
  const snapPoints1 = useMemo(() => ['18%', '45%', '95%'], []);
  const snapPoints2 = useMemo(() => ['35%', '50%'], []);
  const scrollY = useRef(new Animated.Value(0)).current;

  const marginTop = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [0, -insets.top - 80],
    extrapolate: 'clamp',
  });
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const openFilterModalize = () => {
    filterModalize.current?.open();
  };

  const closeBottomSheet1 = useCallback(() => {
    bottomSheetRef1.current?.close();
  }, []);
  const openBottomSheet1 = useCallback(() => {
    bottomSheetRef1.current?.snapToIndex(1);
  }, []);
  const closeBottomSheet2 = useCallback(() => {
    bottomSheetRef2.current?.close();
  }, []);
  const openBottomSheet2 = useCallback(() => {
    bottomSheetRef2.current?.snapToIndex(0);
  }, []);

  const scrollToIndex = index => {
    try {
      providerHorizontalListRef.current.scrollToIndex({
        animated: true,
        index: index,
        viewOffset: 30,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const onViewableItemsChanged = ({viewableItems, changed}) => {
    console.log(viewableItems[0].item.provider_name);
    setSelectedMarker(viewableItems[0].items);
    // console.log(changed);
  };
  const onViewChangeRef = useRef(({viewableItems}) => {
    console.log(viewableItems);
    setSelectedMarker(viewableItems[0].item);
  });
  const onViewChangeConfigRef = useRef({
    minimumViewTime: 1,
    waitForInteraction: true,
    viewAreaCoveragePercentThreshold: 50,
  });

  const renderCategoryIcon = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() =>
          props.navigation.navigate('ResultContent', {
            categoryFilter: {
              type: item.type,
              categoryID: item.id,
            },
            title: item.title,
            image: item.image,
          })
        }
        style={{
          marginRight: 20,
          alignItems: 'center',
          paddingBottom: Platform.OS === 'android' ? 20 : 0,
        }}>
        <Image source={item.image} style={{width: 60, height: 60}} />
        <Text>{item.title}</Text>
      </TouchableOpacity>
    );
  };

  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => props.navigation.navigate('DetailProvider', {data: item})}
        style={[
          styles.providerWrapper,
          {marginBottom: index === providerList.length - 1 ? 100 : 0, marginTop: 10},
        ]}>
        <FastImage
          source={{uri: item.profile_pic ?? item.avatar}}
          resizeMode={FastImage.resizeMode.cover}
          style={{height: 150, width: width - 20}}
        />
        <View style={[styles.flexRowBetween]}>
          <View style={{paddingVertical: 10, paddingHorizontal: 15}}>
            <View style={{width: width - 200, marginBottom: 5}}>
              <Text numberOfLines={1} style={[styles.subheading]}>
                {item.provider_name ?? item.name}
              </Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text>{(item.distance / 1000).toFixed(2)} km • </Text>
              <Text>${convertDollar(item.delivery_fee)} delivery fee • </Text>
              <Text>{item.estimated_cooking_time} mins</Text>
            </View>
          </View>
          <View style={{padding: 10, borderRadius: 40, backgroundColor: 'rgba(230,230,230,0.6)'}}>
            <Text>{item.order_totals}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderHorizontalScroll = ({item, index}) => (
    <TouchableOpacity
      onPress={() => props.navigation.navigate('DetailProvider', {data: item})}
      style={[
        styles.providerHorizontalWrapper,
        {marginLeft: index === 0 ? 30 : 0, marginRight: 10},
      ]}>
      <FastImage
        source={{uri: item.profile_pic ?? item.avatar}}
        resizeMode={FastImage.resizeMode.cover}
        style={{height: 120, width: width - 40, borderTopLeftRadius: 20, borderTopRightRadius: 20}}
        // imageStyle={{borderTopLeftRadius: 20, borderTopRightRadius: 20}}
      />
      <View style={[styles.flexRowBetween, {justifyContent: 'space-around'}]}>
        <View style={{paddingVertical: 10, paddingHorizontal: 5}}>
          <View style={{width: width - 200, marginBottom: 5}}>
            <Text numberOfLines={1} style={[styles.subheading]}>
              {item.provider_name ?? item.name}
            </Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text>{(item.distance / 1000).toFixed(2)} km • </Text>
            <Text>${convertDollar(item.delivery_fee)} delivery fee • </Text>
            <Text>{item.estimated_cooking_time} mins</Text>
          </View>
        </View>
        <View style={{padding: 10, borderRadius: 40, backgroundColor: 'rgba(230,230,230,0.6)'}}>
          <Text>{item.order_totals}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const LoadNearByProvider = async location => {
    // closeBottomSheet2();
    try {
      let res = await axios.post(
        `http://${IP_ADDRESS}:3008/v1/api/provider/dashboard/home/get-near-by-provider`,
        {
          latitude: location.latitude,
          longitude: location.longitude,
          limit: 100,
          offset: 1,
          user_id: state.user_id,
          group_provider_id: 7,
        },
      );
      if (res.data.status) {
        setProviderList(res.data.response);
      }
    } catch (error) {
      console.error('Cannot get nearby provider', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    LoadNearByProvider(state.userLocation);
  }, []);

  useEffect(() => {
    if (providerList.length > 0) {
      let coordinates = providerList.map((provider, index) => ({
        latitude: parseFloat(provider.latitude),
        longitude: parseFloat(provider.longitude),
      }));
      mapRef.current?.fitToCoordinates(
        [
          ...coordinates,
          {
            latitude: state.userLocation.latitude,
            longitude: state.userLocation.longitude,
          },
        ],
        {
          edgePadding: {top: 30, right: 30, bottom: 20, left: 20},
          animated: true,
        },
      );
    }
  }, [providerList]);

  if (loading) {
    return (
      <View style={[styles.container, {justifyContent: 'center'}]}>
        <StatusBar barStyle="dark-content" />
        <ActivityIndicator size={'small'} color={colors.red} />
      </View>
    );
  }

  return (
    <Animated.View style={[styles.container, {marginTop: 0}]}>
      <View style={styles.headerWrapper}>
        <Animated.View style={[styles.tabWrapper, {marginTop: -15, position: 'relative'}]}>
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
        </Animated.View>
      </View>

      <MapView
        ref={mapRef}
        initialRegion={{
          latitude:
            state.userLocation.latitude === 0 ? 12.203214000000004 : state.userLocation.latitude,
          longitude:
            state.userLocation.longitude === 0 ? 109.19345021534353 : state.userLocation.longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }}
        // region={{
        //   latitude: selectedMarker
        //     ? parseFloat(selectedMarker.latitude)
        //     : state.userLocation.latitude,
        //   longitude: selectedMarker
        //     ? parseFloat(selectedMarker.longitude)
        //     : state.userLocation.longitude,
        //   latitudeDelta: 0.015,
        //   longitudeDelta: 0.0121,
        // }}
        showsUserLocation
        mapType="terrain"
        // onMapReady={() => {
        //   LoadNearByProvider(state.userLocation);
        // }}
        // minZoomLevel={15}
        onPress={() => {
          closeBottomSheet2();
          openBottomSheet1();
        }}
        provider={PROVIDER_GOOGLE}
        style={styles.map}>
        {providerList.map((provider, index) => (
          <Marker
            onPress={event => {
              event.stopPropagation();
              setSelectedMarker(provider);
              closeBottomSheet1();
              openBottomSheet2();
              scrollToIndex(index);
            }}
            key={index}
            zIndex={index}
            coordinate={{
              latitude: parseFloat(provider.latitude),
              longitude: parseFloat(provider.longitude),
            }}
            // tracksViewChanges={provider.provider_id === selectedMarker?.provider_id ? false : true}
            title={provider.provider_name}>
            {/* <Image
              source={require('../../assets/image/providerMarker.png')}
              style={{width: 40, height: 40}}
            /> */}
            <ProviderMarker selected={provider.provider_id === selectedMarker?.provider_id} />
          </Marker>
        ))}
      </MapView>
      <BottomSheet
        ref={bottomSheetRef1}
        index={0}
        snapPoints={snapPoints1}
        enableContentPanningGesture
        enableHandlePanningGesture>
        <View style={styles.contentContainer}>
          <FlatList
            data={categoryData}
            keyExtractor={(item, index) => item.id + index}
            renderItem={renderCategoryIcon}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{paddingHorizontal: 30, paddingVertical: 10}}
          />
          <FlatList
            data={providerList}
            keyExtractor={item => item.provider_id}
            contentContainerStyle={{backgroundColor: '#f2f2f2'}}
            renderItem={renderItem}
            style={{marginTop: 20}}
            onScroll={Animated.event([{nativeEvent: {contentOffset: {y: scrollY}}}], {
              useNativeDriver: false,
            })}
          />
        </View>
      </BottomSheet>
      <BottomSheet
        ref={bottomSheetRef2}
        snapPoints={snapPoints2}
        index={-1}
        // style={{marginTop: insets.top + 80}}
        backdropComponent={() => <></>}
        backgroundStyle={{backgroundColor: 'transparent'}}>
        <View style={styles.contentContainer}>
          <FlatList
            ref={providerHorizontalListRef}
            data={providerList}
            horizontal
            contentContainerStyle={{backgroundColor: 'transparent'}}
            keyExtractor={item => item.provider_id}
            renderItem={renderHorizontalScroll}
            showsHorizontalScrollIndicator={false}
            initialNumToRender={providerList.length}
            onScrollToIndexFailed={({index, averageItemLength}) => scrollToIndex(index)}
            onViewableItemsChanged={onViewChangeRef.current}
            viewabilityConfig={onViewChangeConfigRef.current}
          />
        </View>
      </BottomSheet>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
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
  map: {
    width,
    height: 600,
    // zIndex: 1,
  },
  contentContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    // paddingHorizontal: 30,
  },
  flexRowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  providerWrapper: {
    paddingHorizontal: 20,
    paddingVertical: 5,
    backgroundColor: 'white',
  },
  providerHorizontalWrapper: {
    // paddingHorizontal: 20,
    // paddingVertical: 10,
    backgroundColor: 'white',
    // marginRight: 10,
    // marginLeft: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#c4c4c4',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  subheading: {
    fontWeight: '600',
    fontSize: 17,
  },
});
