import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Dimensions,
  ActivityIndicator,
  Platform,
} from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
import Geolocation from '@react-native-community/geolocation';

MapboxGL.setAccessToken(
  'pk.eyJ1IjoiaG9hbmduYW0yNDMiLCJhIjoiY2t1dHJxdjdlMHg5ZDJwbnlpcmo0a2NnMiJ9.DUrlIOzvO6-kWt-VCKZW1g',
);

export const UserMap = ({navigation}) => {
  const [longitude, setLongitude] = useState(0);
  const [latitude, setLatitude] = useState(0);
  const [loading, setLoading] = useState(true);

  const onLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        setLongitude(position.coords.longitude);
        setLatitude(position.coords.latitude);
        alert(longitude + ' and ' + latitude);
      },
      error => {
        alert('Cannot load location');
      },
      {
        enableHighAccuracy: false,
      },
    );
  };

  const applyLocation = () => {
    watchID = Geolocation.watchPosition(
      position => {
        setLongitude(position.coords.longitude);
        setLatitude(position.coords.latitude);
      },
      error => {
        alert('error');
      },
      {
        enableHighAccuracy: false,
      },
    );
  };

  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'ios') {
        onLocation();
        applyLocation();
      } else {
        // for android implementation
      }
    };

    requestLocationPermission();

    return () => {
      Geolocation.clearWatch(watchID);
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.mapWrapper}>
        <MapboxGL.MapView style={styles.map} preferredFramesPerSecond={60}>
          <MapboxGL.Camera
            zoomLevel={18}
            centerCoordinate={[longitude, latitude]}></MapboxGL.Camera>
          <MapboxGL.PointAnnotation
            id={'Current position'}
            coordinate={[longitude, latitude]}></MapboxGL.PointAnnotation>
        </MapboxGL.MapView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  mapWrapper: {
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    backgroundColor: 'tomato',
  },
  map: {
    flex: 1,
  },
});
