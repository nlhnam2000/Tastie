import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Platform,
  PermissionsAndroid,
  Image,
} from 'react-native';
import colors from '../colors/colors';
import Feather from 'react-native-vector-icons/Feather';
import io from 'socket.io-client';
import {IP_ADDRESS} from '../global';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import {SimpleAlertDialog} from '../components/Error/AlertDialog';
import {useSelector, useDispatch} from 'react-redux';

let socket;

export const OrderStatus = props => {
  const state = useSelector(state => state.UserReducer);
  const [loading, setLoading] = useState(true);
  const {order} = props.route.params;
  const [location, setLocation] = useState({latitude: 0, longitude: 0});
  const [shipperLocation, setShipperLocation] = useState({});
  const [notification, setNotification] = useState(null);
  const [openModal, setOpenModal] = useState(false);

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

  useEffect(() => {
    const initialMap = async () => {
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
      socket = io(`http://${IP_ADDRESS}:3007`);
      if (order !== undefined || order !== null) {
        socket.emit('customer-submit-order', order, {
          customerName: state.first_name + ' ' + state.last_name,
          customerPhone: state.phone,
          location: {
            latitude: 12.203214000000004,
            longitude: 109.19345021534353,
          },
        });
      }

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
      socket.on('order-accepted', message => {
        setNotification(message);
        setOpenModal(true);
      });
      socket.on('shipper-arrived-provider', message => {
        setNotification(message);
        setOpenModal(true);
      });
      socket.on('shipper-on-the-way', message => {
        setNotification(message);
        setOpenModal(true);
      });

      console.log(order);
      setLoading(false);
    };

    initialMap();
    return () => {
      socket.disconnect();
    };
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size={'large'} color={colors.red} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        showsUserLocation
        provider={PROVIDER_GOOGLE}
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
        minZoomLevel={13}>
        {shipperLocation.latitude ? (
          <Marker
            coordinate={{
              latitude: shipperLocation.latitude,
              longitude: shipperLocation.longitude,
            }}
            title={shipperLocation.shipperName}
            description="Your order will be comming soon !">
            <Image
              source={require('../assets/image/shipperMarker.png')}
              style={{width: 30, height: 30}}
            />
          </Marker>
        ) : null}
      </MapView>
      <SimpleAlertDialog
        message={notification}
        visible={openModal}
        onCancel={() => setOpenModal(false)}
      />
      <TouchableOpacity
        style={{
          padding: 5,
          borderRadius: 40,
          borderColor: 'black',
          borderWidth: 1,
          backgroundColor: 'white',
          position: 'absolute',
          top: '5%',
          left: '2%',
        }}
        onPress={() => props.navigation.goBack()}>
        <Feather name="arrow-left" size={20} color="black" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  headerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
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
