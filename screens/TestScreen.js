import {View, Text, StyleSheet, Button, Platform} from 'react-native';
import React, {useRef, useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import BottomSheet, {BottomSheetModalProvider, BottomSheetModal} from '@gorhom/bottom-sheet';
import {LONGITUDE_DELTA, LATITUDE_DELTA, sleep} from '../global';
import {WebView} from 'react-native-webview';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import MapView, {
  Marker,
  AnimatedRegion,
  MarkerAnimated,
  Animated,
  PROVIDER_DEFAULT,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import {UserMarker, ProviderMarker} from '../components/Marker/Marker';
import {ShipperLocation} from '../assets/dummy/ShipperLocations';

const handleComponent = () => {
  return (
    <View
      style={{
        backgroundColor: 'white',
        padding: 10,
        marginTop: -30,
        width: '25%',
        borderRadius: 50,
        alignSelf: 'center',
      }}>
      <View style={styles.remainingTime}>
        <Text style={{fontSize: 17, fontWeight: '500', textAlign: 'center'}}>14 mins</Text>
      </View>
    </View>
  );
};

export default function TestScreen(props) {
  const state = useSelector(state => state.UserReducer);
  const [location, setLocation] = useState(
    new AnimatedRegion({
      latitude: ShipperLocation[0].latitude,
      longitude: ShipperLocation[0].longitude,
    }),
  );
  const [currentLocation, setCurrentLocation] = useState({
    latitude: location.latitude.__getValue(),
    longitude: location.longitude.__getValue(),
  });
  const [mapProvider, setMapProvider] = useState(PROVIDER_DEFAULT);
  const bottomSheetRef = useRef();
  const insets = useSafeAreaInsets();
  const mapRef = useRef();
  const markerRef = useRef();

  // useEffect(() => {
  //   if (mapRef.current) {
  //     mapRef.current.fitToCoordinates(
  //       [
  //         {
  //           latitude: currentLocation.latitude,
  //           longitude: currentLocation.longitude,
  //         },
  //         {
  //           latitude: ShipperLocation.at(-1).latitude,
  //           longitude: ShipperLocation.at(-1).longitude,
  //         },
  //       ],
  //       {
  //         edgePadding: {top: 20, right: 20, bottom: 20, left: 20},
  //         animated: true,
  //       },
  //     );
  //   }
  // }, [currentLocation]);

  var newLocation = {
    latitude: 10.762496634175468,
    longitude: 106.68274002633785,
    // latitudeDelta: LATITUDE_DELTA,
    // longitudeDelta: LONGITUDE_DELTA,
  };

  const animateMarker = async () => {
    if (Platform.OS === 'android') {
      markerRef.current.animateMarkerToCoordinate(newLocation, 4000); //  number of duration between points
    } else {
      for (let i = 1; i < ShipperLocation.length; i++) {
        setCurrentLocation(ShipperLocation[i]);
        location.timing({...ShipperLocation[i], duration: 500}).start();

        await sleep(3000);
      }
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        showsUserLocation
        provider={mapProvider}
        initialRegion={{
          latitude: ShipperLocation[0].latitude,
          longitude: ShipperLocation[0].longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }}
        region={{
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }}
        onMapReady={() => setMapProvider(PROVIDER_GOOGLE)}
        // onMapLoaded={() => {
        //   mapRef.current.fitToCoordinates(
        //     [
        //       {
        //         latitude: location.latitude.__getValue(),
        //         longitude: location.longitude.__getValue(),
        //       },
        //       {
        //         latitude: newLocation.latitude,
        //         longitude: newLocation.longitude,
        //       },
        //     ],
        //     {
        //       edgePadding: {top: 40, right: 20, bottom: 20, left: 20},
        //       animated: true,
        //     },
        //   );
        // }}
      >
        <MarkerAnimated zIndex={0} ref={markerRef} coordinate={location}></MarkerAnimated>
        {/* <Marker.Animated zIndex={1} coordinate={newLocation}>
          <ProviderMarker />
        </Marker.Animated> */}
        <Marker coordinate={ShipperLocation.at(-1)} zIndex={1}>
          <UserMarker />
        </Marker>
      </MapView>
      <Button title="Move" onPress={() => animateMarker()} />
    </View>
  );
}

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
    height: '40%',
    backgroundColor: 'white',
    marginBottom: 30,
    paddingVertical: 20,
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
