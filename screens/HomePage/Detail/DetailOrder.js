import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  Platform,
} from 'react-native';
import colors from '../../../colors/colors';
import Feather from 'react-native-vector-icons/Feather';
import {useSelector} from 'react-redux';
import {IP_ADDRESS} from '../../../global';
import axios from 'axios';

export const DetailOrder = props => {
  const [loading, setLoading] = useState(true);
  const state = useSelector(state => state.UserReducer);
  const {order_code, payment_method, total_price} = props.route.params;
  const [additionalOptions, setAdditionalOptions] = useState([]);
  const [orderSummary, setOrderSummary] = useState({
    order_id: -1,
    order_code: 'Unknown',
    customer_phone: '123456789',
    customer_address: '135B Tran Hung Dao',
    subtotal: 0,
    delivery_fee: 0,
    tip: 0,
    promotion_id: -1,
    ecoupon_id: -1,
    order_status: [],
  });
  const [orderDetail, setOrderDetail] = useState({
    merchant_name: 'Unknown',
    provider_id: 0,
    items: [],
    num_items: 0,
    delivery_fee: 0,
  });

  const totalCartPrice = cart => {
    let price = 0.0;
    for (let i = 0; i < cart.length; i++) {
      price += parseFloat(cart[i].totalProductPrice);
    }

    return price.toFixed(2);
  };

  const countSubtotal = item => {
    let sum = 0.0;
    for (let i = 0; i < item.length; i++) {
      sum += item[i].price * item[i].quantity;
    }

    return sum.toFixed(2);
  };

  const GetOrderSummary = async () => {
    const res = await axios.get(
      `http://${IP_ADDRESS}:3007/v1/api/tastie/order/get-order-summary/${order_code}`,
    );

    return res.data;
  };

  const GetOrderDetail = async () => {
    const res = await axios.get(
      `http://${IP_ADDRESS}:3007/v1/api/tastie/order/get-all-products-from-order/${order_code}`,
    );
    return res.data;
  };

  useEffect(() => {
    // let list = [];
    // order.cart.forEach(cart => {
    //   let optionItemName = [];
    //   cart.additionalOptions.forEach(additionalOption => {
    //     additionalOption.options.forEach(option => {
    //       optionItemName.push(option.optionItemName);
    //     });
    //   });
    //   list.push(optionItemName.toString().split(',').join(', '));
    // });
    // setAdditionalOptions(list);
    console.log(order_code);
    const res1 = GetOrderSummary();
    const res2 = GetOrderDetail();
    Promise.all([res1, res2]).then(values => {
      if (values[0].response && values[1].response) {
        setOrderSummary(prev => ({
          ...prev,
          order_id: values[0].response.order_id,
          order_code: values[0].response.order_code,
          customer_phone: values[0].response.customer_phone,
          customer_address: values[0].response.customer_address,
          subtotal: values[0].response.subtotal,
          delivery_fee: values[0].response.delivery_fee,
          tip: values[0].response.tip,
          promotion_id: values[0].response.promotion_id,
          ecoupon_id: values[0].response.ecoupon_id,
          order_status: values[0].response.order_status,
        }));
        setOrderDetail(prev => ({
          ...prev,
          merchant_name: values[1].response.merchant_name,
          items: values[1].response.items,
          num_items: values[1].response.num_items,
          delivery_fee: values[1].response.delivery_fee,
          provider_id: values[1].response.provider_id,
        }));
        setLoading(false);
      }
    });
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size={'large'} color={colors.red} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{width: '100%'}}>
        <View style={styles.headerWrapper}>
          <TouchableOpacity onPress={() => props.navigation.goBack()} style={styles.backButton}>
            <Feather name="arrow-left" size={20} color={'black'} />
          </TouchableOpacity>
          <Text style={[styles.heading, {textAlign: 'center'}]}>Order detail</Text>
        </View>
        <View style={styles.orderProgress}>
          <View style={styles.progress}>
            <View style={{alignItems: 'center'}}>
              <View
                style={{
                  padding: 10,
                  borderRadius: 40,
                  backgroundColor: colors.secondary,
                  marginBottom: 10,
                }}></View>
              <Text style={{color: 'gray'}}>Submitted</Text>
              <Text style={{color: 'gray'}}>
                {orderSummary.order_status[0].update_at.split(', ')[0]}
              </Text>
            </View>
            <View
              style={{
                width: '20%',
                height: 2,
                backgroundColor: colors.secondary,
                marginTop: 10,
              }}></View>
            <View style={{alignItems: 'center'}}>
              <View
                style={{
                  padding: 10,
                  borderRadius: 40,
                  backgroundColor: colors.secondary,
                  marginBottom: 10,
                }}></View>
              <Text style={{color: 'gray'}}>Picked</Text>
              <Text style={{color: 'gray'}}>
                {orderSummary.order_status[2]?.update_at.split(', ')[0]}
              </Text>
            </View>
            <View
              style={{
                width: '20%',
                height: 2,
                backgroundColor: colors.secondary,
                marginTop: 10,
              }}></View>
            <View style={{alignItems: 'center'}}>
              <View
                style={{
                  padding: 10,
                  borderRadius: 40,
                  backgroundColor: '#AB2E15',
                  marginBottom: 10,
                }}></View>
              <Text>
                {orderSummary.order_status[orderSummary.order_status.length - 1].order_status_name}
              </Text>
              <Text style={{color: 'gray'}}>
                {orderSummary.order_status[orderSummary.order_status.length - 1].update_at.split(
                  ', ',
                )[0] || 'unknown'}
              </Text>
            </View>
          </View>
        </View>
        <ScrollView style={{width: '100%'}}>
          <View style={styles.orderSummary}>
            <View style={{paddingVertical: 10, paddingHorizontal: 20}}>
              <Text style={styles.subheading}>{orderDetail.merchant_name ?? 'Unknown'}</Text>
              <Text style={{color: 'gray', marginBottom: 10}}>
                $ {total_price.toFixed(2)} ({orderDetail.num_items} items) - {payment_method}
              </Text>
              <Text style={{color: 'gray', marginBottom: 10}}>
                {state.first_name} {state.last_name} - {state.phone}
              </Text>
              <Text style={styles.subheading}>Delivery to</Text>
              <Text style={{color: 'gray', marginBottom: 10}}>{orderSummary.customer_address}</Text>
              <Text style={{color: 'gray', marginBottom: 10}}>
                Completed time: 2022/03/12 15:50
              </Text>
            </View>
          </View>
          <View style={styles.orderDetail}>
            <View style={{paddingVertical: 10, paddingHorizontal: 20}}>
              <Text style={[styles.heading, {paddingVertical: 10, marginBottom: 10}]}>
                {orderDetail.merchant_name}
              </Text>
              {orderDetail.items.map((item, index) => (
                <View key={index} style={styles.detail}>
                  <View style={{flexDirection: 'row', alignItems: 'center', width: '70%'}}>
                    <Text style={{fontSize: 17}}>{item.quantity}x</Text>
                    <View style={{marginLeft: 10}}>
                      <Text style={{fontSize: 17, fontWeight: '500', marginBottom: 10}}>
                        {item.product_name}
                      </Text>
                      {/* <Text style={{color: 'gray'}}>{additionalOptions[index]}</Text> */}
                    </View>
                  </View>
                  <View>
                    <Text style={{fontSize: 17}}>${(item.price * item.quantity).toFixed(2)}</Text>
                  </View>
                </View>
              ))}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                  marginTop: 15,
                }}>
                <Text style={{fontSize: 16}}>Subtotal</Text>
                <Text style={{fontSize: 16}}>${countSubtotal(orderDetail.items)}</Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                  marginTop: 15,
                }}>
                <Text style={{fontSize: 16}}>Delivery fee</Text>
                <Text style={{fontSize: 16}}>${orderDetail.delivery_fee.toFixed(2)}</Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                  marginTop: 15,
                }}>
                <Text style={{fontSize: 16, fontWeight: 'bold'}}>Total</Text>
                <Text style={{fontSize: 16, fontWeight: 'bold'}}>${total_price.toFixed(2)}</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
          width: '100%',
          paddingBottom: Platform.OS === 'android' ? 30 : 0,
        }}>
        {orderSummary.order_status[orderSummary.order_status.length - 1].order_status_name ===
          'Completed' && (
          <TouchableOpacity
            onPress={() =>
              props.navigation.navigate('Review', {provider_id: orderDetail.provider_id})
            }
            style={{
              width: '40%',
              borderWidth: 2,
              borderColor: 'black',
              paddingVertical: 15,
            }}>
            <Text style={[styles.heading, {textAlign: 'center'}]}>View Rating</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={{
            width: '40%',
            borderWidth: 2,
            borderColor: 'black',
            paddingVertical: 15,
            backgroundColor: 'black',
          }}>
          <Text style={[styles.heading, {color: 'white', textAlign: 'center'}]}>Re-order</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerWrapper: {
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 10,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 20,
    zIndex: 1,
  },
  heading: {
    fontSize: 18,
    fontWeight: '600',
  },
  orderProgress: {
    width: '100%',
    borderBottomWidth: 1,
    paddingBottom: 5,
    borderBottomColor: colors.secondary,
  },
  progress: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  orderSummary: {
    width: '100%',
    borderBottomWidth: 1,
    paddingBottom: 5,
    borderBottomColor: colors.secondary,
  },
  subheading: {
    fontSize: 17,
    fontWeight: '500',
    marginBottom: 10,
  },
  orderDetail: {
    width: '100%',
    paddingBottom: 5,
    marginBottom: 30,
  },
  detail: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 15,
  },
});
