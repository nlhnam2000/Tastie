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
import {popularData} from '../../assets/dummy/popularData';
import {useDispatch, useSelector} from 'react-redux';
import {SetUserLocation, AutoSetLocation} from '../../store/action/auth';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import {BrowseCategory} from '../../components/Menu/BrowseCatergory';
import {CategoryList} from '../../components/Provider/CategoryList';
import {ProviderList} from '../../components/Provider/ProviderList';
import {Modalize} from 'react-native-modalize';
import axios from 'axios';
import {IP_ADDRESS} from '../../global';
import BottomSheet from '@gorhom/bottom-sheet';

const {width, height} = Dimensions.get('window');

export const PickupTab = props => {
  const [loading, setLoading] = useState(true);
  const state = useSelector(state => state.UserReducer);
  const [providerList, setProviderList] = useState([]);
  const bottomSheetRef = useRef();

  const renderCategoryIcon = ({item}) => {
    return (
      <TouchableOpacity style={{marginRight: 20, alignItems: 'center'}}>
        <Image source={item.image} style={{width: 60, height: 60}} />
        <Text>{item.title}</Text>
      </TouchableOpacity>
    );
  };

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => props.navigation.navigate('DetailProvider', {data: item})}
        style={styles.providerWrapper}>
        <ImageBackground
          source={{uri: item.profile_pic ?? item.avatar}}
          resizeMode="cover"
          style={{height: 200, width: width}}
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
          limit: 20,
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
            onPress={() => openUserLocationModalize()}
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
        loadingEnabled
        // onMapReady={() => {
        //   LoadNearByProvider(state.userLocation);
        // }}
        minZoomLevel={15}
        provider={PROVIDER_GOOGLE}
        style={styles.map}>
        {providerList.map((provider, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: parseFloat(provider.latitude),
              longitude: parseFloat(provider.longitude),
            }}>
            <Image
              source={require('../../assets/image/providerMarker.png')}
              style={{width: 40, height: 40}}
            />
          </Marker>
        ))}
      </MapView>
      <BottomSheet ref={bottomSheetRef} index={1} snapPoints={['18%', '45%', '95%']}>
        <View style={styles.contentContainer}>
          <FlatList
            data={categoryData}
            keyExtractor={(item, index) => item.id + index}
            renderItem={renderCategoryIcon}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{paddingVertical: 10, paddingStart: 30}}
          />
          <FlatList
            data={providerList}
            keyExtractor={item => item.provider_id}
            renderItem={renderItem}
            style={{marginTop: 20}}
          />
        </View>
      </BottomSheet>
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
    // paddingHorizontal: 15,
    paddingVertical: 10,
  },
});
