import React, {useState, useEffect, useRef} from 'react';
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
import {ScrollView} from 'react-native-gesture-handler';
import {OrderCompleted} from '../store/action/cart';
import {OrderProgressBar} from '../components/Progress/OrderProgressBar';

let socket;
const {width, height} = Dimensions.get('window');

export const OrderStatus = props => {
  const state = useSelector(state => state.UserReducer);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const {order} = props.route.params;
  const [location, setLocation] = useState({latitude: 0, longitude: 0});
  const [shipperLocation, setShipperLocation] = useState({});
  const [notification, setNotification] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [polyline, setPolyline] = useState(null);
  const [waiting, setWaiting] = useState(true);
  const [submittedStatus, setSubmittedStatus] = useState(true);
  const [confirmedStatus, setConfirmedStatus] = useState(false);
  const [assignedStatus, setAssignedStatus] = useState(false);
  const [pickedStatus, setPickedStatus] = useState(false);
  const [completedStatus, setCompletedStatus] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [additionalOptions, setAdditionalOptions] = useState([]);
  const [trackingMessage, setTrackingMessage] = useState({
    title: 'Order submitted',
    message: `Your order from ${state.userCart.provider_name} has been placed.`,
  });

  const mapRef = useRef();
  const scrollRef = useRef();

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

  const totalCartPrice = cart => {
    let price = 0.0;
    for (let i = 0; i < cart.length; i++) {
      price += parseFloat(cart[i].totalProductPrice);
    }

    return price.toFixed(2);
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
      socket = io(`http://${IP_ADDRESS}:3015`);
      if (order !== undefined || order !== null) {
        socket.emit(
          'customer-submit-order',
          order,
          {
            name: state.first_name + ' ' + state.last_name,
            phone: state.phone,
            address: state.userLocation.address,
            location: {
              latitude: state.userLocation.latitude,
              longitude: state.userLocation.longitude,
            },
          },
          {
            name: state.userCart.provider_name,
            address: '135B Tran Hung Dao, Cau Ong Lanh, District 1',
            location: {
              latitude: 10.770426270078108,
              longitude: 106.69433674255707,
            },
          },
        );
      }

      socket.on('shipperLocation', data => {
        console.log('Shipper location:', data);
        setShipperLocation(prevState => ({
          ...prevState,
          latitude: data.latitude,
          longitude: data.longitude,
          shipperName: data.shipperName,
        }));
        mapRef.current.fitToCoordinates(
          [
            {
              latitude: state.userLocation.latitude,
              longitude: state.userLocation.longitude,
            },
            {
              latitude: shipperLocation.latitude,
              longitude: shipperLocation.longitude,
            },
            {
              // restaurant's location
              latitude: 10.770426270078108,
              longitude: 106.69433674255707,
            },
          ],
          {
            edgePadding: {top: 100, right: 100, bottom: 100, left: 100},
            animated: true,
          },
        );
      });
      socket.on('shipper-has-arrived', message => {
        setNotification(message);
        setOpenModal(true);
        setCompletedStatus(true);
        setTrackingMessage(prev => ({
          ...prev,
          title: 'Order completed',
          message: 'The shipper has arrived to your place.',
        }));
      });
      socket.on('order-accepted', message => {
        setWaiting(false);
        // setNotification(message);
        // setOpenModal(true);
        setSubmittedStatus(true);
      });
      socket.on('shipper-arrived-provider', message => {
        // setNotification(message);
        // setOpenModal(true);
        // setPrepairingStatus(true);
        setConfirmedStatus(true);
        setTrackingMessage(prev => ({
          ...prev,
          title: 'Order confirmed',
          message: 'The restaurant had confirmed your order and is prepairing your order. ',
        }));
      });
      socket.on('order-assigned', () => {
        setAssignedStatus(true);
        setTrackingMessage(prev => ({
          ...prev,
          title: 'Order assigned',
          message: 'We have found the shipper for you. Please wait for a moment',
        }));
      });
      socket.on('shipper-on-the-way', message => {
        // setNotification(message);
        // setOpenModal(true);
        // setInDeliveryStatus(true);
        setPickedStatus(true);
        setTrackingMessage(prev => ({
          ...prev,
          title: 'Order picked',
          message: 'The shipper is on the way to your place. Your order will come to you soon',
        }));
      });
      // socket.on('shipper-almost-arrived', message => {
      //   setNotification(message);
      //   setOpenModal(true);
      // });

      console.log(order);

      let list = [];
      state.userCart.cart.forEach(cart => {
        let optionItemName = [];
        cart.additionalOptions.forEach(additionalOption => {
          additionalOption.options.forEach(option => {
            optionItemName.push(option.optionItemName);
          });
        });
        list.push(optionItemName.toString().split(',').join(', '));
      });
      setAdditionalOptions(list);

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

  useEffect(() => {
    if (completedStatus) {
      dispatch(OrderCompleted());
      setTimeout(() => {
        props.navigation.navigate('RatingShipper', {shipperName: shipperLocation.shipperName});
      }, 3000);
    }
  }, [completedStatus]);

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
          ref={mapRef}
          showsMyLocationButton
          pitchEnabled={false}
          rotateEnabled={false}
          scrollEnabled={false}
          zoomEnabled={false}
          onLayout={event => {
            mapRef.current.fitToCoordinates(
              [
                {
                  latitude: state.userLocation.latitude,
                  longitude: state.userLocation.longitude,
                },
                {
                  latitude: 10.770426270078108,
                  longitude: 106.69433674255707,
                },
              ],
              {
                edgePadding: {top: 100, right: 100, bottom: 100, left: 100},
                animated: true,
              },
            );
          }}
          style={styles.map}
          showsUserLocation
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: state.userLocation.latitude,
            longitude: state.userLocation.longitude,
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
          <Marker
            coordinate={{
              latitude: 12.215482848373497,
              longitude: 109.193544129014,
            }}>
            <Image
              source={require('../assets/image/providerMarker.png')}
              style={{width: 30, height: 30}}
            />
          </Marker>
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
      </View>

      <View style={[styles.shipperInfo, {height: openDetail ? '90%' : '50%'}]}>
        <TouchableOpacity
          style={{
            padding: 5,
            alignSelf: 'flex-start',
          }}
          onPress={() => props.navigation.goBack()}>
          <Feather name="arrow-left" size={20} color="black" />
        </TouchableOpacity>
        <View
          style={{
            backgroundColor: 'white',
            padding: 10,
            marginTop: -95,
            width: '25%',
            borderRadius: 50,
            alignSelf: 'center',
          }}>
          <View style={styles.remainingTime}>
            <Text style={{fontSize: 17, fontWeight: '500', textAlign: 'center'}}>14 mins</Text>
          </View>
        </View>
        <View style={{width: '100%', alignItems: 'center', paddingHorizontal: 20}}>
          <Text style={{fontSize: 18, fontWeight: '500', marginBottom: 15}}>
            {trackingMessage.title}
          </Text>
          <Text style={{textAlign: 'center'}}>{trackingMessage.message}</Text>
        </View>
        {shipperLocation.shipperName ? (
          <View style={[styles.flexRowBetween, {paddingHorizontal: 20, marginTop: 15}]}>
            <View style={styles.flexRow}>
              <Image
                source={require('../assets/image/shipperMarker.png')}
                style={{width: 30, height: 30, borderRadius: 40, marginRight: 10}}
              />
              <View>
                <Text style={{fontSize: 17, fontWeight: '400', marginBottom: 10}}>Brian J</Text>
                <Text style={{fontSize: 17, fontWeight: '400'}}>12123123</Text>
              </View>
            </View>
            <View style={styles.flexRow}>
              <TouchableOpacity
                style={{
                  padding: 10,
                  borderRadius: 40,
                  borderWidth: 1,
                  backgroundColor: 'white',
                  marginRight: 10,
                }}>
                <Feather name="phone" size={14} color="black" />
              </TouchableOpacity>
              <TouchableOpacity
                style={{padding: 10, borderRadius: 40, borderWidth: 1, backgroundColor: 'white'}}>
                <Feather name="message-square" size={14} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        ) : null}

        <OrderProgressBar
          submittedStatus={submittedStatus}
          confirmedStatus={confirmedStatus}
          assignedStatus={assignedStatus}
          pickedStatus={pickedStatus}
          completedStatus={completedStatus}
        />

        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: openDetail ? 20 : 60,
          }}>
          {openDetail ? (
            <>
              <ScrollView
                style={{width: '100%', height: 350}}
                ref={scrollRef}
                onLayout={event => {
                  scrollRef.current.scrollToEnd();
                }}>
                <Text style={{fontSize: 19, fontWeight: 'bold', textAlign: 'center'}}>
                  Your items
                </Text>
                <View
                  style={{
                    width: '100%',
                    paddingHorizontal: 20,
                    marginTop: 15,
                  }}>
                  {state.userCart.cart.map((item, index) => (
                    <View
                      key={index}
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 15,
                      }}>
                      <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={{fontSize: 16}}>{item.quantity}x</Text>
                        <View>
                          <Text
                            style={{
                              marginLeft: 15,
                              marginBottom: 10,
                              fontSize: 17,
                              fontWeight: '600',
                            }}>
                            {item.productName}
                          </Text>
                          <Text style={{marginLeft: 15, fontStyle: 'italic', color: 'gray'}}>
                            {additionalOptions[index]}
                          </Text>
                          {item.SpecialInstruction ? (
                            <Text>Note: {item.SpecialInstruction}</Text>
                          ) : null}
                        </View>
                      </View>
                      <Text style={{fontWeight: '600', fontSize: 17}}>
                        ${item.totalProductPrice}
                      </Text>
                    </View>
                  ))}
                  <View
                    style={{
                      width: '100%',
                      paddingHorizontal: 20,
                      paddingVertical: 10,
                      borderColor: 'rgb(230,230,230)',
                      borderTopWidth: 1,
                      borderBottomWidth: 1,
                    }}>
                    <View style={styles.flexRowBetween}>
                      <Text style={{fontSize: 16, fontWeight: '500'}}>Subtotal (2 items)</Text>
                      <Text style={{fontSize: 16, fontWeight: '500'}}>
                        ${totalCartPrice(state.userCart.cart)}
                      </Text>
                    </View>
                    <View style={styles.flexRowBetween}>
                      <Text style={{fontSize: 16, fontWeight: '500'}}>Delivery fee: 2.8km</Text>
                      <Text style={{fontSize: 16, fontWeight: '500'}}>$0.4</Text>
                    </View>
                    <View style={styles.flexRowBetween}>
                      <Text style={{fontSize: 16, fontWeight: '500', color: '#AB2E15'}}>
                        Coupon
                      </Text>
                      <Text style={{fontSize: 16, fontWeight: '500', color: '#AB2E15'}}>-$1.5</Text>
                    </View>
                  </View>
                  <View
                    style={{
                      width: '100%',
                      paddingHorizontal: 20,
                      paddingVertical: 10,
                      borderColor: 'rgb(230,230,230)',
                      borderTopWidth: 1,
                      borderBottomWidth: 1,
                    }}>
                    <View style={styles.flexRowBetween}>
                      <Text style={{fontSize: 16, fontWeight: '500'}}>Total</Text>
                      <Text style={{fontSize: 16, fontWeight: '500'}}>
                        ${totalCartPrice(state.userCart.cart)}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      width: '100%',
                      paddingHorizontal: 20,
                      paddingVertical: 10,
                      borderColor: 'rgb(230,230,230)',
                      borderTopWidth: 1,
                      borderBottomWidth: 1,
                    }}>
                    <View style={styles.flexRowBetween}>
                      <Text style={{fontSize: 16, fontWeight: '500'}}>Paid by</Text>
                      <Text style={{fontSize: 16, fontWeight: '500'}}>Cash</Text>
                    </View>
                  </View>
                </View>
              </ScrollView>
              <View style={{marginTop: 20}}>
                <TouchableOpacity
                  onPress={() => setOpenDetail(prev => !prev)}
                  style={{padding: 20, backgroundColor: 'black'}}>
                  <Text
                    style={{fontSize: 17, fontWeight: 'bold', textAlign: 'center', color: 'white'}}>
                    See less
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <TouchableOpacity
              onPress={() => setOpenDetail(prev => !prev)}
              style={{padding: 20, backgroundColor: 'black'}}>
              <Text style={{fontSize: 17, fontWeight: 'bold', textAlign: 'center', color: 'white'}}>
                Show order details
              </Text>
            </TouchableOpacity>
          )}
        </View>
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
