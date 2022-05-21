import React, {useEffect, useState, useRef, useMemo} from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  FlatList,
  Dimensions,
  Image,
} from 'react-native';

// components
import {paymentMethod} from '../assets/dummy/paymentMethod';
import {PaymentMethodList} from '../components/BottomSheet/PaymentMethodList';
import {PromotionList} from '../components/BottomSheet/PromotionList';
import {SchedulePickerModal} from '../components/Modal/SchedulePicker';
import colors from '../colors/colors';

// actions
import {SaveToHistoryCart, SubmitOrder, RetrieveCart} from '../store/action/cart';
import {InitSocket} from '../store/action/auth';
import {IP_ADDRESS, convertDollar, currentDateString} from '../global';

// libraries
import axios from 'axios';
import {useSelector, useDispatch} from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomSheet, {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import SelectDropdown from 'react-native-select-dropdown';

export const GoToCheckout = props => {
  const [loading, setLoading] = useState(true);
  const state = useSelector(state => state.UserReducer);
  const tabs = ['Delivery', 'Pickup'];
  const [selectedTab, setSelectedTab] = useState(tabs[0]);
  const methods = ['Standard', 'Schedule'];
  const [selectedMethod, setSelectedMethod] = useState(methods[0]);
  // const payments = ['Cash', 'Momo', 'Credit or debit card'];
  const [selectedPayment, setSelectedPayment] = useState(paymentMethod[0].name);
  const [openTip, setOpenTip] = useState(false);
  const [openPayment, setOpenPayment] = useState(false);
  const [openPromo, setOpenPromo] = useState(false);
  const [promoCode, setPromoCode] = useState({});
  const [additionalOptions, setAdditionalOptions] = useState([]);
  const [selectedTip, setSelectedTip] = useState(null);
  const [deliveryfee, setDeliveryfee] = useState(0);
  const [orderForm, setOrderForm] = useState({});
  const [openSchedule, setOpenSchedule] = useState(false);
  const [scheduleTime, setScheduleTime] = useState(null);

  const promoBottomSheetRef = useRef();
  const paymentBottomSheetRef = useRef();
  const promoSnapPoint = useMemo(() => ['90%'], []);
  const paymentSnapPoint = useMemo(() => ['50%', '90%'], []);

  const dispatch = useDispatch();

  const totalCartPrice = cart => {
    let price = 0.0;
    for (let i = 0; i < cart.length; i++) {
      price += parseFloat(cart[i].totalProductPrice);
    }

    return price.toFixed(2);
  };

  const PlaceOrder = async () => {
    try {
      let res = await axios.post(
        `http://${IP_ADDRESS}:3007/v1/api/tastie/order/submit-order-info-delivery`,
        orderForm,
      );
      if (res.data.status && res.data.order_code) {
        let orderCode = res.data.order_code;
        try {
          let submitOrder = await axios.post(
            `http://${IP_ADDRESS}:3007/v1/api/tastie/order/submit-order-items`,
            {
              customer_id: state.user_id,
              order_code: orderCode,
            },
          );
          if (submitOrder.data.status) {
            dispatch(InitSocket());
            setTimeout(() => {
              props.navigation.navigate('OrderStatus', {order_code: orderCode});
            }, 100);
          } else {
            console.error('Cannot submit order items !');
          }
        } catch (error) {
          console.error(error);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // const loadData = async () => {
    //   let list = [];
    //   state.userCart.cart.forEach(cart => {
    //     let optionItemName = [];
    //     cart.additionalOptions.forEach(additionalOption => {
    //       additionalOption.options.forEach(option => {
    //         optionItemName.push(option.optionItemName);
    //       });
    //     });
    //     list.push(optionItemName.toString().split(',').join(', '));
    //   });
    //   setAdditionalOptions(list);

    //   let res = await axios.post(
    //     `http://${IP_ADDRESS}:3007/v1/api/tastie/tastie/delivery-fee-to-checkout`,
    //     {
    //       longitude: state.userLocation.longitude,
    //       latitude: state.userLocation.latitude,
    //       provider_id: 1000005,
    //     },
    //   );
    //   if (res.data.delivery_fee) {
    //     setDeliveryfee(convertDollar(res.data.delivery_fee));
    //   }

    //   setLoading(false);
    // };
    const loadData = async () => {
      dispatch(RetrieveCart(state.user_id)); // retrieve the cart data just in case missing data
      let res = await axios.post(
        `http://${IP_ADDRESS}:3007/v1/api/tastie/tastie/delivery-fee-to-checkout`,
        {
          longitude: state.userLocation.longitude,
          latitude: state.userLocation.latitude,
          provider_id: state.userCart.provider_id,
        },
      );
      if (res.data.delivery_fee) {
        setDeliveryfee(convertDollar(res.data.delivery_fee));
      }
      setLoading(false);
    };

    loadData();
  }, []);

  useEffect(() => {
    setOrderForm(prev => ({
      ...prev,
      delivery_mode: selectedTab === 'Delivery' ? 1 : 2,
      customer_id: state.user_id,
      delivery_address: state.userLocation.address,
      customer_phone: state.phone,
      payment_method: selectedPayment === 'Cash' ? 1 : selectedPayment === 'Momo' ? 2 : 3,
      payment_status: 1,
      promotion_code: promoCode ?? '',
      ecoupon_code: '',
      delivery_method: selectedMethod === 'Standard' ? 1 : 2,
      schedule_time: scheduleTime ?? '',
      tips: 0,
      delivery_fee: deliveryfee,
      subtotal: parseFloat(totalCartPrice(state.userCart.cart)).toFixed(2),
      total:
        selectedTab === 'Delivery'
          ? (parseFloat(totalCartPrice(state.userCart.cart)) + parseFloat(deliveryfee)).toFixed(2)
          : parseFloat(totalCartPrice(state.userCart.cart)).toFixed(2),
    }));
  }, [selectedTab, selectedMethod, selectedPayment, selectedTip, deliveryfee, promoCode]);

  useEffect(() => {
    if (selectedMethod === 'Schedule') {
      setOpenSchedule(true);
    } else {
      setScheduleTime(null);
    }
  }, [selectedMethod]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size={'large'} color={colors.red} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerWrapper}>
        <TouchableOpacity onPress={() => props.navigation.goBack()}>
          <Feather name="arrow-left" size={20} color="black" />
        </TouchableOpacity>
      </View>
      <ScrollView style={{width: '100%'}}>
        <View style={styles.content}>
          <Text style={styles.heading}>{state.userCart.provider_name}</Text>
          <View style={styles.tabWrapper}>
            {tabs.map((tab, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedTab(tab)}
                style={[styles.tab, {backgroundColor: selectedTab === tab ? 'white' : null}]}>
                <Text style={{textAlign: 'center', fontSize: 17, fontWeight: '500'}}>{tab}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={{marginTop: 20}}>
            <Text style={styles.heading}>Delivery to:</Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 10,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Feather name="map-pin" size={20} color="black" />
                <Text style={{marginLeft: 15, fontSize: 17, width: '85%'}}>
                  {state.userLocation.address}
                </Text>
              </View>
              <Feather name="edit-3" size={20} color="black" />
            </View>
          </View>
          <View style={{marginTop: 20}}>
            <Text style={styles.heading}>Delivery method:</Text>
            <View
              style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
              {methods.map((method, index) => (
                <View key={index} style={styles.options}>
                  <TouchableOpacity
                    style={styles.radioButton}
                    onPress={() => {
                      setSelectedMethod(method);
                      if (method === 'Schedule') {
                        setOpenSchedule(true);
                      }
                    }}>
                    <View
                      style={{
                        borderRadius: 40,
                        backgroundColor: selectedMethod === method ? 'black' : 'white',
                        width: 15,
                        height: 15,
                      }}></View>
                  </TouchableOpacity>
                  <Text style={{fontSize: 17, fontWeight: '400'}}>{method}</Text>
                </View>
              ))}
            </View>
            {scheduleTime && (
              <Text style={{marginTop: 5}}>The order will be scheduled at {scheduleTime}</Text>
            )}
          </View>

          <View style={{marginTop: 20}}>
            <Text style={styles.heading}>Your items</Text>
            {state.userCart.cart.map((item, index) => (
              <View
                key={index}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: 15,
                }}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={{fontSize: 17}}>{item.quantity}x</Text>
                  <View style={{width: '80%'}}>
                    <Text style={{marginLeft: 10, fontSize: 17, fontWeight: '500', width: '85%'}}>
                      {item.productName}
                    </Text>
                    {additionalOptions[index] && (
                      <Text
                        style={{
                          marginLeft: 10,
                          fontSize: 16,
                          fontStyle: 'italic',
                          color: 'gray',
                          marginTop: 5,
                        }}>
                        {additionalOptions[index]}
                      </Text>
                    )}
                  </View>
                </View>
                <Text style={{fontSize: 17}}>${parseFloat(item.totalProductPrice).toFixed(2)}</Text>
              </View>
            ))}
            <TextInput
              placeholder="Add a note for the store"
              placeholderTextColor={'gray'}
              style={{
                width: '100%',
                backgroundColor: 'rgba(230,230,230,0.9)',
                padding: 15,
                marginTop: 15,
              }}
            />
          </View>
          {selectedTab === 'Delivery' ? (
            <View style={{marginTop: 20}}>
              <View
                style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
                <Text style={styles.heading}>Add a tip</Text>
                <TouchableOpacity
                  style={{marginLeft: 10}}
                  onPress={() => setOpenTip(prev => !prev)}>
                  <Feather name={openTip ? 'chevron-up' : 'chevron-down'} size={20} color="black" />
                </TouchableOpacity>
              </View>
              {openTip && (
                <>
                  <Text style={{fontStyle: 'italic', marginTop: 10}}>
                    Tip is an optional way to say thanks to your delivery persion
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: 10,
                    }}>
                    {['10%', '20%', '30%', 'Other'].map((tip, index) => (
                      <TouchableOpacity
                        onPress={() =>
                          selectedTip === tip ? setSelectedTip(null) : setSelectedTip(tip)
                        }
                        key={index}
                        style={{
                          paddingHorizontal: 15,
                          paddingVertical: 10,
                          borderRadius: 20,
                          borderWidth: 1,
                          backgroundColor: selectedTip === tip ? 'black' : 'white',
                        }}>
                        <Text
                          style={{
                            textAlign: 'center',
                            fontWeight: '600',
                            color: selectedTip === tip ? 'white' : 'black',
                          }}>
                          {tip}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </>
              )}
            </View>
          ) : null}

          <View
            style={{
              marginTop: 20,
              borderTopWidth: 1,
              paddingVertical: 10,
              borderTopColor: 'gray',
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 15,
              }}>
              <Text style={{fontSize: 17, fontWeight: '500'}}>Subtotal</Text>
              <Text style={styles.heading}>${totalCartPrice(state.userCart.cart)}</Text>
            </View>
            {selectedTab === 'Delivery' ? (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text style={{fontSize: 17, fontWeight: '500'}}>Delivery fee</Text>
                <Text style={styles.heading}>${deliveryfee}</Text>
              </View>
            ) : null}
            {promoCode.code ? (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: 10,
                }}>
                <Text style={{fontSize: 17, fontWeight: '500'}}>Promotion</Text>
                <Text style={{textDecorationLine: 'line-through', color: 'grey'}}>
                  ${promoCode.value}
                </Text>
              </View>
            ) : null}
          </View>
        </View>
      </ScrollView>
      <View style={styles.orderWrapper}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: 10,
          }}>
          <TouchableOpacity
            onPress={() => {
              setOpenPayment(true);
              paymentBottomSheetRef.current?.snapToIndex(0);
            }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 15,
              borderRightWidth: 1,
              width: '50%',
            }}>
            {(() => {
              switch (selectedPayment) {
                case 'Cash':
                  return <Image source={paymentMethod[0].logo} style={{width: 20, height: 20}} />;
                case 'Momo':
                  return <Image source={paymentMethod[1].logo} style={{width: 20, height: 20}} />;
                case 'Credit or debit card':
                  return <Image source={paymentMethod[2].logo} style={{width: 20, height: 20}} />;
                default:
                  return <Image source={paymentMethod[0].logo} style={{width: 20, height: 20}} />;
              }
            })()}
            <Text
              numberOfLines={1}
              style={{marginLeft: 10, fontSize: 17, fontWeight: '500', width: '80%'}}>
              {selectedPayment}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              alignItems: 'center',
              padding: 15,
              width: '50%',
              flexDirection: 'row',
              justifyContent: 'flex-end',
            }}
            onPress={() => {
              setOpenPromo(true);
              promoBottomSheetRef.current?.snapToIndex(0);
            }}>
            <Text numberOfLines={1} style={{marginLeft: 10, fontSize: 17, fontWeight: '500'}}>
              {promoCode.code ?? 'Add a promo'}
            </Text>
            {promoCode.code ? (
              <TouchableOpacity style={{marginLeft: 10}} onPress={() => setPromoCode({})}>
                <MaterialCommunityIcon name="close-circle" size={20} color={colors.secondary} />
              </TouchableOpacity>
            ) : null}
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            paddingVertical: 10,
          }}>
          <View>
            {promoCode.code ? (
              <>
                <Text
                  style={{
                    marginTop: 10,
                    fontSize: 17,
                    fontWeight: '500',
                    textDecorationLine: 'line-through',
                    color: colors.secondary,
                    marginBottom: 10,
                  }}>
                  $
                  {selectedTab === 'Delivery'
                    ? (
                        parseFloat(totalCartPrice(state.userCart.cart)) + parseFloat(deliveryfee)
                      ).toFixed(2)
                    : parseFloat(totalCartPrice(state.userCart.cart)).toFixed(2)}
                </Text>
                <Text style={styles.heading}>
                  $
                  {selectedTab === 'Delivery'
                    ? (
                        parseFloat(totalCartPrice(state.userCart.cart)) +
                        parseFloat(deliveryfee) -
                        parseFloat(promoCode.value)
                      ).toFixed(2)
                    : parseFloat(
                        totalCartPrice(state.userCart.cart) - parseFloat(promoCode.value),
                      ).toFixed(2)}
                </Text>
              </>
            ) : (
              <>
                <Text style={styles.heading}>Total</Text>
                <Text style={{marginTop: 10, fontSize: 17, fontWeight: '500'}}>
                  $
                  {selectedTab === 'Delivery'
                    ? (
                        parseFloat(totalCartPrice(state.userCart.cart)) + parseFloat(deliveryfee)
                      ).toFixed(2)
                    : parseFloat(totalCartPrice(state.userCart.cart)).toFixed(2)}
                </Text>
              </>
            )}
          </View>
          <TouchableOpacity
            onPress={() => {
              PlaceOrder();
            }}
            style={{width: '70%', backgroundColor: 'black', padding: 15}}>
            <Text style={{color: 'white', fontWeight: 'bold', fontSize: 18, textAlign: 'center'}}>
              Place order
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <BottomSheet
        ref={promoBottomSheetRef}
        index={-1}
        snapPoints={promoSnapPoint}
        enablePanDownToClose
        backgroundStyle={{
          shadowColor: '#000',
          shadowOffset: {
            width: 1,
            height: openPromo ? -Dimensions.get('window').height : 0, // to lightoff the background
          },
          shadowOpacity: 0.2,
          shadowRadius: 0,
        }}
        onChange={index => (index === -1 ? setOpenPromo(false) : null)}>
        <PromotionList
          providerId={state.userCart.provider_id}
          onSelect={promo => {
            setPromoCode(promo);
            setOpenPromo(false);
            promoBottomSheetRef.current?.close();
          }}
          currentSubtotal={totalCartPrice(state.userCart.cart)}
        />
      </BottomSheet>
      <BottomSheet
        ref={paymentBottomSheetRef}
        index={-1}
        snapPoints={paymentSnapPoint}
        enablePanDownToClose
        onChange={index => (index === -1 ? setOpenPayment(false) : null)}
        backgroundStyle={{
          shadowColor: '#000',
          shadowOffset: {
            width: 1,
            height: openPayment ? -Dimensions.get('window').height : 0, // to lightoff the background
          },
          shadowOpacity: 0.2,
          shadowRadius: 0,
        }}>
        <PaymentMethodList
          data={paymentMethod}
          selected={selectedPayment}
          onSelect={item => {
            setSelectedPayment(item);
            paymentBottomSheetRef.current.close();
          }}
        />
      </BottomSheet>
      <SchedulePickerModal
        visible={openSchedule}
        provider_id={state.userCart.provider_id}
        onClose={() => setOpenSchedule(false)}
        onConfirm={time => {
          console.log(time.day + ' ' + time.time);
          setScheduleTime(time.day + ' ' + time.time);
          setOpenSchedule(false);
        }}
      />
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
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  content: {
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  heading: {
    fontSize: 17,
    fontWeight: '600',
  },
  tabWrapper: {
    width: '100%',
    backgroundColor: 'rgb(230,230,230)',
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    padding: 5,
  },
  tab: {
    width: '50%',
    borderRadius: 15,
    padding: 10,
  },
  options: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  radioButton: {
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#787878',
    width: 20,
    height: 20,
    marginRight: 10,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputField: {
    padding: 15,
    backgroundColor: 'rgba(230,230,230,0.9)',
    width: '70%',
  },
  orderWrapper: {
    width: '100%',
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: 'rgb(230,230,230)',
  },
  bottomSheetContainer: {
    backgroundColor: 'white',
    paddingBottom: 15,
  },
});
