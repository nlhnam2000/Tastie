import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
  StatusBar,
} from 'react-native';
import {NavigationBar} from '../Menu/NavigationBar';
import Geolocation from 'react-native-geolocation-service';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps

export const Notification = props => {
  const [lat, setLat] = useState(0);
  const [long, setLong] = useState(0);
  const [loading, setLoading] = useState(true);

  const GetLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      let permission = await Geolocation.requestAuthorization('whenInUse');
      console.log(permission);
    }
  };

  const getGeolocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        setLat(position.coords.latitude);
        setLong(position.coords.longitude);
      },
      err => {
        alert(err.message);
      },
      {enableHighAccuracy: true},
    );
  };

  useEffect(() => {
    setTimeout(async () => {
      if (Platform.OS === 'ios') {
        await GetLocationPermission();
        getGeolocation();
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
      console.log('Lat and long: ' + lat + ' ' + long);
      // setLoading(false);
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
        <View style={styles.container}>
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
          region={{
            latitude: lat,
            longitude: long,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}>
          <Marker
            coordinate={{latitude: lat, longitude: long}}
            title="You are here"
            description="This is your location"
          />
        </MapView>
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
});

//12.203214000000004, 109.19345021534353
// 10.766593900159473 106.69504882698446
