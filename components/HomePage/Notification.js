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
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {NavigationBar} from '../Menu/NavigationBar';
import Geolocation from 'react-native-geolocation-service';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import Geocoder from 'react-native-geocoding';
import axios from 'axios';
import {GEOCODING_API} from '../../global';

Geocoder.init('AIzaSyDRXvYbjscujWed7pBPKRGCIsmx922HTJI');

export const Notification = props => {
  const [location, setLocation] = useState({latitude: 0, longitude: 0});
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState('Road');

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
    setLocation({
      latitude: event.latitude,
      longitude: event.longitude,
    });
  };

  useEffect(() => {
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
      console.log(
        'Lat and long: ' + location.latitude + ' ' + location.longitude,
      );
    }, 200);
    setTimeout(() => {
      setLoading(false);
    }, 2000);

    // return () => {
    //   Geolocation.clearWatch(watchID);
    // };
  }, []);

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
          minZoomLevel={17}
          onPress={event => getAddressString(event)}
          showsUserLocation
          initialRegion={{
            latitude: 12.203214000000004,
            longitude: 109.19345021534353,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}
          region={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}
          // onRegionChange={event => onRegionChange(event)}
        >
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title="You are here"
            description="This is your location"
          />
        </MapView>
        <TouchableOpacity
          style={styles.currentPositionButton}
          onPress={() => focusToLocation()}>
          <Feather name="navigation" size={20} color={'black'} />
        </TouchableOpacity>
        <View style={styles.inputWrapper}>
          <TextInput style={styles.inputField} value={address} editable />
        </View>
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

//12.203214000000004, 109.19345021534353
// 10.766593900159473 106.69504882698446
