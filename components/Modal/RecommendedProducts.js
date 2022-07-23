import React, {useState, useRef, useEffect, useCallback, useMemo} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Dimensions, FlatList} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import BottomSheet from '@gorhom/bottom-sheet';
import colors from '../../colors/colors';
import axios from 'axios';
import FastImage from 'react-native-fast-image';

const FULL_WIDTH = Dimensions.get('screen').width;

export const RecommendedProducts = ({user_id}) => {
  const [loading, setLoading] = useState(true);
  const bottomSheetRef = useRef();
  const snapPoints = useMemo(() => ['90%'], []);

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
          style={styles.foodWrapper}>
          <View style={[styles.foodInfo]}>
            <Text style={{fontWeight: '600', fontSize: 18, marginBottom: 10}}>
              {'Product Name'}
            </Text>
            {/* <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <MaterialIcon name="sale" color={colors.boldred} size={17} />
              <Text style={{color: colors.boldred, marginHorizontal: 5}}>50%</Text>
              <Text style={{textDecorationLine: 'line-through', color: 'grey'}}>
                ${item.price.toFixed(2)}
              </Text>
            </View> */}
            <Text style={{marginTop: 10}}>$10.00</Text>
            <Text style={{color: 'gray', marginTop: 10}} numberOfLines={4}>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sapiente, nulla.
            </Text>
          </View>
          <FastImage
            style={styles.foodImage}
            source={require('../../assets/image/SlideShowImg/Picture1.jpg')}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size={'large'} color={colors.boldred} />
      </View>
    );
  }

  return (
    <FlatList
      data={[1, 2, 3, 4, 5, 6, 7]}
      keyExtractor={item => item.toString()}
      renderItem={renderItem}
      ListHeaderComponent={
        <View style={{paddingHorizontal: 10, paddingTop: 10}}>
          <Text style={{fontWeight: '600', fontSize: 16}}>Recommended products</Text>
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
  },
  menuContentWrapper: {
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center',
    // borderBottomColor: '#e6e6e6',
    // borderBottomWidth: 1,
    // paddingBottom: 20,
  },
  menuContent: {
    // flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  foodWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 20,
    borderTopColor: '#e6e6e6',
    borderTopWidth: 1,
    paddingTop: 20,
  },
  foodInfo: {},
  foodImage: {
    width: 90,
    height: 90,
    position: 'relative',
  },
});
