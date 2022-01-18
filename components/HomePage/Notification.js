import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import {NavigationBar} from '../Menu/NavigationBar';
import Geolocation from 'react-native-geolocation-service';

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
    }, 200);

    setLoading(false);
    // return () => {
    //   Geolocation.clearWatch(watchID);
    // };
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <ActivityIndicator size={'large'} color={'red'} />
        </View>
        <NavigationBar active={props.tabname} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text>latitude: {lat}</Text>
        <Text>Longitude: {long}</Text>
        <Text>Hello</Text>
      </View>
      <NavigationBar active={props.tabname} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
});
