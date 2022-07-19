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
import {UserMarker, ProviderMarker, ShipperMarker} from '../components/Marker/Marker';
import {ActivityIndicator, Provider} from 'react-native-paper';
import colors from '../colors/colors';
import {Header} from '../components/Layout/Header/Header';
import Feather from 'react-native-vector-icons/Feather';
import {OrderProgressBar, OrderProgressBarPickup} from '../components/Progress/OrderProgressBar';
import axios from 'axios';
import {ShipperLocation} from '../assets/dummy/ShipperLocations';

export const TestScreen = ({navigation}) => {
  const state = useSelector(state => state.UserReducer);
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [polyline, setPolyline] = useState([]);
  const [location, setlocation] = useState(
    new AnimatedRegion({
      latitude: ShipperLocation[0].latitude,
      longitude: ShipperLocation[0].longitude,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    }),
  );
  const bottomsheetRef = useRef();
  const mapref = useRef();
  const markerRef = useRef();

  const animateMarker = async () => {
    for (let i = 0; i < ShipperLocation.length; i++) {
      if (Platform.OS === 'ios') {
        location.timing({...ShipperLocation[i], duration: 500}).start();

        await sleep(1000);
      } else {
        markerRef.current?.animateMarkerToCoordinate(ShipperLocation[i], 500);
        await sleep(1000);
      }
    }
  };

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
          latitude: location.longitude,
          longitude: location.latitude,
        },
      ],
      {
        edgePadding: {top: 40, right: 40, bottom: 40, left: 40},
        animated: true,
      },
    );

    axios
      .get(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${state.userLocation.longitude},${state.userLocation.latitude};${location.longitude},${location.longitude}?geometries=geojson&access_token=${MAPBOXGS_ACCESS_TOKEN}`,
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
          latitude: location.latitude.__getValue(),
          longitude: location.longitude.__getValue(),
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }}
        // onMapLoaded={() => onMapLoaded()}
      >
        <Marker
          coordinate={{
            latitude: state.userLocation.latitude,
            longitude: state.userLocation.longitude,
          }}>
          <UserMarker />
        </Marker>

        <Marker.Animated coordinate={location} ref={markerRef}>
          <ProviderMarker />
        </Marker.Animated>

        {polyline ? (
          <Polyline
            coordinates={polyline}
            strokeColor="green" // fallback for when `strokeColors` is not supported by the map-provider
            strokeWidth={4}
          />
        ) : null}
      </MapView>
      <Button title="go" onPress={() => animateMarker()} />
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
    height: '90%',
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
