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
  Dimensions,
} from 'react-native';
import colors from '../colors/colors';
import Feather from 'react-native-vector-icons/Feather';
import io from 'socket.io-client';
import {IP_ADDRESS, MAPBOXGS_ACCESS_TOKEN} from '../global';
import MapView, {Marker, PROVIDER_GOOGLE, Polyline} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import {SimpleAlertDialog, SingleDialog} from '../components/Error/AlertDialog';
import {useSelector, useDispatch} from 'react-redux';
import axios from 'axios';

let socket;
const {width, height} = Dimensions.get('window');

export const OrderStatus = props => {
  const state = useSelector(state => state.UserReducer);
  const [loading, setLoading] = useState(true);
  const {order} = props.route.params;
  const [location, setLocation] = useState({latitude: 0, longitude: 0});
  const [shipperLocation, setShipperLocation] = useState({});
  const [notification, setNotification] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [polyline, setPolyline] = useState(null);
  const [waiting, setWaiting] = useState(true);
  const [confirmedStatus, setConfirmedStatus] = useState(false);
  const [prepairingStatus, setPrepairingStatus] = useState(false);
  const [inDeliveryStatus, setInDeliveryStatus] = useState(false);
  const [doneStatus, setDoneStatus] = useState(false);

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
        setDoneStatus(true);
      });
      socket.on('order-accepted', message => {
        setWaiting(false);
        // setNotification(message);
        // setOpenModal(true);
        setConfirmedStatus(true);
      });
      socket.on('shipper-arrived-provider', message => {
        // setNotification(message);
        // setOpenModal(true);
        setPrepairingStatus(true);
      });
      socket.on('shipper-on-the-way', message => {
        // setNotification(message);
        // setOpenModal(true);
        setInDeliveryStatus(true);
      });
      socket.on('shipper-almost-arrived', message => {
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

  useEffect(() => {
    if (shipperLocation.latitude && shipperLocation.longitude) {
      axios
        .get(
          `https://api.mapbox.com/directions/v5/mapbox/driving/${shipperLocation.longitude},${shipperLocation.latitude};${location.longitude},${location.latitude}?geometries=geojson&access_token=${MAPBOXGS_ACCESS_TOKEN}`,
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
    }
  }, [shipperLocation]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size={'large'} color={colors.red} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
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
          {polyline ? (
            <Polyline
              coordinates={polyline}
              strokeColor="green" // fallback for when `strokeColors` is not supported by the map-provider
              strokeWidth={6}
            />
          ) : null}
        </MapView>
        <SimpleAlertDialog
          message={notification}
          visible={openModal}
          onCancel={() => setOpenModal(false)}
        />
        {/* <SingleDialog
          message={'We are finding the shipper for you. Please wait for a while'}
          visible={waiting}
          onCancel={() => setWaiting(false)}
        /> */}
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

      <View style={styles.shipperInfo}>
        {waiting ? (
          <View
            style={{
              justifyContent: 'space-around',
              alignItems: 'center',
              height: '100%',
              paddingHorizontal: 20,
            }}>
            <Text style={{fontWeight: '600', fontSize: 18, textAlign: 'center', marginBottom: 10}}>
              We are finding the shipper for you. Please wait for a second
            </Text>
            <ActivityIndicator size={'large'} color={colors.red} />
          </View>
        ) : (
          <>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                paddingHorizontal: 20,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Image
                  source={require('../assets/image/shipperMarker.png')}
                  style={{width: 30, height: 30}}
                />

                <Text style={{fontWeight: '600', fontSize: 18, marginLeft: 20}}>
                  {shipperLocation.shipperName}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  onPress={() => props.navigation.navigate('DetailOrder')}
                  style={{borderRadius: 40, padding: 10, borderWidth: 1, borderColor: 'black'}}>
                  <Feather name="message-square" size={20} color={'black'} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.shipperProgress}>
              {/* <View style={styles.progressbar}></View> */}
              <View style={[styles.progressName, {opacity: confirmedStatus ? 1 : 0.2}]}>
                <Text style={{textAlign: 'center', fontWeight: 'bold'}}>Confirmed</Text>
              </View>
              <View style={[styles.progressName, {opacity: prepairingStatus ? 1 : 0.2}]}>
                <Text style={{textAlign: 'center', fontWeight: 'bold'}}>Prepairing</Text>
              </View>
              <View style={[styles.progressName, {opacity: inDeliveryStatus ? 1 : 0.2}]}>
                <Text style={{textAlign: 'center', fontWeight: 'bold'}}>In delivery</Text>
              </View>
              <View style={[styles.progressName, {opacity: doneStatus ? 1 : 0.2}]}>
                <Text style={{textAlign: 'center', fontWeight: 'bold'}}>Done</Text>
              </View>
            </View>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: '100%',
    backgroundColor: 'white',
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
  shipperInfo: {
    width: '100%',
    height: '20%',
    backgroundColor: 'white',
    marginBottom: 30,
    paddingVertical: 20,
    justifyContent: 'space-between',
  },
  shipperProgress: {
    // marginTop: 30,
    // flexBasis: '17%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    // height: '100%',
    width,
  },
  progressbar: {
    height: 5,
    backgroundColor: 'green',
    width: '100%',
  },
  progressName: {
    paddingTop: 10,
    borderTopWidth: 2,
    borderTopColor: 'black',
    paddingHorizontal: 2,
    // backgroundColor: 'red',
    // borderWidth: 1,
    width: '25%',
  },
});
