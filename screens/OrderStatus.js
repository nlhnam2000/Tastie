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
import {DisconnectSocket} from '../store/action/auth';
import BottomSheet, {BottomSheetScrollView, BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import {ShipperMarker} from '../components/Marker/Marker';

// let socket;
const {width, height} = Dimensions.get('window');

export const OrderStatus = props => {
  const state = useSelector(state => state.UserReducer);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const {order_code} = props.route.params;
  const [location, setLocation] = useState({
    latitude: state.userLocation.latitude,
    longitude: state.userLocation.longitude,
  });
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
  const [orderData, setOrderData] = useState({
    merchant_name: null,
    order_id: 0,
    items: [],
    num_items: 0,
    delivery_fee: 0,
  });
  const [trackingMessage, setTrackingMessage] = useState({
    title: '',
    message: '',
  });

  // const [providerOrder, setProviderOrder] = useState(null);
  // const [deliveryfee, setDeliveryfee] = useState(0);

  const mapRef = useRef();
  const scrollRef = useRef();
  const bottomSheetRef = useRef();

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
      price += parseFloat(cart[i].price);
    }

    return price.toFixed(2);
  };

  const handleCancelOrder = async () => {
    try {
      const res = await axios.post(
        `http://${IP_ADDRESS}:3007/v1/api/tastie/order/update_order_status`,
        {
          order_code: order_code,
          status: 6,
          shipper_id: null,
          update_at: '2022-04-21 20:11:11',
        },
      );
      if (res.data.status) {
        // alert('Your order has been canceled !');
        setNotification('Your order has been canceled !');
        setOpenModal(true);
        dispatch(DisconnectSocket());

        setTimeout(() => {
          props.navigation.navigate('Home Page');
        }, 2000);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!assignedStatus && orderData.items.length > 0) {
      // state.socket = io(`http://${IP_ADDRESS}:3015`);
      // socket.emit('join-room', order_code);
      state.socketServer.host.emit(
        'customer-submit-order',
        orderData.items,
        {
          name: state.first_name + ' ' + state.last_name,
          phone: state.phone,
          address: state.userLocation.address,
          user_id: state.user_id,
          location: {
            latitude: state.userLocation.latitude,
            longitude: state.userLocation.longitude,
          },
        },
        {
          name: state.userCart.provider_name,
          address: '135B Tran Hung Dao, Cau Ong Lanh, District 1',
          provider_id: state.userCart.provider_id,
          location: {
            latitude: 10.770426270078108,
            longitude: 106.69433674255707,
          },
        },
        order_code,
        {
          delivery_fee: orderData.delivery_fee.toFixed(2),
          total: parseFloat(totalCartPrice(orderData.items)),
        },
      );
    } else {
      console.log('no');
    }
  }, [assignedStatus, orderData]);

  useEffect(() => {
    const initialMap = () => {
      state.socketServer.host.emit('join-room', order_code); // join the room which is also the order_code
      /* 
        Check if the order has been registered to db or not
        If it is not in the db, submit the order through the socket server
      */

      // if (orderData.items.length > 0) {
      //   socket.emit(
      //     'customer-submit-order',
      //     orderData.items,
      //     {
      //       name: state.first_name + ' ' + state.last_name,
      //       phone: state.phone,
      //       address: state.userLocation.address,
      //       location: {
      //         latitude: state.userLocation.latitude,
      //         longitude: state.userLocation.longitude,
      //       },
      //     },
      //     {
      //       name: state.userCart.provider_name,
      //       address: '135B Tran Hung Dao, Cau Ong Lanh, District 1',
      //       location: {
      //         latitude: 10.770426270078108,
      //         longitude: 106.69433674255707,
      //       },
      //     },
      //     order_code,
      //   );
      // }

      state.socketServer.host.on('shipperLocation', data => {
        console.log('Shipper location:', data);
        setAssignedStatus(true);
        setShipperLocation(prevState => ({
          ...prevState,
          latitude: data.latitude,
          longitude: data.longitude,
          shipperName: data.shipperName,
        }));
      });
      state.socketServer.host.on('shipper-has-arrived', message => {
        setNotification('The shipper has arrived to your place');
        setOpenModal(true);
        setCompletedStatus(true);
        setTrackingMessage(prev => ({
          ...prev,
          title: 'Order completed',
          message: 'The shipper has arrived to your place.',
        }));
        state.socketServer.host.emit('leave-room', order_code);
      });
      state.socketServer.host.on('order-accepted', message => {
        setWaiting(false);
        // setNotification(message);
        // setOpenModal(true);
        setSubmittedStatus(true);
      });
      state.socketServer.host.on('shipper-arrived-provider', message => {
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

      // provider confirmed order
      state.socketServer.host.on('order-confirmed-from-provider', () => {
        setConfirmedStatus(true);
        setTrackingMessage(prev => ({
          ...prev,
          title: 'Order confirmed',
          message: 'The restaurant had confirmed your order and is prepairing your order. ',
        }));
      });

      state.socketServer.host.on('order-assigned', () => {
        setAssignedStatus(true);
        setTrackingMessage(prev => ({
          ...prev,
          title: 'Order assigned',
          message: 'We have found the shipper for you. Please wait for a moment',
        }));
      });
      state.socketServer.host.on('shipper-on-the-way', message => {
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

      const fetchOrderItems = async order_code => {
        let res = await axios.get(
          `http://${IP_ADDRESS}:3007/v1/api/tastie/order/get-all-products-from-order/${order_code}`,
        );

        return res.data;
      };

      const getOrderStatus = async order_code => {
        let res = await axios.get(
          `http://${IP_ADDRESS}:3007/v1/api/tastie/order/get-order-summary/${order_code}`,
        );

        return res.data;
      };

      const res1 = fetchOrderItems(order_code);
      const res2 = getOrderStatus(order_code);
      Promise.all([res1, res2]).then(data => {
        if (data[0].response && data[1].response) {
          setOrderData(prev => ({
            ...prev,
            merchant_name: data[0].response.merchant_name,
            items: data[0].response.items,
            num_items: data[0].response.num_items,
            delivery_fee: data[1].response.delivery_fee,
            order_id: data[1].response.order_id,
          }));
          setTrackingMessage({
            title: 'Order submitted',
            message: `Your order from ${data[0].response.merchant_name} has been placed.`,
          });

          switch (
            data[1].response.order_status[data[1].response.order_status.length - 1]
              .order_status_name
          ) {
            case 'Submitted':
              setSubmittedStatus(true);
              break;
            case 'Assigned':
              setSubmittedStatus(true);
              setAssignedStatus(true);
              setTrackingMessage(prev => ({
                ...prev,
                title: 'Order assigned',
                message: 'We found a shipper for you. Please wait for a moment',
              }));
              break;
            case 'Confirmed':
              setSubmittedStatus(true);
              setAssignedStatus(true);
              setConfirmedStatus(true);
              setTrackingMessage(prev => ({
                ...prev,
                title: 'Order confirmed',
                message: 'The restaurant is preparing your order',
              }));
              break;
            case 'Picked':
              setSubmittedStatus(true);
              setAssignedStatus(true);
              setConfirmedStatus(true);
              setPickedStatus(true);
              setTrackingMessage(prev => ({
                ...prev,
                title: 'Order picked',
                message: 'The shipper is on the way to your place',
              }));
              break;
            case 'Completed':
              setSubmittedStatus(true);
              setAssignedStatus(true);
              setConfirmedStatus(true);
              setPickedStatus(true);
              setCompletedStatus(true);
              setTrackingMessage(prev => ({
                ...prev,
                title: 'Order completed',
                message: 'Your order has been completed ! Enjoy your meal !',
              }));
              break;

            default:
              break;
          }
        }
      });

      // let list = [];
      // state.userCart.cart.forEach(cart => {
      //   let optionItemName = [];
      //   cart.additionalOptions.forEach(additionalOption => {
      //     additionalOption.options.forEach(option => {
      //       optionItemName.push(option.optionItemName);
      //     });
      //   });
      //   list.push(optionItemName.toString().split(',').join(', '));
      // });
      // setAdditionalOptions(list);

      setLoading(false);
    };

    initialMap();
    // return () => {
    //   socket.disconnect();
    // };
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
      dispatch(OrderCompleted(order_code));
      setTimeout(() => {
        props.navigation.navigate('RatingShipper', {
          shipperName: shipperLocation.shipperName,
          order_id: orderData.order_id,
        });
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
              <ShipperMarker />
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

      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={['40%', '90%']}
        index={0}
        handleComponent={() => (
          <View
            style={{
              backgroundColor: 'white',
              padding: 10,
              marginTop: -40,
              width: '25%',
              borderRadius: 50,
              alignSelf: 'center',
            }}>
            <View style={styles.remainingTime}>
              <Text style={{fontSize: 17, fontWeight: '500', textAlign: 'center'}}>14 mins</Text>
            </View>
          </View>
        )}>
        <BottomSheetScrollView>
          <View style={[styles.shipperInfo]}>
            <TouchableOpacity
              style={{
                padding: 5,
                position: 'absolute',
                top: -10,
                zIndex: 10,
              }}
              onPress={() => props.navigation.navigate('Home Page')}>
              <Feather name="arrow-left" size={20} color="black" />
            </TouchableOpacity>
            <View style={{width: '100%', alignItems: 'center', paddingHorizontal: 20}}>
              <Text style={{fontSize: 18, fontWeight: '500', marginBottom: 15}}>
                {trackingMessage.title}
              </Text>
              <Text style={{textAlign: 'center'}}>{trackingMessage.message}</Text>
            </View>
            {assignedStatus ? (
              <View style={[styles.flexRowBetween, {paddingHorizontal: 20, marginTop: 15}]}>
                <View style={styles.flexRow}>
                  <Image
                    source={require('../assets/image/shipperMarker.png')}
                    style={{width: 30, height: 30, borderRadius: 40, marginRight: 10}}
                  />
                  <View>
                    <Text style={{fontSize: 17, fontWeight: '400', marginBottom: 10}}>
                      Hoang Nam
                    </Text>
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
                    onPress={() =>
                      props.navigation.navigate('ChatScreen', {order_code: order_code})
                    }
                    style={{
                      padding: 10,
                      borderRadius: 40,
                      borderWidth: 1,
                      backgroundColor: 'white',
                    }}>
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
                marginTop: 20,
              }}>
              <View style={{width: '100%'}}>
                <Text style={{fontSize: 19, fontWeight: 'bold', textAlign: 'center'}}>
                  Your items
                </Text>
                <View
                  style={{
                    width: '100%',
                    paddingHorizontal: 20,
                    marginTop: 15,
                  }}>
                  {orderData.items.map((item, index) => (
                    <View
                      key={index}
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 15,
                      }}>
                      <View style={{flexDirection: 'row', alignItems: 'center', width: '80%'}}>
                        <Text style={{fontSize: 16}}>{item.quantity}x</Text>
                        <View style={{width: '85%'}}>
                          <Text
                            style={{
                              marginLeft: 15,
                              fontSize: 17,
                              fontWeight: '600',
                            }}
                            numberOfLines={3}>
                            {item.product_name}
                          </Text>
                          {additionalOptions[index] && (
                            <Text
                              style={{
                                marginLeft: 15,
                                fontStyle: 'italic',
                                color: 'gray',
                                marginTop: 10,
                              }}>
                              {additionalOptions[index]}
                            </Text>
                          )}
                          {item.special_instruction !== '' && (
                            <Text style={{marginTop: 10}}>Note: {item.SpecialInstruction}</Text>
                          )}
                        </View>
                      </View>
                      <Text style={{fontWeight: '600', fontSize: 17}}>
                        ${parseFloat(item.price).toFixed(2)}
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
                      <Text style={{fontSize: 16, fontWeight: '500'}}>
                        Subtotal ({orderData.items.length} items)
                      </Text>
                      <Text style={{fontSize: 16, fontWeight: '500'}}>
                        ${totalCartPrice(orderData.items)}
                      </Text>
                    </View>
                    <View style={styles.flexRowBetween}>
                      <Text style={{fontSize: 16, fontWeight: '500'}}>Delivery fee: 2.8km</Text>
                      <Text style={{fontSize: 16, fontWeight: '500'}}>
                        ${parseFloat(orderData.delivery_fee).toFixed(2)}
                      </Text>
                    </View>
                    {/* <View style={styles.flexRowBetween}>
                      <Text style={{fontSize: 16, fontWeight: '500', color: '#AB2E15'}}>
                        Coupon
                      </Text>
                      <Text style={{fontSize: 16, fontWeight: '500', color: '#AB2E15'}}>-$1.5</Text>
                    </View> */}
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
                        $
                        {(
                          parseFloat(totalCartPrice(orderData.items)) + orderData.delivery_fee
                        ).toFixed(2)}
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
              </View>
            </View>
          </View>
        </BottomSheetScrollView>
        <View
          style={{
            marginTop: 20,
            flexDirection: 'row',
            width,
            paddingHorizontal: 0,
            alignItems: 'center',
            justifyContent: assignedStatus ? 'center' : 'space-around',
            paddingBottom: 30,
          }}>
          {!assignedStatus && (
            <TouchableOpacity
              onPress={() => handleCancelOrder()}
              style={{
                paddingHorizontal: 15,
                paddingVertical: 15,
                backgroundColor: colors.boldred,
                width: '40%',
              }}>
              <Text
                style={{
                  fontWeight: 'bold',
                  textAlign: 'center',
                  color: 'white',
                  fontSize: 16,
                }}>
                Cancel order
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </BottomSheet>
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
    backgroundColor: 'white',
    marginBottom: 30,
    // paddingVertical: 10,
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
