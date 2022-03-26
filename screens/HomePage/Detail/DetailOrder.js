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
} from 'react-native';
import colors from '../../../colors/colors';
import Feather from 'react-native-vector-icons/Feather';
import {useSelector} from 'react-redux';

export const DetailOrder = props => {
  const [loading, setLoading] = useState(true);
  const state = useSelector(state => state.UserReducer);
  const {order} = props.route.params;
  const [additionalOptions, setAdditionalOptions] = useState([]);

  const totalCartPrice = cart => {
    let price = 0.0;
    for (let i = 0; i < cart.length; i++) {
      price += parseFloat(cart[i].totalProductPrice);
    }

    return price.toFixed(2);
  };

  useEffect(() => {
    let list = [];
    order.cart.forEach(cart => {
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
              <Text style={{color: 'gray'}}>15:30</Text>
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
              <Text style={{color: 'gray'}}>15:40</Text>
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
              <Text>Completed</Text>
              <Text style={{color: 'gray'}}>15:50</Text>
            </View>
          </View>
        </View>
        <ScrollView style={{width: '100%'}}>
          <View style={styles.orderSummary}>
            <View style={{paddingVertical: 10, paddingHorizontal: 20}}>
              <Text style={styles.subheading}>{order.provider_name}</Text>
              <Text style={{color: 'gray', marginBottom: 10}}>
                $ {order.total} ({order.cart.length} items) - {order.paymentMethod}
              </Text>
              <Text style={{color: 'gray', marginBottom: 10}}>
                {state.first_name} {state.last_name} - {state.phone}
              </Text>
              <Text style={styles.subheading}>Delivery to</Text>
              <Text style={{color: 'gray', marginBottom: 10}}>{state.userLocation.address}</Text>
              <Text style={{color: 'gray', marginBottom: 10}}>
                Completed time: 2022/03/12 15:50
              </Text>
            </View>
          </View>
          <View style={styles.orderDetail}>
            <View style={{paddingVertical: 10, paddingHorizontal: 20}}>
              <Text style={[styles.heading, {paddingVertical: 10, marginBottom: 10}]}>
                {order.provider_name}
              </Text>
              {order.cart.map((item, index) => (
                <View key={index} style={styles.detail}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{fontSize: 17}}>{item.quantity}x</Text>
                    <View style={{marginLeft: 20}}>
                      <Text style={{fontSize: 17, fontWeight: '500', marginBottom: 10}}>
                        {item.productName}
                      </Text>
                      <Text style={{color: 'gray'}}>{additionalOptions[index]}</Text>
                    </View>
                  </View>
                  <View>
                    <Text style={{fontSize: 17}}>${item.totalProductPrice}</Text>
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
                <Text style={{fontSize: 16}}>${totalCartPrice(order.cart)}</Text>
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
                <Text style={{fontSize: 16}}>${order.deliveryfee}</Text>
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
                <Text style={{fontSize: 16, fontWeight: 'bold'}}>${order.total}</Text>
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
        }}>
        <TouchableOpacity
          style={{
            width: '40%',
            borderWidth: 2,
            borderColor: 'black',
            paddingVertical: 15,
          }}>
          <Text style={[styles.heading, {textAlign: 'center'}]}>View Rating</Text>
        </TouchableOpacity>
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
