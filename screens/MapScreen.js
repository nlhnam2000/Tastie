import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Header} from '../components/Layout/Header/Header';
import {SetUserLocation} from '../store/action/auth';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import {useSelector, useDispatch} from 'react-redux';
import colors from '../colors/colors';
import axios from 'axios';
import {GEOAPIFY} from '../global';

const {width, height} = Dimensions.get('window');
const MAP_HEIGHT = height - 300;

export const MapScreen = props => {
  // const insets = useSafeAreaInsets();
  const state = useSelector(state => state.UserReducer);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const {address, fromScreen} = props.route.params;
  const [markerLocation, setMarkerLocation] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121,
    formatted: '',
  });

  //   if (loading) {
  //     <View style={styles.container}>
  //       <ActivityIndicator size={'large'} color={colors.boldred} />
  //     </View>;
  //   }

  useEffect(() => {
    const LoadLocation = async () => {
      let queryAddress = address !== '' ? address : state.userLocation.address;
      const res = await axios.get(
        `https://api.geoapify.com/v1/geocode/search?limit=1&apiKey=${GEOAPIFY}&text=${queryAddress}, thành phố Hồ Chí Minh`,
      );

      setMarkerLocation(prev => ({
        ...prev,
        latitude: res.data.features[0].geometry.coordinates[1],
        longitude: res.data.features[0].geometry.coordinates[0],
        formatted: res.data.features[0].properties.formatted,
      }));
    };

    LoadLocation();
  }, []);

  return (
    <View style={[styles.container, {}]}>
      <Header title="Add your address" goBack {...props} />
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: state.userLocation.latitude,
          longitude: state.userLocation.longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }}
        region={markerLocation}
        showsUserLocation
        showsMyLocationButton
        minZoomLevel={17}
        mapType="terrain"
        loadingEnabled>
        <Marker coordinate={markerLocation} />
      </MapView>
      <View style={styles.infoWrapper}>
        <View>
          <Text style={{color: 'gray', marginBottom: 5}}>Delivery to</Text>
          <Text style={{fontWeight: 'bold', fontSize: 18, marginBottom: 5}}>
            {address !== '' ? address : state.userLocation.address}
          </Text>
          <Text style={{color: 'gray', marginBottom: 5}}>{markerLocation.formatted}</Text>
        </View>
        <TouchableOpacity
          style={{width: '100%', backgroundColor: 'black', padding: 15}}
          onPress={() => {
            dispatch(
              SetUserLocation({
                address: address !== '' ? address : state.userLocation.address,
                latitude: markerLocation.latitude,
                longitude: markerLocation.longitude,
              }),
            );
            if (fromScreen === 'checkout') {
              props.navigation.navigate('GoToCheckout');
            } else {
              props.navigation.navigate('Home Page');
            }
          }}>
          <Text style={{textAlign: 'center', color: 'white', fontWeight: '500', fontSize: 17}}>
            Confirm
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  map: {
    width: width,
    height: MAP_HEIGHT,
  },
  infoWrapper: {
    width,
    padding: 15,
    justifyContent: 'space-between',
    height: height - MAP_HEIGHT - 100,
  },
});
