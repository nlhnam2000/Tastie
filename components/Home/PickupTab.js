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
  // FlatList,
  Image,
  ImageBackground,
  Animated,
  Platform,
  ActivityIndicator,
  Modal,
  Switch,
  TouchableWithoutFeedback,
  RefreshControl,
  NativeModules,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import colors from '../../colors/colors';
import {categoryData} from '../../assets/dummy/categoryData';
import {useDispatch, useSelector} from 'react-redux';
import MapView, {PROVIDER_GOOGLE, Marker, PROVIDER_DEFAULT} from 'react-native-maps';
import axios from 'axios';
import {IP_ADDRESS} from '../../global';
import BottomSheet, {BottomSheetFlatList} from '@gorhom/bottom-sheet';
import {gestureHandlerRootHOC, FlatList} from 'react-native-gesture-handler';

const {width, height} = Dimensions.get('window');

export const PickupTab = gestureHandlerRootHOC(props => {
  const [loading, setLoading] = useState(true);
  const state = useSelector(state => state.UserReducer);
  const [providerList, setProviderList] = useState([]);
  const bottomSheetRef = useRef();
  const mapRef = useRef();
  const filterModalize = useRef();

  const openFilterModalize = () => {
    filterModalize.current?.open();
  };

  const renderCategoryIcon = ({item}) => {
    return (
      <TouchableOpacity
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
        <ImageBackground
          source={{uri: item.profile_pic ?? item.avatar}}
          resizeMode="cover"
          style={{height: 200, width: width - 20}}
        />
        <View style={[styles.flexRowBetween]}>
          <View style={{paddingVertical: 10, paddingHorizontal: 15}}>
            <View style={{width: width - 200, marginBottom: 5}}>
              <Text numberOfLines={1} style={[styles.subheading]}>
                {item.provider_name ?? item.name}
              </Text>
            </View>
            <Text>{item.estimated_cooking_time} minutes</Text>
          </View>
          <View style={{padding: 10, borderRadius: 40, backgroundColor: 'rgba(230,230,230,0.6)'}}>
            <Text>{item.order_totals}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const LoadNearByProvider = async location => {
    try {
      let res = await axios.post(
        `http://${IP_ADDRESS}:3008/v1/api/provider/dashboard/home/get-near-by-provider`,
        {
          latitude: location.latitude,
          longitude: location.longitude,
          limit: 5,
          offset: 1,
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
        <ActivityIndicator size={'large'} color={colors.red} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
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
        </View>
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
        showsUserLocation
        showsMyLocationButton
        mapType="terrain"
        // onMapReady={() => {
        //   LoadNearByProvider(state.userLocation);
        // }}
        // minZoomLevel={15}
        provider={PROVIDER_GOOGLE}
        style={styles.map}>
        {providerList.map((provider, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: parseFloat(provider.latitude),
              longitude: parseFloat(provider.longitude),
            }}
            title={provider.provider_name}>
            <Image
              source={require('../../assets/image/providerMarker.png')}
              style={{width: 40, height: 40}}
            />
          </Marker>
        ))}
      </MapView>
      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={['18%', '45%', '95%']}
        enableContentPanningGesture
        enableHandlePanningGesture>
        <View style={styles.contentContainer}>
          <FlatList
            data={categoryData}
            keyExtractor={(item, index) => item.id + index}
            renderItem={renderCategoryIcon}
            horizontal
            showsHorizontalScrollIndicator={false}
            // contentContainerStyle={{
            //   paddingVertical: 10,
            //   paddingHorizontal: 30,
            //   paddingEnd: 30,
            //   backgroundColor: 'white',
            // }}
            contentContainerStyle={{paddingHorizontal: 30, paddingVertical: 10}}
          />
          <FlatList
            data={providerList}
            keyExtractor={item => item.provider_id}
            contentContainerStyle={{backgroundColor: '#f2f2f2'}}
            renderItem={renderItem}
            style={{marginTop: 20}}
          />
        </View>
      </BottomSheet>
    </SafeAreaView>
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
    height: 500,
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
    paddingVertical: 10,
    backgroundColor: 'white',
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
