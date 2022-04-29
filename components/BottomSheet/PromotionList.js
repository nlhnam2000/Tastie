import React, {useState, useEffect, useRef} from 'react';
import {View, Text, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator} from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
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
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3,
        }}>
        <TouchableOpacity style={styles.promotionName}>
          <Text style={{fontSize: 17, fontWeight: '500'}}>{item.promotion_code}</Text>
          {!item.isAvailable ? (
            <Text style={{color: 'red', marginTop: 10}} numberOfLines={2}>{`You need to pay more ${(
              item.min_order_value - props.currentSubtotal
            ).toFixed(2)}$ to apply this promotion`}</Text>
          ) : null}
        </TouchableOpacity>
        <TouchableOpacity
          disabled={!item.isAvailable}
          style={styles.applyButton}
          onPress={() => props.onSelect(item.promotion_code)}>
          <Text style={{textAlign: 'center'}}>Apply</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const LoadPromotionList = async provider_id => {
    try {
      let res = await axios.get(
        `http://${IP_ADDRESS}:3007/v1/api/tastie/checkout/get_promotion/${provider_id}`,
      );
      if (res.data.status) {
        res.data.response.promotion.map(
          item =>
            (item['isAvailable'] = props.currentSubtotal < item.min_order_value ? false : true),
        );
        setPromos(res.data.response.promotion);
      }
    } catch (error) {
      console.error('Cannot get promotion list', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    LoadPromotionList(props.providerId);
  });

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
      keyExtractor={item => item.promotion_code}
      renderItem={renderPromotion}
      ListHeaderComponent={
        <View style={{width: '100%'}}>
          <Text style={{fontSize: 16, fontWeight: '500', textAlign: 'center'}}>
            These are the available promotions
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