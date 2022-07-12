import {View, Text, StyleSheet, Button, Platform, TouchableOpacity} from 'react-native';
import React, {useRef, useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import BottomSheet, {
  BottomSheetModalProvider,
  BottomSheetModal,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import {LONGITUDE_DELTA, LATITUDE_DELTA, sleep, MAPBOXGS_ACCESS_TOKEN} from '../global';
import {WebView} from 'react-native-webview';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import MapView, {
  Marker,
  AnimatedRegion,
  MarkerAnimated,
  Animated,
  PROVIDER_DEFAULT,
  PROVIDER_GOOGLE,
  Polyline,
} from 'react-native-maps';
import {UserMarker, ProviderMarker} from '../components/Marker/Marker';
import {ShipperLocation} from '../assets/dummy/ShipperLocations';
import {ActivityIndicator, Provider} from 'react-native-paper';
import colors from '../colors/colors';
import {Header} from '../components/Layout/Header/Header';
import Feather from 'react-native-vector-icons/Feather';
import {OrderProgressBar, OrderProgressBarPickup} from '../components/Progress/OrderProgressBar';
import axios from 'axios';
import {ScrollView} from 'react-native-gesture-handler';

export const TestScreen = ({navigation}) => {
  const state = useSelector(state => state.UserReducer);
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [polyline, setPolyline] = useState([]);
  const bottomsheetRef = useRef();
  const mapref = useRef();

  const onMapLoaded = () => {
    mapref.current?.fitToCoordinates(
      [
        {
          latitude: state.userLocation.latitude,
          longitude: state.userLocation.longitude,
        },
        {
          // latitude: 10.766575409142378,
          // longitude: 106.69510799782778,
          latitude: 10.762496634175468,
          longitude: 106.68274002633785,
        },
      ],
      {
        edgePadding: {top: 40, right: 40, bottom: 40, left: 40},
        animated: true,
      },
    );

    axios
      .get(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${state.userLocation.longitude},${
          state.userLocation.latitude
        };${106.68274002633785},${10.762496634175468}?geometries=geojson&access_token=${MAPBOXGS_ACCESS_TOKEN}`,
      )
      .then(res => {
        let array = [];
        res.data.routes[0].geometry.coordinates.forEach(c => {
          array.push({
            latitude: c[1],
            longitude: c[0],
          });
        });
        setPolyline(array);
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, {justifyContent: 'center'}]}>
        <ActivityIndicator size={'large'} color={colors.boldred} />
      </SafeAreaView>
    );
  }

  return (
    <View style={[styles.container]}>
      <MapView
        ref={mapref}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        showsUserLocation
        mapType="terrain"
        initialRegion={{
          latitude: state.userLocation.latitude,
          longitude: state.userLocation.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }}
        onMapLoaded={() => onMapLoaded()}>
        <Marker
          coordinate={{
            latitude: state.userLocation.latitude,
            longitude: state.userLocation.longitude,
          }}>
          <UserMarker />
        </Marker>

        <Marker
          coordinate={{
            latitude: 10.762496634175468,
            longitude: 106.68274002633785,
          }}>
          <ProviderMarker />
        </Marker>

        {polyline ? (
          <Polyline
            coordinates={polyline}
            strokeColor="green" // fallback for when `strokeColors` is not supported by the map-provider
            strokeWidth={4}
          />
        ) : null}
      </MapView>

      <BottomSheet ref={bottomsheetRef} snapPoints={['30%', '90%']}>
        <BottomSheetScrollView>
          <View style={[styles.shipperInfo]}>
            <TouchableOpacity
              style={{
                padding: 5,
                position: 'absolute',
                top: -10,
                zIndex: 10,
              }}
              onPress={() => navigation.navigate('Home Page')}>
              <Feather name="arrow-left" size={20} color="black" />
            </TouchableOpacity>
            <View style={{width: '100%', alignItems: 'center', paddingHorizontal: 20}}>
              <Text style={{fontSize: 18, fontWeight: '500', marginBottom: 15}}>
                Order submitted
              </Text>
              <Text style={{textAlign: 'center'}}>Your order has been sent to the restaurant</Text>
            </View>

            <OrderProgressBarPickup
              submittedStatus={true}
              confirmedStatus={true}
              completedStatus={true}
            />

            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 20,
              }}>
              <View style={{width: '100%'}}>
                <Text style={{fontSize: 19, fontWeight: 'bold', textAlign: 'center'}}>
                  Your items
                </Text>
                <View
                  style={{
                    width: '100%',
                    paddingHorizontal: 20,
                    marginTop: 15,
                  }}>
                  {[1, 2, 3].map((item, index) => (
                    <View
                      key={index}
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 15,
                      }}>
                      <View style={{flexDirection: 'row', alignItems: 'center', width: '80%'}}>
                        <Text style={{fontSize: 16}}>{1}x</Text>
                        <View style={{width: '85%'}}>
                          <Text
                            style={{
                              marginLeft: 15,
                              fontSize: 17,
                              fontWeight: '600',
                            }}
                            numberOfLines={3}>
                            {'lorem ipsum'}
                          </Text>
                          {/* {additionalOptions[index] && (
                            <Text
                              style={{
                                marginLeft: 15,
                                fontStyle: 'italic',
                                color: 'gray',
                                marginTop: 10,
                              }}>
                              {additionalOptions[index]}
                            </Text>
                          )} */}
                          {item.special_instruction !== '' && (
                            <Text style={{marginTop: 10}}>Note: {'note'}</Text>
                          )}
                        </View>
                      </View>
                      <Text style={{fontWeight: '600', fontSize: 17}}>$10.00</Text>
                    </View>
                  ))}
                  <View
                    style={{
                      width: '100%',
                      paddingHorizontal: 20,
                      paddingVertical: 10,
                      borderColor: 'rgb(230,230,230)',
                      borderTopWidth: 1,
                      borderBottomWidth: 1,
                    }}>
                    <View style={styles.flexRowBetween}>
                      <Text style={{fontSize: 16, fontWeight: '500'}}>Subtotal ({2} items)</Text>
                      <Text style={{fontSize: 16, fontWeight: '500'}}>$10</Text>
                    </View>
                    <View style={styles.flexRowBetween}>
                      <Text style={{fontSize: 16, fontWeight: '500'}}>Delivery fee: 2.8km</Text>
                      <Text style={{fontSize: 16, fontWeight: '500'}}>$10</Text>
                    </View>
                    {/* <View style={styles.flexRowBetween}>
                      <Text style={{fontSize: 16, fontWeight: '500', color: '#AB2E15'}}>
                        Coupon
                      </Text>
                      <Text style={{fontSize: 16, fontWeight: '500', color: '#AB2E15'}}>-$1.5</Text>
                    </View> */}
                  </View>
                  <View
                    style={{
                      width: '100%',
                      paddingHorizontal: 20,
                      paddingVertical: 10,
                      borderColor: 'rgb(230,230,230)',
                      borderTopWidth: 1,
                      borderBottomWidth: 1,
                    }}>
                    <View style={styles.flexRowBetween}>
                      <Text style={{fontSize: 16, fontWeight: '500'}}>Total</Text>
                      <Text style={{fontSize: 16, fontWeight: '500'}}>$ 10</Text>
                    </View>
                  </View>
                  <View
                    style={{
                      width: '100%',
                      paddingHorizontal: 20,
                      paddingVertical: 10,
                      borderColor: 'rgb(230,230,230)',
                      borderTopWidth: 1,
                      borderBottomWidth: 1,
                    }}>
                    <View style={styles.flexRowBetween}>
                      <Text style={{fontSize: 16, fontWeight: '500'}}>Paid by</Text>
                      <Text style={{fontSize: 16, fontWeight: '500'}}>Cash</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </BottomSheetScrollView>
        <View
          style={{
            marginTop: 20,
            flexDirection: 'row',
            width: '100%',
            paddingHorizontal: 0,
            alignItems: 'center',
            justifyContent: 'center',
            paddingBottom: 30,
          }}>
          <TouchableOpacity
            onPress={() => handleCancelOrder()}
            style={{
              paddingHorizontal: 15,
              paddingVertical: 15,
              backgroundColor: colors.boldred,
              width: '40%',
            }}>
            <Text
              style={{
                fontWeight: 'bold',
                textAlign: 'center',
                color: 'white',
                fontSize: 16,
              }}>
              Cancel order
            </Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  remainingTime: {
    padding: 15,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#AB2E15',
    backgroundColor: 'white',
  },
  currentPositionButton: {
    position: 'absolute',
    top: '80%',
    left: '85%',
    padding: 10,
    borderRadius: 20,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#c6c6c6',
  },
  inputWrapper: {
    position: 'absolute',
    top: '10%',
    left: '0%',
    right: 0,
    width: '100%',
    paddingHorizontal: 20,
  },
  inputWrapper: {
    position: 'absolute',
    top: '10%',
    left: '0%',
    right: 0,
    width: '100%',
    paddingHorizontal: 20,
  },
  inputField: {
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderColor: 'black',
    borderWidth: 1,
  },
  shipperInfo: {
    width: '100%',
    backgroundColor: 'white',
    marginBottom: 30,
    // paddingVertical: 10,
  },
  remainingTime: {
    padding: 15,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#AB2E15',
    backgroundColor: 'white',
  },
  progress: {
    width: '100%',
    paddingHorizontal: 10,
    marginTop: 20,
    height: '10%',
  },
  flexRowBetween: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
