import {View, Text, StyleSheet, Button, Platform, TouchableOpacity} from 'react-native';
import React, {useRef, useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import BottomSheet, {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {LONGITUDE_DELTA, LATITUDE_DELTA, MAPBOXGS_ACCESS_TOKEN, IP_ADDRESS} from '../global';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import MapView, {Marker, PROVIDER_GOOGLE, Polyline} from 'react-native-maps';
import {UserMarker, ProviderMarker} from '../components/Marker/Marker';
import {ActivityIndicator} from 'react-native-paper';
import colors from '../colors/colors';
import Feather from 'react-native-vector-icons/Feather';
import {OrderProgressBarPickup} from '../components/Progress/OrderProgressBar';
import {SimpleAlertDialog} from '../components/Error/AlertDialog';
import axios from 'axios';

export const PickupTracking = ({navigation, route}) => {
  const {order_code} = route.params;
  const state = useSelector(state => state.UserReducer);
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [polyline, setPolyline] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [notification, setNotification] = useState(null);
  const [orderData, setOrderData] = useState({
    merchant_name: null,
    merchant_location: {
      latitude: 10.762496634175468,
      longitude: 106.68274002633785,
    },
    order_id: 0,
    items: [],
    num_items: 0,
    delivery_fee: 0,
    address: '',
    paymentMethod: 'Cash',
    deliveryMode: 1,
    deliveryMethod: '',
    scheduleTime: '',
  });
  // 0: default, 1: submitted, 2: confirmed, 3: completed
  const [orderStatus, setOrderStatus] = useState(2);

  const bottomsheetRef = useRef();
  const mapref = useRef();

  const totalCartPrice = cart => {
    let price = 0.0;
    for (let i = 0; i < cart.length; i++) {
      price += parseFloat(cart[i].price);
    }

    return price.toFixed(2);
  };

  const onMapLoaded = () => {
    mapref.current?.fitToCoordinates(
      [
        {
          latitude: state.userLocation.latitude,
          longitude: state.userLocation.longitude,
        },
        {
          latitude: orderData.merchant_location.latitude,
          longitude: orderData.merchant_location.longitude,
        },
      ],
      {
        edgePadding: {top: 40, right: 40, bottom: 40, left: 40},
        animated: true,
      },
    );

    axios
      .get(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${state.userLocation.longitude},${state.userLocation.latitude};${orderData.merchant_location.longitude},${orderData.merchant_location.latitude}?geometries=geojson&access_token=${MAPBOXGS_ACCESS_TOKEN}`,
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
  };

  const ListenSocketEvent = () => {
    state.socketServer.host.emit('join-room', order_code);
    state.socketServer.host.on('order-confirmed-from-provider', () => {
      setOrderStatus(2); //
    });
    state.socketServer.host.on('order-canceled', message => {
      // canceled
      setNotification(message);
    });
  };
  useEffect(() => {
    if (notification && notification !== '') {
      setOpenModal(true);
    }
  }, [notification]);

  const OrderCompleted = async () => {
    try {
      console.log('completing ....');
      await axios.post(`https://${IP_ADDRESS}/v1/api/tastie/order/update_order_status`, {
        order_code: order_code,
        status: 5, // completed
        shipper_id: null,
        update_at: '2022-04-21 20:11:11',
      });
      console.log('completed');
      setOrderStatus(3); // completed
      setTimeout(() => {
        navigation.navigate('RatingProvider', {order_id: orderData.order_id});
      }, 2000);
    } catch (error) {
      console.error('Cannot complete order', error);
    }
  };

  const handleCancelOrder = async () => {
    try {
      const res = await axios.post(
        `https://${IP_ADDRESS}/v1/api/tastie/order/update_order_status`,
        {
          order_code: order_code,
          status: 6,
          shipper_id: null,
          update_at: '2022-04-21 20:11:11',
        },
      );
      if (res.data.status) {
        // alert('Your order has been canceled !');
        // setNotification('Your order has been canceled !');
        // setOpenModal(true);
        // dispatch(DisconnectSocket());

        setTimeout(() => {
          navigation.navigate('Home Page');
        }, 2000);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const LoadScreen = async () => {
      ListenSocketEvent();

      const fetchOrderItems = async order_code => {
        let res = await axios.get(
          `https://${IP_ADDRESS}/v1/api/tastie/order/get-all-products-from-order/${order_code}`,
        );

        return res.data;
      };

      const getOrderStatus = async order_code => {
        let res = await axios.get(
          `https://${IP_ADDRESS}/v1/api/tastie/order/get-order-summary/${order_code}`,
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
            merchant_location: {
              ...prev.merchant_location,
              latitude: parseFloat(data[0].response.latitude),
              longitude: parseFloat(data[0].response.longitude),
            },
            items: data[0].response.items,
            num_items: data[0].response.num_items,
            delivery_fee: data[1].response.delivery_fee,
            order_id: data[1].response.order_id,
            address: data[1].response.customer_address,
            paymentMethod: data[1].response.payment_name,
            deliveryMode: data[1].response.delivery_mode,
            deliveryMethod: data[1].response.delivery_method,
            // scheduleTime: data[1].response.schedule_time,
          }));

          switch (data[1].response.order_status.at(-1).order_status_name) {
            case 'Submitted':
              setOrderStatus(1);
              break;
            case 'Confirmed':
              setOrderStatus(2);
              break;
            case 'Completed':
              setOrderStatus(3);
              break;
          }
        }
      });
      setLoading(false);
    };

    LoadScreen();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, {justifyContent: 'center'}]}>
        <ActivityIndicator size={'large'} color={colors.boldred} />
      </SafeAreaView>
    );
  }

  return (
    <View style={[styles.container]}>
      <MapView
        ref={mapref}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        showsUserLocation
        mapType="terrain"
        initialRegion={{
          latitude: state.userLocation.latitude,
          longitude: state.userLocation.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }}
        onMapLoaded={() => onMapLoaded()}>
        <Marker
          coordinate={{
            latitude: state.userLocation.latitude,
            longitude: state.userLocation.longitude,
          }}>
          <UserMarker />
        </Marker>

        <Marker
          coordinate={{
            latitude: orderData.merchant_location.latitude,
            longitude: orderData.merchant_location.longitude,
          }}>
          <ProviderMarker />
        </Marker>

        {polyline ? (
          <Polyline
            coordinates={polyline}
            strokeColor="green" // fallback for when `strokeColors` is not supported by the map-provider
            strokeWidth={4}
          />
        ) : null}
      </MapView>

      <BottomSheet ref={bottomsheetRef} snapPoints={['30%', '90%']}>
        <BottomSheetScrollView>
          <View style={[styles.shipperInfo]}>
            <TouchableOpacity
              style={{
                padding: 5,
                position: 'absolute',
                top: -10,
                zIndex: 10,
              }}
              onPress={() => navigation.navigate('Home Page')}>
              <Feather name="arrow-left" size={20} color="black" />
            </TouchableOpacity>
            <View style={{width: '100%', alignItems: 'center', paddingHorizontal: 20}}>
              <Text style={{fontSize: 18, fontWeight: '500', marginBottom: 15}}>
                Order submitted
              </Text>
              <Text style={{textAlign: 'center'}}>Your order has been sent to the restaurant</Text>
            </View>

            <OrderProgressBarPickup status={orderStatus} />

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
                          {/* {additionalOptions[index] && (
                            <Text
                              style={{
                                marginLeft: 15,
                                fontStyle: 'italic',
                                color: 'gray',
                                marginTop: 10,
                              }}>
                              {additionalOptions[index]}
                            </Text>
                          )} */}
                          {item.special_instruction !== '' && (
                            <Text style={{marginTop: 10}}>Note: {item.SpecialInstructions}</Text>
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
                    {/* <View style={styles.flexRowBetween}>
                      <Text style={{fontSize: 16, fontWeight: '500'}}>Delivery fee: 2.8km</Text>
                      <Text style={{fontSize: 16, fontWeight: '500'}}>
                        ${parseFloat(orderData.delivery_fee).toFixed(2)}
                      </Text>
                    </View> */}
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
                        ${parseFloat(totalCartPrice(orderData.items)).toFixed(2)}
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
                      <Text style={{fontSize: 16, fontWeight: '500'}}>
                        {orderData.paymentMethod}
                      </Text>
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
            width: '100%',
            paddingHorizontal: 0,
            alignItems: 'center',
            justifyContent: 'center',
            paddingBottom: 30,
          }}>
          {orderStatus === 0 ? (
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
          ) : (
            <TouchableOpacity
              onPress={() => OrderCompleted()}
              style={{
                paddingHorizontal: 15,
                paddingVertical: 15,
                backgroundColor: 'black',
                width: '40%',
              }}>
              <Text
                style={{
                  fontWeight: 'bold',
                  textAlign: 'center',
                  color: 'white',
                  fontSize: 16,
                }}>
                Completed
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </BottomSheet>
      <SimpleAlertDialog
        message={notification}
        visible={openModal}
        onCancel={() => setOpenModal(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  remainingTime: {
    padding: 15,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#AB2E15',
    backgroundColor: 'white',
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
