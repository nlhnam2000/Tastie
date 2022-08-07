import React, {useEffect, useRef, useState, useMemo, useCallback} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  StatusBar,
  ActivityIndicator,
  Platform,
  Dimensions,
  SafeAreaView,
  Button,
  ScrollView,
} from 'react-native';
import BottomSheet, {
  BottomSheetModalProvider,
  BottomSheetModal,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import {NavigationBar} from '../../components/Menu/NavigationBar';
import Feather from 'react-native-vector-icons/Feather';
import colors from '../../colors/colors';
import {NavigateToHome} from '../../store/action/navigation';
import {
  RemoveCart,
  IncreaseQuantity,
  DecreaseQuantity,
  SubmitOrder,
  UpdateQuantity,
  ClearCart,
} from '../../store/action/cart';
import {DuoAlertDialog} from '../../components/Error/AlertDialog';
import {RecommendedProducts} from '../../components/Modal/RecommendedProducts';

const {width} = Dimensions.get('screen');

export const Cart = props => {
  const dispatch = useDispatch();
  const state = useSelector(state => state.UserReducer);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [additionalOptions, setAdditionalOptions] = useState([]);
  const isFocus = useIsFocused();

  useEffect(() => {
    // if (state.userCart.provider_name !== null) {
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
    // }
    // console.log(state.userCart.cart);
    // let listProduct = state.userCart.cart.map((item, index) => ({
    //   ...item,
    //   additionalOption: [],
    //   additionalOptions: [],
    // }));
    setLoading(false);
  }, []);

  // useEffect(() => {
  //   console.log(additionalOptions);
  // }, [additionalOptions]);

  const totalCartPrice = cart => {
    let price = 0.0;
    for (let i = 0; i < cart.length; i++) {
      price += parseFloat(cart[i].totalProductPrice);
    }

    return price.toFixed(2);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <ActivityIndicator size={'large'} color={colors.red} />
        </View>
        <NavigationBar {...props} active={props.tabname} />
      </View>
    );
  }

  if (state.userCart.provider_name === null) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
          <Text style={{fontSize: 19, marginBottom: 20, fontWeight: '600'}}>
            There is nothing in your cart
          </Text>
          <TouchableOpacity
            style={{width: '40%', backgroundColor: 'black', borderRadius: 25, padding: 15}}
            onPress={() => dispatch(NavigateToHome())}>
            <Text style={{fontSize: 18, fontWeight: 'bold', color: 'white', textAlign: 'center'}}>
              Go order !
            </Text>
          </TouchableOpacity>
        </SafeAreaView>

        <NavigationBar {...props} active={props.tabname} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.content}>
        <ScrollView style={{width: '100%', height: '80%'}}>
          <TouchableOpacity
            style={styles.headerWrapper}
            onPress={() =>
              props.navigation.navigate('DetailProvider', {
                data: {provider_id: state.userCart.provider_id},
              })
            }>
            <Text
              style={{
                fontWeight: '600',
                fontSize: 18,
                textAlign: 'center',
              }}>
              {state.userCart.provider_name}
            </Text>
            <Text style={{textAlign: 'center', marginTop: 10, color: 'gray'}}>
              {state.userCart.date}
            </Text>
          </TouchableOpacity>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'center',
              width: '100%',
              paddingHorizontal: 0,
            }}>
            {/* <TouchableOpacity
              onPress={openRecommendProducts}
              style={{
                paddingHorizontal: 20,
                borderRadius: 10,
              }}>
              <Text style={{fontWeight: '500', color: 'black'}}>Show recommended products</Text>
            </TouchableOpacity> */}
            <TouchableOpacity
              onPress={() => dispatch(ClearCart(state.user_id))}
              style={{
                paddingHorizontal: 20,
                borderRadius: 10,
              }}>
              <Text style={{fontWeight: '500', color: colors.red}}>Clear all</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.cartWrapper}>
            {state.userCart.cart.map((item, index) => (
              <View
                style={styles.cartItem}
                key={index}
                // onPress={() => dispatch(RemoveCart(item))}
              >
                <View style={styles.cartItemLeft}>
                  {additionalOptions[index] !== '' ? (
                    <View style={{justifyContent: 'flex-start', alignItems: 'flex-start'}}>
                      <Text style={{fontSize: 17, fontWeight: '500'}}>{item.productName}</Text>
                      <Text style={{marginTop: 5, fontSize: 14, color: 'gray'}}>
                        {additionalOptions[index]}
                      </Text>
                      {item.SpecialInstruction !== '' ? (
                        <Text style={{marginTop: 5, fontSize: 14, color: 'gray'}}>
                          Note: {item.SpecialInstruction}
                        </Text>
                      ) : null}
                    </View>
                  ) : (
                    <>
                      <Text style={{marginLeft: 20, fontSize: 17, fontWeight: '500'}}>
                        {item.productName}
                      </Text>
                      {item.SpecialInstruction !== '' ? (
                        <Text style={{marginTop: 5, fontSize: 14, color: 'gray'}}>
                          Note: {item.SpecialInstruction}
                        </Text>
                      ) : null}
                    </>
                  )}
                </View>
                <View style={styles.cartItemRight}>
                  <Text style={{fontWeight: '500', fontSize: 18}}>
                    ${parseFloat(item.totalProductPrice).toFixed(2)}
                  </Text>

                  <View style={styles.quantityWrapper}>
                    <TouchableOpacity
                      style={{marginRight: 10}}
                      onPress={() =>
                        item.quantity > 1
                          ? dispatch(
                              UpdateQuantity(
                                state.user_id,
                                item.product_id,
                                item.specialInstruction,
                                item.quantity - 1,
                                item.item_code,
                              ),
                            )
                          : dispatch(RemoveCart(state.user_id, item.product_id, item.item_code))
                      }>
                      <Feather name="minus-circle" size={21} color={'black'} />
                    </TouchableOpacity>
                    <Text style={{marginRight: 10, fontSize: 18}}>{item.quantity}</Text>
                    <TouchableOpacity
                      style={{}}
                      onPress={() =>
                        dispatch(
                          UpdateQuantity(
                            state.user_id,
                            item.product_id,
                            item.specialInstruction,
                            item.quantity + 1,
                            item.item_code,
                          ),
                        )
                      }>
                      <Feather name="plus-circle" size={21} color={'black'} />
                    </TouchableOpacity>
                  </View>
                </View>
                {/* <DuoAlertDialog
                message={'Are you sure to delete from the cart ?'}
                onConfirm={() => {
                  dispatch(RemoveCart(item));
                  setOpenModal(false); // to prevent the modal will not toggled again
                }}
                onCancel={() => setOpenModal(false)}
                visible={openModal}
              /> */}
              </View>
            ))}
          </View>
          <View style={styles.totalPriceWrapper}>
            <Text style={{fontWeight: '400', fontSize: 17}}>Total: </Text>
            <Text style={{fontWeight: '600', fontSize: 17}}>
              ${totalCartPrice(state.userCart.cart)}
            </Text>
          </View>
        </ScrollView>
        <View style={{width, paddingHorizontal: 20, marginTop: -10}}>
          <TouchableOpacity
            onPress={() => props.navigation.navigate('GoToCheckout')}
            style={{
              width: '100%',
              backgroundColor: 'black',
              paddingVertical: 15,
              paddingHorizontal: 20,
            }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: '600',
                color: 'white',
                textTransform: 'uppercase',
                textAlign: 'center',
              }}>
              Go to checkout
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <NavigationBar {...props} active={props.tabname} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  content: {
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    width,
  },
  headerWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 0,
    paddingBottom: 10,
    marginTop: Platform.OS === 'android' ? 20 : 0,
  },
  cartWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 10,
    marginBottom: 40,
  },
  cartItem: {
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgb(230,230,230)',
  },
  cartItemLeft: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cartItemRight: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
  },
  totalPriceWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width,
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  quantityWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  submitOrderButton: {
    width: '100%',
    backgroundColor: 'black',
    padding: 15,
  },
});
