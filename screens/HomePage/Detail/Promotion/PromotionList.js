import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import colors from '../../../../colors/colors';
import {IP_ADDRESS} from '../../../../global';
import axios from 'axios';
import Feather from 'react-native-vector-icons/Feather';

export const PromotionsList = props => {
  const [loading, setLoading] = useState(true);
  const {provider_id} = props.route.params;
  const [promotionList, setPromotionList] = useState([]);

  useEffect(() => {
    const LoadPromotionList = async provider_id => {
      let res = await axios.get(
        `http://${IP_ADDRESS}:3007/v1/api/tastie/checkout/get_promotion/${provider_id}`,
      );
      if (res.data.status) {
        setPromotionList(res.data.response.promotion);
      }

      setLoading(false);
    };
    LoadPromotionList(provider_id);
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, {justifyContent: 'center'}]}>
        <ActivityIndicator size={'large'} color={colors.red} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerWrapper}>
        <TouchableOpacity
          style={{position: 'absolute', left: 20}}
          onPress={() => props.navigation.goBack()}>
          <Feather name="arrow-left" size={20} color="black" />
        </TouchableOpacity>
        <Text style={styles.heading}>Available promotion</Text>
      </View>
      <ScrollView style={styles.contentWrapper}>
        <Text style={styles.subheading}>Available promotion list</Text>
        <Text style={styles.smallheading}>Limit one per order</Text>
        {promotionList.map((item, index) => (
          <View key={index} style={styles.promotionItem}>
            <Text style={styles.subheading}>{item.promotion_code}</Text>
            <Text style={styles.smallheading}>Minimun: {item.min_order_value}$</Text>
            <Text style={styles.smallheading}>
              Expiration date: {new Date(item.expire_at).toLocaleDateString('vi-VI')}
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 15}}>
              <TouchableOpacity
                style={{padding: 10, borderRadius: 20, backgroundColor: 'green', marginRight: 20}}>
                <Text style={{fontSize: 17, fontWeight: '500', color: 'white'}}>Selected</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{padding: 10, borderRadius: 10}}>
                <Text style={{fontSize: 17, fontWeight: '500'}}>Detail</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
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
    paddingHorizontal: 20,
    paddingVertical: 10,
    width: '100%',
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(230,230,230,1.0)',
  },
  heading: {
    fontSize: 18,
    fontWeight: '600',
  },
  contentWrapper: {
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 20,
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
  promotionItem: {
    paddingHorizontal: 15,
    borderColor: 'green',
    borderWidth: 2,
    paddingVertical: 10,
    marginTop: 20,
  },
});
