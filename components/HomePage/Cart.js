import React, {useEffect, useRef, useState} from 'react';
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
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {NavigationBar} from '../Menu/NavigationBar';
import Feather from 'react-native-vector-icons/Feather';
import colors from '../../colors/colors';
import {NavigateToHome} from '../../store/action/navigation';
import {popularData} from '../../assets/dummy/popularData';
import {
  RemoveCart,
  IncreaseQuantity,
  DecreaseQuantity,
  OrderConfirmed,
} from '../../store/action/cart';
import {DuoAlertDialog} from '../Error/AlertDialog';
import io from 'socket.io-client';

const {width} = Dimensions.get('screen');

export const Cart = props => {
  const dispatch = useDispatch();
  const state = useSelector(state => state.UserReducer);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [additionalOptions, setAdditionalOptions] = useState([]);

  useEffect(() => {
    if (state.userCart.provider_name !== null) {
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
    }

    setLoading(false);
    // console.log(typeof state.userCart.cart[0].totalProductPrice);
  }, []);

  useEffect(() => {
    console.log(additionalOptions);
  }, [additionalOptions]);

  const totalCartPrice = cart => {
    let price = 0.0;
    for (let i = 0; i < cart.length; i++) {
      price += parseFloat(cart[i].totalProductPrice);
    }

    return price.toFixed(2);
  };

  const getProviderInfo = provider_id => {
    console.log(popularData[provider_id - 1]);
    let provider = popularData[provider_id - 1];
    dispatch(NavigateToHome());
    props.navigation.navigate('DetailProvider', {data: provider});
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <ActivityIndicator size={'large'} color={colors.red} />
        </View>
        <NavigationBar active={props.tabname} />
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

        <NavigationBar active={props.tabname} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.content}>
        <TouchableOpacity
          style={styles.headerWrapper}
          onPress={() => getProviderInfo(state.userCart.provider_id)}>
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
                  </View>
                ) : (
                  <Text style={{marginLeft: 20, fontSize: 17, fontWeight: '500'}}>
                    {item.productName}
                  </Text>
                )}
              </View>
              <View style={styles.cartItemRight}>
                <Text style={{fontWeight: '500', fontSize: 18}}>${item.totalProductPrice}</Text>

                <View style={styles.quantityWrapper}>
                  <TouchableOpacity style={{marginRight: 10}}>
                    <Feather
                      name="minus-circle"
                      size={21}
                      color={'black'}
                      onPress={() =>
                        item.quantity > 1 ? dispatch(DecreaseQuantity(item)) : setOpenModal(true)
                      }
                    />
                  </TouchableOpacity>
                  <Text style={{marginRight: 10, fontSize: 18}}>{item.quantity}</Text>
                  <TouchableOpacity style={{}} onPress={() => dispatch(IncreaseQuantity(item))}>
                    <Feather name="plus-circle" size={21} color={'black'} />
                  </TouchableOpacity>
                </View>
              </View>
              <DuoAlertDialog
                message={'Are you sure to delete from the cart ?'}
                onConfirm={() => {
                  dispatch(RemoveCart(item));
                  setOpenModal(false); // to prevent the modal will not toggled again
                }}
                onCancel={() => setOpenModal(false)}
                visible={openModal}
              />
            </View>
          ))}
        </View>
        <View style={styles.totalPriceWrapper}>
          <Text style={{fontWeight: '400', fontSize: 17}}>Total: </Text>
          <Text style={{fontWeight: '600', fontSize: 17}}>
            ${totalCartPrice(state.userCart.cart)}
          </Text>
        </View>
        {state.userCart.status !== null ? (
          <Button
            title="Watch your order"
            color={colors.primary}
            onPress={() =>
              props.navigation.navigate('OrderStatus', {order: null, customerData: null})
            }
          />
        ) : (
          <Button
            title="Submit order"
            color={colors.primary}
            onPress={() => {
              dispatch(OrderConfirmed());
              props.navigation.navigate('OrderStatus', {order: state.userCart});
            }}
          />
        )}

        <Button title="Show" onPress={() => console.log(state.userCart)} />
      </SafeAreaView>
      <NavigationBar active={props.tabname} />
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
    justifyContent: 'flex-start',
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
    justifyContent: 'flex-end',
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
});
