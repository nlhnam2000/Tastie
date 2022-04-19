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
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {useSelector, useDispatch} from 'react-redux';
import colors from '../../../colors/colors';
import {NavigateToHome} from '../../../store/action/navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {IP_ADDRESS} from '../../../global';

const {width, height} = Dimensions.get('window');

export const OrderHistory = props => {
  const [loading, setLoading] = useState(true);
  const state = useSelector(state => state.UserReducer);
  const dispatch = useDispatch();
  const [orderHistory, setOrderHistory] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const totalCartPrice = cart => {
    let price = 0.0;
    for (let i = 0; i < cart.length; i++) {
      price += parseFloat(cart[i].totalProductPrice);
    }

    return price.toFixed(2);
  };

  const LoadOrderHistory = async () => {
    // let _orderHistory = await AsyncStorage.getItem('@orderHistory');
    // if (_orderHistory) {
    //   setOrderHistory(JSON.parse(_orderHistory));
    // } else {
    //   setOrderHistory([]);
    // }
    try {
      let res = await axios.get(
        `http://${IP_ADDRESS}:3007/v1/api/tastie/order/get-order-history/${state.user_id}`,
      );
      if (res.data.response) {
        setOrderHistory(res.data.response);
      }
    } catch (error) {
      console.error('Cannot get order history', error);
    }

    setLoading(false);
  };

  useEffect(() => {
    LoadOrderHistory();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, {justifyContent: 'center'}]}>
        <ActivityIndicator size={'large'} color="red" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerWrapper}>
        <TouchableOpacity
          style={{position: 'absolute', left: 10}}
          onPress={() => props.navigation.goBack()}>
          <Feather name="arrow-left" size={20} color="black" />
        </TouchableOpacity>
        <Text style={{fontSize: 18, fontWeight: '500', textAlign: 'center'}}>My order</Text>
      </View>
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
              <Text style={{textAlign: 'center', fontSize: 17, color: 'white', fontWeight: 'bold'}}>
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
            style={{width: '100%'}}
            // contentContainerStyle={{height}}
            showsVerticalScrollIndicator={false}>
            {orderHistory?.map((order, index) => (
              <View
                key={index}
                style={{width: '100%', borderBottomWidth: 1, borderBottomColor: colors.secondary}}>
                <View style={styles.orderHeader}>
                  <Text style={{color: 'gray'}}>#19032-567101997</Text>
                  <Text style={{color: 'gray'}}>{order.completed_at}</Text>
                </View>
                <TouchableOpacity
                  style={styles.orderContent}
                  onPress={() =>
                    props.navigation.navigate('OrderStatus', {order_code: order.order_code})
                  }>
                  <ImageBackground
                    source={{uri: order.provider_avatar}}
                    style={{width: 150, height: 120, marginRight: 20}}
                  />
                  <View style={styles.orderContentDetail}>
                    <Text
                      numberOfLines={2}
                      style={{fontSize: 17, fontWeight: '500', marginVertical: 10}}>
                      {order.provider_name}
                    </Text>
                    <Text style={{color: 'gray', marginBottom: 10}}>135B Tran Hung Dao</Text>
                    <Text>
                      $ {parseFloat(order.total_amount).toFixed(2)} ( items) -{' '}
                      {order.payment_method}
                    </Text>
                  </View>
                </TouchableOpacity>
                <View style={styles.orderFooter}>
                  <Text style={{fontSize: 14, fontWeight: '400'}}>{order.order_status}</Text>
                  <View style={styles.buttons}>
                    {order.order_status === 'Completed' ? (
                      <>
                        <TouchableOpacity
                          onPress={() => props.navigation.navigate('RatingProvider')}
                          style={{
                            paddingVertical: 10,
                            paddingHorizontal: 20,
                            borderWidth: 1,
                            borderColor: 'black',
                            marginRight: 10,
                          }}>
                          <Text style={{fontWeight: '600'}}>View rating</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={{
                            paddingVertical: 10,
                            paddingHorizontal: 20,
                            backgroundColor: 'black',
                            borderWidth: 1,
                          }}>
                          <Text style={{fontWeight: '600', color: 'white'}}>Re-order</Text>
                        </TouchableOpacity>
                      </>
                    ) : (
                      <TouchableOpacity
                        onPress={() =>
                          props.navigation.navigate('OrderStatus', {
                            order_code: order.order_code,
                          })
                        }
                        style={{
                          paddingVertical: 10,
                          paddingHorizontal: 20,
                          borderWidth: 1,
                          borderColor: 'black',
                          marginRight: 10,
                        }}>
                        <Text style={{fontWeight: '600'}}>Watch order</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            ))}
            {/* <View style={{width, alignItems: 'center'}}>
              <Button
                title="Delete"
                onPress={async () => {
                  await AsyncStorage.removeItem('@orderHistory');
                }}
              />
              <Button
                title="Debug"
                onPress={async () => {
                  let data = await AsyncStorage.getItem('@orderHistory');
                  console.log(JSON.parse(data));
                }}
              />
            </View> */}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
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
    borderBottomColor: '#c4c4c4',
    borderBottomWidth: 1,
  },
  orderContentDetail: {},
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
