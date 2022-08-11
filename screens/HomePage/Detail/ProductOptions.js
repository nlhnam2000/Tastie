import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
  TextInput,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  Animated,
  Platform,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../../../colors/colors';
import {useDispatch, useSelector} from 'react-redux';
import {AddToCart, ClearCart} from '../../../store/action/cart';
import {DuoAlertDialog} from '../../../components/Error/AlertDialog';
import FastImage from 'react-native-fast-image';
import axios from 'axios';
import {IP_ADDRESS} from '../../../global';
import {ActivityIndicator} from 'react-native-paper';

const {width, height} = Dimensions.get('window');

export const ProductOptions = props => {
  const [loading, setLoading] = useState(true);
  const [productOptions, setProductOptions] = useState([]);
  const [note, setNote] = useState('');
  const [quantity, setQuantity] = useState(1);
  const {data, provider_id, provider_name, location, address} = props.route.params;
  const dispatch = useDispatch();
  const state = useSelector(state => state.UserReducer);
  const [totalPrice, setTotalPrice] = useState(parseFloat(data.price).toFixed(2));
  const [cartForm, setCartForm] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [FBT, setFBT] = useState([]);
  const [selectedFBT, setSelectedFBT] = useState([]);

  const handleAddToCart = () => {
    if (state.userCart.provider_id && state.userCart.provider_id !== cartForm.provider_id) {
      setOpenModal(true);
      // dispatch(ClearCart(state.user_id));
    } else {
      dispatch(AddToCart(cartForm));
      if (selectedFBT.length > 0) {
        for (item of selectedFBT) {
          dispatch(
            AddToCart({
              user_id: state.user_id,
              provider_id: provider_id,
              provider_name: provider_name,
              cartItem: {
                product_id: item.product_id,
                productName: item.product_name,
                productPrice: item.price,
                productImage: item.product_image,
                quantity: 1,
                special_instruction: '',
                additional_option: [],
                totalProductPrice: item.price,
              },
              location: location,
              address: address,
            }),
          );
        }
      }
      setTimeout(() => {
        props.navigation.goBack();
      }, 800);
      // console.log(cartForm);
    }
  };

  const handleTickFBT = index => {
    const copy = [...FBT];
    copy[index].checked = !copy[index].checked;

    setFBT(copy);
  };

  const GetFBT = async () => {
    try {
      const res = await axios.post(`http://${IP_ADDRESS}:3007/v1/api/tastie/get-product-bundling`, {
        provider_id: provider_id,
        product_list: [data.product_id],
      });

      if (res.data.response.length > 0) {
        setFBT(res.data.response);
      }
    } catch (error) {
      console.log('Cannot get FBT', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // console.log(FBT.filter(f => f.checked === true));
    setSelectedFBT(FBT.filter(f => f.checked === true));
  }, [FBT]);

  useEffect(() => {
    if (data.product_options[0].option_name !== null) {
      setProductOptions(data.product_options);
    }
    console.log(data.product_id);
    // setLoading(false);
    GetFBT();
  }, []);

  useEffect(() => {
    let sum = 0;
    if (selectedFBT.length > 0) {
      sum = selectedFBT.reduce((prev, curr) => {
        return prev + curr.price;
      }, 0);
      console.log(sum);
    }
    setTotalPrice(parseFloat(parseFloat(data.price) * quantity + parseFloat(sum)).toFixed(2));
  }, [quantity, selectedFBT]);

  useEffect(() => {
    setCartForm(prev => ({
      ...prev,
      user_id: state.user_id,
      provider_id: provider_id,
      provider_name: provider_name,
      cartItem: {
        product_id: data.product_id,
        productName: data.product_name,
        productPrice: data.price,
        productImage: data.product_image,
        quantity: quantity,
        special_instruction: note,
        additional_option: [...productOptions],
        totalProductPrice: totalPrice,
      },
      location: location,
      address: address,
    }));
  }, [productOptions, quantity, totalPrice, note]);

  if (loading) {
    return (
      <View style={[styles.container, {justifyContent: 'center', alignItems: 'center'}]}>
        <ActivityIndicator size={'small'} color={colors.red} />
      </View>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerWrapper}>
        <TouchableOpacity style={styles.backButton} onPress={() => props.navigation.goBack()}>
          <Feather name="arrow-left" size={20} color={'black'} />
        </TouchableOpacity>
        <Text style={{fontWeight: '600', fontSize: 18, marginLeft: 15, width: '90%'}}>
          {data.product_name}
        </Text>
      </View>
      <ScrollView
        // style={{backgroundColor: '#f2f2f2'}}
        contentContainerStyle={{backgroundColor: '#f2f2f2'}}>
        {/* Image */}
        <View style={styles.foodImageWrapper}>
          <FastImage
            source={{uri: data.product_image}}
            resizeMode={FastImage.resizeMode.cover}
            style={{width, height: 200}}
          />
          {/* <View style={{padding: 10, marginTop: 10, backgroundColor: 'white'}}>
            <Text style={{fontSize: 25, fontWeight: '500'}}>{data.product_name}</Text>
          </View> */}
        </View>

        <View style={{width: '100%', padding: 10, marginTop: 10, backgroundColor: 'white'}}>
          <Text style={{fontSize: 19, fontWeight: '600', marginBottom: 10}}>
            Special instruction
          </Text>
          <View style={{backgroundColor: '#f2f2f2', padding: 5, paddingTop: -5}}>
            <TextInput
              style={{height: 60, justifyContent: 'flex-start', textAlignVertical: 'top'}}
              placeholder="For example: no spicy, ..."
              placeholderTextColor={'gray'}
              onChangeText={text => setNote(text)}
              multiline={true}
              numberOfLines={4}
              underlineColorAndroid="transparent"
            />
          </View>
        </View>
        <View style={{width: '100%', padding: 10, marginTop: 10, backgroundColor: 'white'}}>
          <Text style={{fontSize: 19, fontWeight: '600', marginBottom: 10}}>
            Frequently Bought Together
          </Text>
          {FBT.map((item, index) => (
            <View
              key={index}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginVertical: 10,
                paddingHorizontal: 10,
              }}>
              <View style={{flexDirection: 'row', width: '70%'}}>
                <TouchableOpacity onPress={() => handleTickFBT(index)}>
                  <MaterialCommunityIcon
                    name={item.checked ? 'checkbox-marked' : 'checkbox-blank-outline'}
                    size={25}
                    color="black"
                  />
                </TouchableOpacity>
                <View style={{marginLeft: 10}}>
                  <Text style={{fontSize: 16, fontWeight: '500'}}>{item.product_name}</Text>
                  <Text style={{fontSize: 14, color: 'grey', marginTop: 3}}>
                    ${item.price.toFixed(2)}
                  </Text>
                </View>
              </View>
              <FastImage
                source={{uri: item.product_image}}
                style={{width: 80, height: 80}}
                resizeMode={FastImage.resizeMode.cover}
              />
            </View>
          ))}
        </View>
        <View style={styles.quantityWrapper}>
          <TouchableOpacity
            style={{marginRight: 20, opacity: quantity < 2 ? 0.4 : 1}}
            disabled={quantity < 2 ? true : false}
            onPress={() => setQuantity(prevState => prevState - 1)}>
            <Feather name="minus-circle" size={30} color={'black'} />
          </TouchableOpacity>
          <Text style={{marginRight: 20, fontSize: 21}}>{quantity}</Text>
          <TouchableOpacity
            style={{opacity: quantity > 9 ? 0.4 : 1}}
            disabled={quantity > 9 ? true : false}
            onPress={() => setQuantity(prevState => prevState + 1)}>
            <Feather name="plus-circle" size={30} color={'black'} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.orderButtonWrapper}>
        <TouchableOpacity style={styles.orderButton} onPress={() => handleAddToCart()}>
          <Text
            style={{
              textAlign: 'center',
              fontWeight: '500',
              color: 'white',
              fontSize: 18,
            }}>
            Add to cart{' • '}
            <Text
              style={{
                textAlign: 'center',
                fontWeight: '500',
                color: 'white',
                fontSize: 18,
              }}>
              ${totalPrice}
            </Text>
          </Text>
        </TouchableOpacity>
      </View>
      <DuoAlertDialog
        visible={openModal}
        message={`Do you want to clear the previous cart from ${state.userCart.provider_name} ?`}
        onCancel={() => setOpenModal(false)}
        onConfirm={() => {
          dispatch(ClearCart(state.user_id));

          setTimeout(() => {
            dispatch(AddToCart(cartForm));
            props.navigation.goBack();
          }, 800);
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: 'white',
    height: height,
    // position: 'relative',
  },
  headerWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: width,
    paddingHorizontal: 20,
    paddingBottom: 10,
    marginTop: Platform.OS === 'android' ? 20 : 5,
  },
  foodImageWrapper: {
    width,
    backgroundColor: 'white',
    paddingBottom: 15,
  },
  additionalOptionWrapper: {
    padding: 20,
    backgroundColor: 'rgba(230,230,230, 0.4)',
    width,
  },
  additionalTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownButton: {
    padding: 5,
    borderRadius: 20,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'rgb(220,220,220)',
  },
  dropdownContent: {
    paddingHorizontal: 20,
    width,
  },
  dropdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(230,230,230,0.7)',
  },
  orderButtonWrapper: {
    paddingHorizontal: 20,
    paddingVertical: Platform.OS === 'android' ? 20 : 5,
    width,
    justifyContent: 'center',
    alignItems: 'center',
    // position: 'absolute',
    // bottom: -120,
  },
  orderButton: {
    width: '100%',
    padding: 15,
    backgroundColor: 'black',
  },
  quantityWrapper: {
    flexDirection: 'row',
    width,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: 'white',
    padding: 10,
  },
});
