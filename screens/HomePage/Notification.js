import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
  StatusBar,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {NavigationBar} from '../../components/Menu/NavigationBar';
import Geolocation from 'react-native-geolocation-service';
import MapView, {PROVIDER_GOOGLE, Marker, Polyline} from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import Geocoder from 'react-native-geocoding';
import axios from 'axios';
import {GEOCODING_API, IP_ADDRESS, MAPBOXGS_ACCESS_TOKEN} from '../../global';
import {getDistance} from 'geolib';
import io from 'socket.io-client';
import {SimpleAlertDialog} from '../../components/Error/AlertDialog';
import {ShipperLocation} from '../../assets/dummy/ShipperLocations';

Geocoder.init('AIzaSyDRXvYbjscujWed7pBPKRGCIsmx922HTJI');
let socket;

export const Notification = props => {
  const [location, setLocation] = useState({latitude: 0, longitude: 0});
  const [markerLocation, setMarkerLocation] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [shipperLocation, setShipperLocation] = useState({});
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState('Road');
  const [notification, setNotification] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [polyline, setPolyline] = useState(null);

  const mapRef = useRef();

  const getGeolocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      err => {
        alert(err.message);
      },
      {enableHighAccuracy: true},
    );
  };

  const getDirection = async (fromLocation, toLocation) => {
    let res = await axios.get(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${fromLocation.longitude},${fromLocation.latitude};${toLocation.longitude},${toLocation.latitude}?geometries=geojson&access_token=${MAPBOXGS_ACCESS_TOKEN}`,
    );
    console.log(res.data.routes[0].geometry.coordinates);
    let array = [];
    res.data.routes[0].geometry.coordinates.forEach(c => {
      array.push({
        latitude: c[1],
        longitude: c[0],
      });
    });
    setPolyline(array);
    // setPolyline([...res.data.routes[0].geometry.coordinates]);
  };

  const getAddressString = async event => {
    console.log('New location', event.nativeEvent.coordinate);
    setLocation({
      latitude: event.nativeEvent.coordinate.latitude,
      longitude: event.nativeEvent.coordinate.longitude,
    });
    let res = await axios.get(
      `https://api.opencagedata.com/geocode/v1/json?q=${event.nativeEvent.coordinate.latitude}+${event.nativeEvent.coordinate.longitude}&key=${GEOCODING_API}`,
    );
    if (res.data.status.code === 200) {
      console.log('success', res.data.results[0]);
      setAddress(res.data.results[0].formatted);
    }
  };

  const focusToLocation = () => {
    setLocation({latitude: 12.203214000000004, longitude: 109.19345021534353});
  };

  const onRegionChange = event => {
    setMarkerLocation({
      latitude: event.latitude,
      longitude: event.longitude,
    });
  };

  const setMarker = event => {
    setMarkerLocation({
      latitude: event.nativeEvent.coordinate.latitude,
      longitude: event.nativeEvent.coordinate.longitude,
    });
    console.log('markerLocation', markerLocation);
  };

  useEffect(() => {
    socket = io(`http://${IP_ADDRESS}:3007`);

    setTimeout(async () => {
      if (Platform.OS === 'ios') {
        let permission = await Geolocation.requestAuthorization('whenInUse');
        if (permission === 'granted') {
          getGeolocation();
        }
      } else {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Example App',
              message: 'Example App access to your location ',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            getGeolocation();
          } else {
            console.log('location permission denied');
            alert('Location permission denied');
          }
        } catch (err) {
          console.warn(err);
        }
      }
      console.log('Lat and long: ' + location.latitude + ' ' + location.longitude);
    }, 200);
    setTimeout(() => {
      socket.on('shipperLocation', data => {
        console.log('Shipper location:', data);
        setShipperLocation(prevState => ({
          ...prevState,
          latitude: data.latitude,
          longitude: data.longitude,
          shipperName: data.shipperName,
        }));
      });
      socket.on('shipper-has-arrived', message => {
        setNotification(message);
        setOpenModal(true);
      });
      // mapRef.current.fitToElements(true);
      setLoading(false);
    }, 2000);

    // return () => {
    //   Geolocation.clearWatch(watchID);
    // };
  }, []);

  useEffect(() => {
    if (location.latitude !== 0 && location.longitude !== 0) {
      console.log('send location to shipper');
      socket.emit('send-location', location);
    }
  }, [location]);

  useEffect(() => {
    console.log('Shipper location changed', shipperLocation);
  }, [shipperLocation]);

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={[styles.container, {backgroundColor: 'transparent'}]}>
          <StatusBar barStyle="dark-content" />
          <ActivityIndicator size={'large'} color={'red'} />
        </View>
        <NavigationBar active={props.tabname} />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <MapView
          provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          style={styles.map}
          // minZoomLevel={17}
          // onPress={event => getAddressString(event)}
          onPress={event => setMarker(event)}
          showsUserLocation
          initialRegion={{
            latitude: 12.203214000000004,
            longitude: 109.19345021534353,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}
          region={
            shipperLocation.shipperName
              ? {
                  latitude: shipperLocation.latitude,
                  longitude: shipperLocation.longitude,
                  latitudeDelta: 0.015,
                  longitudeDelta: 0.0121,
                }
              : {
                  latitude: location.latitude,
                  longitude: location.longitude,
                  latitudeDelta: 0.015,
                  longitudeDelta: 0.0121,
                }
          }
          // onRegionChange={event => onRegionChange(event)}
          ref={mapRef}>
          {shipperLocation.latitude ? (
            <Marker
              coordinate={{
                latitude: shipperLocation.latitude,
                longitude: shipperLocation.longitude,
              }}
              // image={(require('../../assets/image/shipperMarker.png'), {width: '100', height: '100'})}
              title={shipperLocation.shipperName}
              description="Your order will be comming soon !">
              <Image
                source={require('../../assets/image/shipperMarker.png')}
                style={{width: 30, height: 30}}
              />
            </Marker>
          ) : null}
          {markerLocation.latitude !== 0 && markerLocation.longitude !== 0 ? (
            <Marker
              coordinate={{
                latitude: markerLocation.latitude,
                longitude: markerLocation.longitude,
              }}
            />
          ) : null}
          {polyline ? (
            <Polyline
              coordinates={polyline}
              strokeColor="green" // fallback for when `strokeColors` is not supported by the map-provider
              strokeWidth={6}
            />
          ) : null}
          {/* <Polyline
            coordinates={ShipperLocation}
            strokeColor="green" // fallback for when `strokeColors` is not supported by the map-provider
            strokeWidth={6}
          /> */}
        </MapView>
        <TouchableOpacity style={styles.currentPositionButton} onPress={() => focusToLocation()}>
          <Feather name="navigation" size={20} color={'black'} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.currentPositionButton, {top: '70%'}]}
          // onPress={() => getDistanceLocation(location, markerLocation)}
          onPress={() => getDirection(markerLocation, location)}>
          <Feather name="navigation-2" size={20} color={'black'} />
        </TouchableOpacity>
        {/* <View style={styles.inputWrapper}>
          <TextInput style={styles.inputField} value={address} editable />
        </View> */}
        {/* Alert Dialog here */}
        <SimpleAlertDialog
          message={notification}
          visible={openModal}
          onCancel={() => setOpenModal(false)}
        />
      </View>
      <NavigationBar active={props.tabname} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
  },

  map: {
    width: '100%',
    height: '100%',
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
});
