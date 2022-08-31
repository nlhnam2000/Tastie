import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  FlatList,
} from 'react-native';
import colors from '../../../../colors/colors';
import {IP_ADDRESS} from '../../../../global';
import axios from 'axios';
import Feather from 'react-native-vector-icons/Feather';
import BottomSheet, {BottomSheetScrollView, BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import {PromotionDetail} from '../../../../components/BottomSheet/PromotionDetail';

export const PromotionsList = props => {
  const [loading, setLoading] = useState(true);
  const {provider_id} = props.route.params;
  const [promotionList, setPromotionList] = useState({
    promotion: [],
    ecoupon: [],
  });
  const [selectedPromotionCode, setSelectedPromotionCode] = useState({
    code: 'P_FREESHIP',
    value: 10,
    min_order_value: 20,
    max_discount_value: 20,
    start_at: '2022-03-31T05:00:00.000Z',
    expire_at: '2023-04-30T05:00:00.000Z',
    description: 'lorem ipsum dolor',
  });
  const [openBottomSheet, setOpenBottomSheet] = useState(false);
  const promotionBottomSheetRef = useRef();

  useEffect(() => {
    const LoadPromotionList = async provider_id => {
      let res = await axios.get(
        `https://${IP_ADDRESS}/v1/api/tastie/checkout/get-all-promos/${provider_id}`,
      );
      if (res.data.status) {
        setPromotionList(prev => ({
          ...prev,
          promotion: res.data.response.promotion,
          ecoupon: res.data.response.ecoupon,
        }));
        setLoading(false);
      }
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
      {/* <FlatList data={promotionList} keyExtractor={item => item.promotion_id} /> */}
      <ScrollView style={styles.contentWrapper}>
        <Text style={styles.subheading}>
          {promotionList.promotion.length > 0 || promotionList.ecoupon.length > 0
            ? 'Available promotion or ecoupon list'
            : 'There is no available promotion'}
        </Text>
        {promotionList.promotion.map((item, index) => (
          <View key={index} style={styles.promotionItem}>
            <Text style={styles.smallheading}>Unlimited until {item.expire_at}</Text>
            <Text style={[styles.subheading, {marginTop: 10}]}>{item.code}</Text>
            <Text style={styles.smallheading}>{item.name}</Text>
            <Text style={[styles.smallheading, {marginTop: 10}]}>
              ${item.min_order_value} minimun order
            </Text>

            <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 15}}>
              <TouchableOpacity
                style={{padding: 10, borderRadius: 20, backgroundColor: 'black', marginRight: 20}}>
                <Text style={{fontSize: 17, fontWeight: '500', color: 'white'}}>Selected</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{padding: 10, borderRadius: 10}}
                onPress={() => {
                  setSelectedPromotionCode(prev => ({
                    ...prev,
                    code: item.code,
                    value: item.value,
                    min_order_value: item.min_order_value,
                    start_at: item.start_at,
                    expire_at: item.expire_at,
                    max_discount_value: item.max_discount_value,
                    description: item.description,
                  }));
                  setOpenBottomSheet(true);
                  promotionBottomSheetRef.current?.snapToIndex(0);
                }}>
                <Text style={{fontSize: 17, fontWeight: '500'}}>Detail</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
        {promotionList.ecoupon.map((item, index) => (
          <View key={index} style={styles.promotionItem}>
            <Text style={styles.smallheading}>Unlimited until {item.expire_at}</Text>
            <Text style={[styles.subheading, {marginTop: 10}]}>{item.code}</Text>
            <Text style={styles.smallheading}>{item.name}</Text>
            <Text style={[styles.smallheading, {marginTop: 10}]}>
              ${item.min_order_value} minimun order
            </Text>

            <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 15}}>
              <TouchableOpacity
                style={{padding: 10, borderRadius: 20, backgroundColor: 'black', marginRight: 20}}>
                <Text style={{fontSize: 17, fontWeight: '500', color: 'white'}}>Selected</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{padding: 10, borderRadius: 10}}
                onPress={() => {
                  setSelectedPromotionCode(prev => ({
                    ...prev,
                    code: item.code,
                    value: item.value,
                    min_order_value: item.min_order_value,
                    start_at: item.start_at,
                    expire_at: item.expire_at,
                    max_discount_value: item.max_discount_value,
                    description: item.description,
                  }));
                  setOpenBottomSheet(true);
                  promotionBottomSheetRef.current?.snapToIndex(0);
                }}>
                <Text style={{fontSize: 17, fontWeight: '500'}}>Detail</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
      <BottomSheet
        ref={promotionBottomSheetRef}
        index={-1}
        snapPoints={['85%']}
        enablePanDownToClose={true}
        backdropComponent={props => (
          <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
        )}
        onChange={index => {
          index === -1 ? setOpenBottomSheet(false) : null;
        }}
        backgroundStyle={{
          borderWidth: 1,
          borderColor: colors.secondary,
        }}>
        <BottomSheetScrollView
          contentContainerStyle={{backgroundColor: 'white', paddingVertical: 20}}>
          <PromotionDetail
            // code={selectedPromotionCode.code ?? 'None'}
            // expiration={selectedPromotionCode.expire_at}
            data={selectedPromotionCode}
            onClose={() => {
              setTimeout(() => {
                promotionBottomSheetRef.current?.close();
              }, 100);
            }}
          />
        </BottomSheetScrollView>
      </BottomSheet>
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
    position: 'relative',
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
    borderColor: '#c4c4c4',
    borderWidth: 2,
    paddingVertical: 10,
    marginTop: 20,
  },
});
