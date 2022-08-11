import React, {useState, useRef, useEffect, useCallback, useMemo} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Dimensions, FlatList} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import BottomSheet from '@gorhom/bottom-sheet';
import colors from '../../colors/colors';
import axios from 'axios';
import FastImage from 'react-native-fast-image';
import {IP_ADDRESS} from '../../global';
import {useSelector, useDispatch} from 'react-redux';
import {AddToCart} from '../../store/action/cart';

const FULL_WIDTH = Dimensions.get('screen').width;

export const RecommendedProducts = ({
  user_id,
  navigation,
  onClose,
  onClick,
  selfToggle,
  data,
  provider_id,
}) => {
  const [loading, setLoading] = useState(false);
  const bottomSheetRef = useRef();
  const snapPoints = useMemo(() => ['90%'], []);
  const dispatch = useDispatch();
  const state = useSelector(state => state.UserReducer);
  const [products, setProducts] = useState([]);

  const LoadRecommendedProducts = async () => {
    const productList = [...state.userCart.cart].map(item => item.product_id);
    console.log(productList);
    console.log(provider_id);
    try {
      const res = await axios.post(`http://${IP_ADDRESS}:3007/v1/api/tastie/get-product-bundling`, {
        provider_id: provider_id,
        product_list: productList,
      });

      if (res.data.status) {
        setProducts(res.data.response);
      }
    } catch (error) {
      console.log('Cannot get recommended products', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (products.length > 0) {
      selfToggle();
      console.log(products.length);
    }
  }, [products]);

  const renderItem = ({item}) => (
    <View style={styles.menuContentWrapper}>
      <View style={styles.menuContent}>
        <TouchableOpacity
          //   onPress={() =>
          //     props.navigation.navigate('ProductOptions', {
          //       data: item,
          //       provider_id: info.data.provider_id,
          //       provider_name: info.data.merchant_name,
          //       location: {
          //         latitude: parseFloat(info.data.latitude),
          //         longitude: parseFloat(info.data.longitude),
          //       },
          //       address: `${info.data.address} ${info.data.road}`,
          //     })
          //   }
          // onPress={() => navigation.navigate('DetailProvider', {data: item.provider_id})}
          onPress={() => onClick(item)}
          style={styles.foodWrapper}>
          <View style={[styles.foodInfo]}>
            <Text style={{fontWeight: '600', fontSize: 18, marginBottom: 10}}>
              {item.product_name}
            </Text>
            {/* <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <MaterialIcon name="sale" color={colors.boldred} size={17} />
              <Text style={{color: colors.boldred, marginHorizontal: 5}}>50%</Text>
              <Text style={{textDecorationLine: 'line-through', color: 'grey'}}>
                ${item.price.toFixed(2)}
              </Text>
            </View> */}
            <Text style={{marginTop: 10}}>${item.price.toFixed(2)}</Text>
            <Text style={{color: 'gray', marginTop: 10}} numberOfLines={4}>
              {item.description}
            </Text>
          </View>
          <FastImage style={styles.foodImage} source={{uri: item.product_image}} />
        </TouchableOpacity>
      </View>
    </View>
  );

  // useEffect(() => {
  //   LoadRecommendedProducts();
  // }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size={'small'} color={colors.boldred} />
      </View>
    );
  }

  return (
    <FlatList
      data={data}
      keyExtractor={item => item.product_id}
      renderItem={renderItem}
      ListHeaderComponent={
        <View style={{paddingHorizontal: 10, paddingTop: 10}}>
          <Text style={{fontWeight: '500', fontSize: 16, paddingHorizontal: 10}}>
            Maybe you would like one of these
          </Text>
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuContentWrapper: {
    width: '100%',
    marginBottom: 20,
    alignItems: 'center',
    // borderBottomColor: '#e6e6e6',
    // borderBottomWidth: 1,
    // paddingBottom: 20,
  },
  menuContent: {
    // flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 20,
  },
  foodWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
    borderTopColor: '#e6e6e6',
    borderTopWidth: 1,
    paddingTop: 20,
  },
  foodInfo: {
    width: '70%',
  },
  foodImage: {
    width: 90,
    height: 90,
    position: 'relative',
  },
});
