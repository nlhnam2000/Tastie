import React, {useState, useEffect, useLayoutEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ImageBackground,
  ActivityIndicator,
  SafeAreaView,
  Dimensions,
  Button,
  RefreshControl,
  Platform,
} from 'react-native';

// assets & components
import {IP_ADDRESS} from '../../../global';
import {NavigateToHome} from '../../../store/action/navigation';
import colors from '../../../colors/colors';

// libraries
import Feather from 'react-native-vector-icons/Feather';
import {useSelector, useDispatch} from 'react-redux';
import axios from 'axios';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import PushNotification from 'react-native-push-notification';
import FastImage from 'react-native-fast-image';

const {width, height} = Dimensions.get('window');

export const OrderHistory = props => {
  const [loading, setLoading] = useState(true);
  const state = useSelector(state => state.UserReducer);
  const dispatch = useDispatch();
  const [orderHistory, setOrderHistory] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const createChannel = () => {
    PushNotification.createChannel({
      channelId: 'homescreen-channel',
      channelName: 'HomeScreen Channel',
    });
  };

  const renderOrderStatus = status => {
    switch (status) {
      case 'Completed':
        return (
          <Text style={{fontWeight: '600'}}>
            {props.filterStatus === 'ToRate' ? 'Rate this restaurant' : 'More detail'}
          </Text>
        );
      case 'Canceled':
        return (
          <Text style={{fontWeight: '600', color: colors.boldred}}>
            The order has been canceled
          </Text>
        );
      default:
        return <Text style={{fontWeight: '600'}}>The order is in progress</Text>;
    }
  };

  const totalCartPrice = cart => {
    let price = 0.0;
    for (let i = 0; i < cart.length; i++) {
      price += parseFloat(cart[i].totalProductPrice);
    }

    return price.toFixed(2);
  };

  const LoadOrderHistory = async () => {
    try {
      let res = await axios.get(
        `https://${IP_ADDRESS}/v1/api/tastie/order/get-order-history/${state.user_id}`,
      );
      if (res.data.response) {
        if (props.filterStatus === 'History') {
          // completed or canceled
          setOrderHistory(
            res.data.response.list_order_history.filter(res => res.order_status_nb >= 5),
          );
        } else if (props.filterStatus === 'Ongoing') {
          setOrderHistory(
            res.data.response.list_order_history.filter(res => res.order_status_nb < 5),
          );
        } else if (props.filterStatus === 'ToRate') {
          setOrderHistory(
            res.data.response.list_order_not_rated.filter(res => res.order_status_nb === 5),
          );
        }
      }
    } catch (error) {
      console.error('Cannot get order history', error);
    }

    setLoading(false);
  };

  const ReOrder = async (order_code, user_id) => {
    try {
      let fecthProductsFromOder = await axios.get(
        `https://${IP_ADDRESS}/v1/api/tastie/order/get-all-products-from-order/${order_code}`,
      );

      if (fecthProductsFromOder.data.status) {
        const insertProductToCart = async product => {
          const res = await axios.post(
            `https://${IP_ADDRESS}/v1/api/tastie/tastie/insert_product-into-cart`,
            {
              user_id: user_id,
              product_id: product.product_id,
              quantity: product.quantity,
              special_instruction: product.special_instruction,
              additional_option: [],
            },
          );

          return res.data;
        };
        const queryList = [];
        fecthProductsFromOder.data.response.items.forEach(item => {
          queryList.push(insertProductToCart(item));
        });

        Promise.all(queryList)
          .then(values => {
            console.log(values);
            props.navigation.navigate('GoToCheckout');
          })
          .catch(error => console.log(error));
      }
    } catch (error) {
      console.error('cannot re-order', error);
    }
  };

  useEffect(() => {
    LoadOrderHistory();
    // createChannel();
  }, []);

  // component
  const Item = ({data}) => {
    const [isImageError, setIsImageError] = useState(false);

    return (
      <View style={{width: '100%', borderBottomWidth: 1, borderBottomColor: '#f2f2f2'}}>
        <View style={styles.orderHeader}>
          <Text style={{color: 'gray', width: '50%'}} numberOfLines={1}>
            {data.order_code}
          </Text>
          <Text style={{color: 'gray'}}>{data.completed_at}</Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            if (data.order_status === 'Completed' || data.order_status === 'Canceled') {
              if (props.filterStatus === 'ToRate') {
                props.navigation.navigate('RatingProvider', {order_id: data.order_id});
              } else {
                props.navigation.navigate('DetailOrder', {
                  order_code: data.order_code,
                  total_price: data.total_amount,
                  payment_method: data.payment_method,
                });
              }
            } else {
              if (data.delivery_mode === 1) {
                props.navigation.navigate('OrderStatus', {order_code: data.order_code});
              } else {
                props.navigation.navigate('PickupTracking', {
                  order_code: data.order_code,
                });
              }
            }
          }}
          style={styles.orderContent}>
          <FastImage
            onError={() => setIsImageError(true)}
            source={
              isImageError
                ? require('../../../assets/image/SlideShowImg/Picture1.jpg')
                : {uri: data.provider_avatar}
            }
            style={{width: 100, height: 100, marginRight: 20}}
          />
          <View style={styles.orderContentDetail}>
            <Text
              numberOfLines={1}
              style={{
                fontSize: 17,
                fontWeight: '500',
                marginBottom: 10,
                width: width - 10 - 100 - 10 - 20,
              }}>
              {data.provider_name}
            </Text>
            {/* <Text style={{color: 'gray', marginBottom: 10}}>135B Tran Hung Dao</Text> */}
            <Text>
              $ {parseFloat(data.total_amount).toFixed(2)} ( items) - {data.payment_method}
            </Text>
          </View>
        </TouchableOpacity>
        <View style={styles.orderFooter}>
          <Text style={{fontSize: 14, fontWeight: '400'}}>{data.order_status}</Text>
          <View style={styles.buttons}>{renderOrderStatus(data.order_status)}</View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, {justifyContent: 'space-around'}]}>
        <View style={{width: '100%', paddingHorizontal: 20}}>
          <SkeletonPlaceholder>
            <View style={{width: '100%', height: 20, marginVertical: 5}} />
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between', marginVertical: 20}}>
              <View style={{width: 150, height: 120, marginRight: 20}} />
              <View>
                <View style={{width: 100, height: 20, marginBottom: 20}} />
                <View style={{width: 100, height: 20, marginBottom: 20}} />
                <View style={{width: 100, height: 20, marginBottom: 20}} />
              </View>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 10}}>
              <View style={{width: 80, height: 30}} />
              <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <View style={{width: 70, height: 30, marginRight: 20}} />
                <View style={{width: 70, height: 30}} />
              </View>
            </View>
          </SkeletonPlaceholder>
          <SkeletonPlaceholder>
            <View style={{width: '100%', height: 20, marginVertical: 5, marginTop: 10}} />
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between', marginVertical: 20}}>
              <View style={{width: 150, height: 120, marginRight: 20}} />
              <View>
                <View style={{width: 100, height: 20, marginBottom: 20}} />
                <View style={{width: 100, height: 20, marginBottom: 20}} />
                <View style={{width: 100, height: 20, marginBottom: 20}} />
              </View>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 10}}>
              <View style={{width: 80, height: 30}} />
              <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <View style={{width: 70, height: 30, marginRight: 20}} />
                <View style={{width: 70, height: 30}} />
              </View>
            </View>
          </SkeletonPlaceholder>
          <SkeletonPlaceholder>
            <View style={{width: '100%', height: 20, marginVertical: 5, marginTop: 10}} />
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10}}>
              <View style={{width: 150, height: 120, marginRight: 20}} />
              <View>
                <View style={{width: 100, height: 20, marginBottom: 20}} />
                <View style={{width: 100, height: 20, marginBottom: 20}} />
                <View style={{width: 100, height: 20, marginBottom: 20}} />
              </View>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 20}}>
              <View style={{width: 80, height: 30}} />
              <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <View style={{width: 70, height: 30, marginRight: 20}} />
                <View style={{width: 70, height: 30}} />
              </View>
            </View>
          </SkeletonPlaceholder>
        </View>
      </View>
    );
  }

  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={[styles.content, {marginTop: orderHistory.length === 0 ? 60 : 0}]}>
          {orderHistory.length === 0 ? (
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <Feather name="shopping-cart" size={80} color="black" />
              <Text style={{fontSize: 21, fontWeight: '500', marginTop: 20}}>No orders yet</Text>
              <Text
                style={{
                  marginVertical: 20,
                  textAlign: 'center',
                  fontWeight: '400',
                  color: 'rgba(0,0,0,0.8)',
                }}>
                When you place your first order, il will appear here.
              </Text>
              <TouchableOpacity
                style={{backgroundColor: 'black', padding: 15, borderRadius: 40}}
                onPress={() => {
                  dispatch(NavigateToHome());
                  props.navigation.navigate('Home Page');
                }}>
                <Text
                  style={{textAlign: 'center', fontSize: 17, color: 'white', fontWeight: 'bold'}}>
                  Find order
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <ScrollView
              refreshControl={
                <RefreshControl
                  tintColor={colors.red}
                  refreshing={isRefreshing}
                  onRefresh={() => {
                    setIsRefreshing(true);
                    setTimeout(async () => {
                      setIsRefreshing(false);
                      await LoadOrderHistory();
                    }, 2000);
                  }}
                />
              }
              style={{width: '100%', height: '100%'}}
              contentContainerStyle={{
                paddingBottom: Platform.OS === 'ios' ? 0 : 20,
              }}
              showsVerticalScrollIndicator={false}>
              {orderHistory?.map((order, index) => (
                <Item data={order} key={index} />
              ))}
            </ScrollView>
          )}
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  headerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 10,
    paddingVertical: 10,
    position: 'relative',
    borderBottomWidth: 1,
    borderBottomColor: 'rgb(210,210,210)',
  },
  content: {
    width: '100%',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  orderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  orderContent: {
    flexDirection: 'row',
    width: '100%',
    paddingVertical: 10,
    borderBottomColor: '#f2f2f2',
    borderBottomWidth: 1,
  },
  orderContentDetail: {},
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    marginBottom: 5,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
