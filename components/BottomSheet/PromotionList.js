import React, {useState, useEffect, useRef} from 'react';
import {View, Text, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator} from 'react-native';
import axios from 'axios';

import colors from '../../colors/colors';
import {IP_ADDRESS} from '../../global';

export const PromotionList = props => {
  const [loading, setLoading] = useState(true);
  const [promos, setPromos] = useState([]);
  // const [isAvailable, setIsAvailable] = useState(true)

  const renderPromotion = ({item}) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          width: '100%',
          backgroundColor: 'white',
          marginVertical: 10,
          paddingVertical: 10,
          opacity: item.isAvailable ? 1 : 0.5,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: '#c4c4c4',
        }}>
        <TouchableOpacity style={styles.promotionName}>
          <Text style={{fontSize: 17, fontWeight: '500'}}>{item.code}</Text>
          {!item.isAvailable ? (
            <Text style={{color: 'red', marginTop: 10}} numberOfLines={2}>{`You need to pay more ${(
              item.min_order_value - props.currentSubtotal
            ).toFixed(2)}$ to apply this promotion`}</Text>
          ) : null}
        </TouchableOpacity>
        <TouchableOpacity
          disabled={!item.isAvailable}
          style={styles.applyButton}
          onPress={() => {
            props.onSelect(item);
          }}>
          <Text style={{textAlign: 'center'}}>Apply</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const LoadPromotionList = async provider_id => {
    try {
      let res = await axios.get(
        `https://${IP_ADDRESS}/v1/api/tastie/checkout/get-all-promos/${provider_id}`,
      );
      if (res.data.status) {
        res.data.response.promotion.map(
          item =>
            (item['isAvailable'] = props.currentSubtotal < item.min_order_value ? false : true),
        );
        res.data.response.ecoupon.map(
          item =>
            (item['isAvailable'] = props.currentSubtotal < item.min_order_value ? false : true),
        );
        setPromos(res.data.response.promotion.concat(res.data.response.ecoupon));
      }
    } catch (error) {
      console.log('Cannot get promotion list', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    LoadPromotionList(props.providerId);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, {justifyContent: 'center'}]}>
        <ActivityIndicator size={'large'} color={colors.red} />
      </View>
    );
  }

  return (
    <FlatList
      data={promos}
      keyExtractor={item => item.id}
      renderItem={renderPromotion}
      ListHeaderComponent={
        <View style={{width: '100%'}}>
          <Text style={{fontSize: 16, fontWeight: '500', textAlign: 'center', marginBottom: 10}}>
            {promos.length > 0
              ? 'These are the available promotions'
              : 'There is no available promotion'}
          </Text>
        </View>
      }
      style={{backgroundColor: 'rgba(230,230,230,0.4)', padding: 20}}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  promotionName: {
    width: '75%',
    padding: 10,
    borderRightWidth: 1,
    borderColor: 'gray',
  },
  applyButton: {
    width: '25%',
    padding: 10,
  },
});
