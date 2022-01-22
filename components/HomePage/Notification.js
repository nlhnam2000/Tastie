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
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {NavigationBar} from '../Menu/NavigationBar';
import Geolocation from 'react-native-geolocation-service';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import Geocoder from 'react-native-geocoding';

Geocoder.init('AIzaSyDRXvYbjscujWed7pBPKRGCIsmx922HTJI');

export const Notification = props => {
  const [lat, setLat] = useState(0);
  const [long, setLong] = useState(0);
  const [loading, setLoading] = useState(true);

  let mapviewRef = useRef();

  const GetLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      let permission = await Geolocation.requestAuthorization('whenInUse');
      console.log(permission);
    }
  };

  const getGeolocation = () => {
    Geolocation.watchPosition(
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

  const onClickLocation = event => {
    // console.log(event.nativeEvent.coordinate);
    setLat(event.nativeEvent.coordinate.latitude);
    setLong(event.nativeEvent.coordinate.longitude);
  };

  const getAddressString = async event => {
    // let result = await mapviewRef.current.addressForCoordinate({
    //   latitude: event.nativeEvent.coordinate.latitude,
    //   longitude: event.nativeEvent.coordinate.longitude,
    // });
    // console.log(result);
    mapviewRef.current
      .addressForCoordinate({
        latitude: 12.203214000000004,
        longitude: 109.19345021534353,
      })
      .then(address => console.log(address));
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
      // Geocoder.from('Colosseum')
      //   .then(json => {
      //     var location = json.results[0].geometry.location;
      //     console.log(location);
      //   })
      //   .catch(error => console.warn(error));
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
          // onPress={onClickLocation}
          onPress={event => getAddressString(event)}
          showsUserLocation
          region={{
            latitude: lat,
            longitude: long,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}>
          {/* <Marker
            coordinate={{latitude: lat, longitude: long}}
            title="You are here"
            description="This is your location"
            draggable
            onDragEnd={e =>
              console.log(JSON.stringify(e.nativeEvent.coordinate))
            }
          /> */}
          <TouchableOpacity
            style={styles.currentPositionButton}
            onPress={() => getGeolocation()}>
            <Feather name="navigation" size={20} color={'black'} />
          </TouchableOpacity>
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
  currentPositionButton: {
    position: 'absolute',
    top: '80%',
    left: '89%',
    padding: 10,
    borderRadius: 20,
    backgroundColor: 'white',
  },
});

//12.203214000000004, 109.19345021534353
// 10.766593900159473 106.69504882698446
