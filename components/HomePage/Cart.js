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
import {signout} from '../../store/action/auth';
import {NavigationBar} from '../Menu/NavigationBar';
import {Formik} from 'formik';
import Feather from 'react-native-vector-icons/Feather';
import colors from '../../colors/colors';
import {NavigateToHome} from '../../store/action/navigation';
import {popularData} from '../../assets/dummy/popularData';
import {RemoveCart} from '../../store/action/cart';

const {width} = Dimensions.get('screen');

export const Cart = props => {
  const dispatch = useDispatch();
  const state = useSelector(state => state.UserReducer);
  const [loading, setLoading] = useState(true);
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
        <View style={styles.headerWrapper}>
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
        </View>
        <View style={styles.cartWrapper}>
          {state.userCart.cart.map((item, index) => (
            <TouchableOpacity
              style={styles.cartItem}
              key={index}
              onPress={() => dispatch(RemoveCart(item))}>
              <View style={styles.cartItemLeft}>
                <Text>{item.quantity}x</Text>
                {additionalOptions[index] !== '' ? (
                  <View style={{justifyContent: 'flex-start', alignItems: 'flex-start'}}>
                    <Text style={{marginLeft: 20, fontSize: 17, fontWeight: '500'}}>
                      {item.productName}
                    </Text>
                    <Text style={{marginLeft: 20, marginTop: 5, fontSize: 14, color: 'gray'}}>
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
                <Text style={{fontWeight: '500'}}>${item.totalProductPrice}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.totalPriceWrapper}>
          <Text style={{fontWeight: '400', fontSize: 17}}>Total: </Text>
          <Text style={{fontWeight: '600', fontSize: 17}}>
            ${totalCartPrice(state.userCart.cart)}
          </Text>
        </View>
        <Button
          title="Go to the restaurant"
          color={colors.primary}
          onPress={() => getProviderInfo(state.userCart.provider_id)}
        />
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
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgb(230,230,230)',
  },
  cartItemLeft: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cartItemRight: {},
  totalPriceWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width,
    paddingHorizontal: 20,
    marginBottom: 40,
  },
});
