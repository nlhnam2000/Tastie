import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text, ActivityIndicator, TouchableOpacity} from 'react-native';
import colors from '../../colors/colors';
import axios from 'axios';
import {IP_ADDRESS} from '../../global';
import moment from 'moment';

export const PromotionDetail = ({data, onClose}) => {
  const [loading, setLoading] = useState(true);
  const [promotion, setPromotion] = useState({});

  const LoadPromotionDetail = async promotion_code => {
    try {
      let res = await axios.get(
        `https://${IP_ADDRESS}/v1/api/tastie/order/get-promos-detail/${promotion_code}`,
      );

      if (res.data.status) {
        setPromotion(res.data.promos_detail);
      }
    } catch (error) {
      console.error('Cannot get promotion detail', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // LoadPromotionDetail(props.code);
    setLoading(false);
  }, []);

  // useEffect(() => {
  //   if (props.code) {
  //     LoadPromotionDetail(props.code);
  //   }
  // }, [props.code]);

  if (loading) {
    return (
      <View style={[styles.container, {justifyContent: 'center'}]}>
        <ActivityIndicator size={'large'} color={colors.red} />
      </View>
    );
  }

  return (
    <View style={[styles.container]}>
      <View style={{paddingHorizontal: 20, width: '100%'}}>
        <Text style={styles.heading}>{data.code}</Text>
        <Text style={[styles.smallheading, {marginTop: 10}]}>{data.name}</Text>
        <Text style={{marginTop: 40, fontSize: 19, fontWeight: '500'}}>Details</Text>
        <Text style={{fontSize: 17, marginVertical: 10}}>• {data.description}</Text>
        <Text style={{fontSize: 17, marginBottom: 10}}>
          • Minimun order: ${data.min_order_value}
        </Text>
        <Text style={{fontSize: 17, marginBottom: 10}}>
          • Maximunm discount: ${data.max_discount_value}
        </Text>
        {/* <Text style={{fontSize: 17, marginBottom: 10}}>
          • Payment method: {data.promos_methode_payment}
        </Text> */}
        <View
          style={{
            paddingVertical: 15,
            borderBottomWidth: 1,
            marginTop: 20,
            borderBottomColor: 'rgb(230,230,230)',
          }}>
          <Text style={{fontSize: 19, fontWeight: '500'}}>Expiration</Text>
          <Text style={{fontSize: 17, marginVertical: 10, color: 'gray'}}>
            {moment('12:00:00 30/4/2023', 'HH:MM:SS DD:MM:YYYY').format('llll')}
          </Text>
        </View>
        <View
          style={{
            paddingVertical: 15,
            borderBottomWidth: 1,
            marginTop: 20,
            borderBottomColor: 'rgb(230,230,230)',
          }}>
          <Text style={{fontSize: 19, fontWeight: '500'}}>Location</Text>
          <Text style={{fontSize: 17, marginVertical: 10, color: 'gray'}}>
            Valid on this merchant only
          </Text>
        </View>
        <TouchableOpacity
          style={{padding: 15, width: '100%', backgroundColor: 'black'}}
          onPress={() => onClose()}>
          <Text style={[styles.heading, {color: 'white', textAlign: 'center'}]}>GOT IT</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  heading: {
    fontSize: 18,
    fontWeight: '600',
  },
  subheading: {
    fontSize: 17,
    fontWeight: '500',
    marginBottom: 5,
  },
  smallheading: {
    fontSize: 15,
    color: 'gray',
  },
});
