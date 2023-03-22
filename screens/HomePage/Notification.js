import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
  StatusBar,
  TouchableOpacity,
  TextInput,
  Image,
  SafeAreaView,
  ScrollView,
  FlatList,
  Dimensions,
  RefreshControl,
} from 'react-native';
import {NavigationBar} from '../../components/Menu/NavigationBar';
import {Header} from '../../components/Layout/Header/Header';
import {IP_ADDRESS} from '../../global';

// libraries
import axios from 'axios';
import Feather from 'react-native-vector-icons/Feather';
import colors from '../../colors/colors';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const {width, height} = Dimensions.get('window');

export const Notification = props => {
  const [loading, setLoading] = useState(true);
  const [itemList, setItemList] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const renderEcouponList = ({item}) => (
    <TouchableOpacity
      style={styles.ecouponWrapper}
      onPress={() => props.navigation.navigate('DetailEcoupon', {item})}>
      <View style={{width: '90%'}}>
        <Text style={{fontSize: 18, fontWeight: '600'}}>{item.ecoupon_name}</Text>
        <Text style={{marginTop: 5, color: 'gray'}}>{item.ecoupon_description}</Text>
      </View>
      <Feather name="gift" size={25} color="black" style={{alignSelf: 'flex-end'}} />
    </TouchableOpacity>
  );

  const GetAllEcoupon = async () => {
    try {
      const res = await axios.post(
        `http://${'157.230.243.92'}:3010/v1/api/tastie/admin/get-all-ecoupon`,
        {
          limit: 20,
          offset: 1,
        },
      );

      if (res.data.status && res.data.response) {
        setItemList(res.data.response.reverse());
        setLoading(false);
        // setIsRefreshing(false);
      }
    } catch (error) {
      console.error('Cannot get all ecoupons', error);
    }
  };

  useEffect(() => {
    GetAllEcoupon();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={[styles.container]}>
          <SkeletonPlaceholder>
            <View
              style={{
                width,
                paddingHorizontal: 20,
                paddingVertical: 10,
                height: 150,
                marginTop: 20,
              }}
            />
            <View
              style={{
                width,
                paddingHorizontal: 20,
                paddingVertical: 10,
                height: 150,
                marginTop: 20,
              }}
            />
            <View
              style={{
                width,
                paddingHorizontal: 20,
                paddingVertical: 10,
                height: 150,
                marginTop: 20,
              }}
            />
            <View
              style={{
                width,
                paddingHorizontal: 20,
                paddingVertical: 10,
                height: 150,
                marginTop: 20,
              }}
            />
          </SkeletonPlaceholder>
        </SafeAreaView>
        <NavigationBar {...props} active={props.tabname} />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={[styles.container]}>
        <Header title={'Notification'} />
        <View style={{width, paddingHorizontal: 20}}>
          <FlatList
            data={itemList}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderEcouponList}
            contentContainerStyle={{paddingBottom: 60}}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                tintColor={colors.boldred}
                refreshing={isRefreshing}
                onRefresh={() => {
                  setIsRefreshing(true);
                  setTimeout(async () => {
                    await GetAllEcoupon(1, 20);
                    setIsRefreshing(false);
                  }, 1000);
                }}
              />
            }
          />
        </View>
      </View>
      <NavigationBar {...props} active={props.tabname} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(230,230,230,0.1)',
  },
  headerWrapper: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    position: 'relative',
    width: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 5,
    left: 20,
  },
  ecouponWrapper: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    minHeight: 120,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 5,
    shadowOpacity: 0.15,
    elevation: 3,
  },
});
