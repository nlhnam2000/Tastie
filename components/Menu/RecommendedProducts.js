import React, {useState, useEffect} from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet, FlatList, Dimensions} from 'react-native';

import axios from 'axios';
import {useSelector} from 'react-redux';
import {IP_ADDRESS} from '../../global';
import FastImage from 'react-native-fast-image';
import colors from '../../colors/colors';
import {SimpleSkeleton} from '../Skeleton/SimpleSkeleton';

const {width} = Dimensions.get('window');

export const RecommendedProducts = props => {
  const state = useSelector(state => state.UserReducer);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const LoadRecommendedProducts = async user_id => {
    try {
      const res = await axios.get(
        `https://${IP_ADDRESS}/v1/api/tastie/get-recommendations-for-customers/${user_id}`,
      );
      if (res.data.status) {
        setData(res.data.response.filter(r => Object.keys(r).length > 2));
      }
    } catch (error) {
      console.log('Cannot get recommendation', error);
    }

    setLoading(false);
  };

  const renderProductList = ({item, index}) => (
    <TouchableOpacity
      style={[styles.foodWrapper]}
      onPress={() =>
        props.navigation.navigate('DetailProvider', {
          data: item.product_infor.provider_id,
          productTarget: item.product_id,
        })
      }>
      <View style={[styles.foodInfo]}>
        <View>
          <Text style={{fontWeight: '600', fontSize: 17, marginBottom: 10}}>
            {item.product_infor.product_name}
          </Text>
          <Text>${item.product_infor.price.toFixed(2)}</Text>
        </View>
        <Text style={{color: 'gray'}}>Go to restaurant</Text>
      </View>
      <FastImage
        source={{uri: item.product_infor.product_image}}
        style={{width: 110, height: 110}}
        resizeMode={FastImage.resizeMode.cover}
      />
    </TouchableOpacity>
  );

  useEffect(() => {
    LoadRecommendedProducts(state.user_id);
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <SimpleSkeleton />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recommended for you</Text>
      <FlatList
        data={data}
        keyExtractor={item => item.product_id}
        renderItem={renderProductList}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
    width,
    paddingVertical: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    paddingLeft: 20,
  },
  flexRowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  foodWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    width: width,
    paddingRight: 20,
    marginTop: 20,
    // borderRightWidth: 1,
    // borderRightColor: '#e6e6e6',
  },
  foodInfo: {
    justifyContent: 'space-between',
    height: 110,
    width: width - 120,
    paddingLeft: 20,
  },
});
