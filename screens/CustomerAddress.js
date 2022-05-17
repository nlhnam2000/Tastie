import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
// libraries
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';
// assets
import colors from '../colors/colors';
import {IP_ADDRESS} from '../global';
import {SetUserLocation} from '../store/action/auth';

const {width} = Dimensions.get('window');
const TOP_SPACING_FROM_NOTCH = 50;

export const CustomerAddress = props => {
  const [loading, setLoading] = useState(true);
  const state = useSelector(state => state.UserReducer);
  const dispatch = useDispatch();
  const [customerAddress, setCustomerAddress] = useState({});

  useEffect(() => {
    // setLoading(false);
    GetCustomerAddress(state.user_id);
  }, []);

  const GetCustomerAddress = async user_id => {
    try {
      const res = await axios.get(
        `http://${IP_ADDRESS}:3007/v1/api/tastie/checkout/get_contact/${user_id}`,
      );
      if (res.data.status) {
        setCustomerAddress(res.data.response);
      }
    } catch (error) {
      console.error('Cannot get customer address', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, {justifyContent: 'center'}]}>
        <ActivityIndicator size={'large'} color={colors.red} />
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerWrapper}>
        <TouchableOpacity
          onPress={() => props.navigation.goBack()}
          style={{
            position: 'absolute',
            top: DeviceInfo.hasNotch() ? TOP_SPACING_FROM_NOTCH : 10,
            left: 10,
            zIndex: 10,
          }}>
          <Feather name="arrow-left" size={20} color="black" />
        </TouchableOpacity>
        <Text style={[styles.heading1, {textAlign: 'center'}]}>Customer address</Text>
      </View>

      <ScrollView>
        <View style={[styles.sectionWrapper, {borderTopWidth: 1, borderTopColor: '#e6e6e6'}]}>
          <View style={styles.flexRow}>
            <MaterialCommunityIcon name="map-marker" size={20} color="black" />
            <View style={{marginLeft: 10, width: '90%'}}>
              <Text style={styles.heading2}>{state.userLocation.address}</Text>
              <Text style={{fontSize: 12, marginTop: 5, color: 'gray', marginBottom: 10}}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio, perspiciatis
                reiciendis porro ipsa fuga veniam eius nihil hic exercitationem quod!
              </Text>
            </View>
          </View>
        </View>
        <Text style={{padding: 15, color: 'gray', fontSize: 15, fontWeight: '500'}}>
          Saved address
        </Text>
        {customerAddress.user_address
          .sort((a, b) => a.type - b.type)
          .map((item, index) => (
            <View key={index} style={styles.sectionWrapper}>
              <TouchableOpacity
                onPress={() => {
                  dispatch(
                    SetUserLocation({
                      address: item.address,
                      latitude: parseFloat(item.latitude),
                      longitude: parseFloat(item.longitude),
                    }),
                  );
                  props.navigation.goBack();
                }}
                style={[styles.flexRow, {paddingBottom: 10, justifyContent: 'space-between'}]}>
                <MaterialCommunityIcon
                  name={item.type === 1 ? 'home-outline' : 'briefcase-outline'}
                  size={20}
                  color="black"
                />
                <View
                  style={[
                    styles.flexRow,
                    {
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '80%',
                    },
                  ]}>
                  <View style={{}}>
                    <Text style={styles.heading2}>{item.address}</Text>
                    <Text style={{color: 'gray', fontSize: 12, marginVertical: 5}}>
                      Lorem ipsum, dolor sit amet consectetur adipisicing elit. Porro odit ut hic
                      minima suscipit dicta. Facilis quo eveniet voluptatem numquam?
                    </Text>
                    <Text>
                      {state.first_name + ' ' + state.last_name} {customerAddress.user_phone}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={{paddingEnd: 5}}
                  onPress={() => props.navigation.navigate('CustomerAddressForm')}>
                  <Text>Edit</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            </View>
          ))}
      </ScrollView>

      <View
        style={[
          styles.sectionWrapper,
          {position: 'absolute', bottom: 25, padding: 10, backgroundColor: '#f2f2f2'},
        ]}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => props.navigation.navigate('CustomerAddressForm')}>
          <Text style={{textAlign: 'center', color: 'white', fontSize: 17, fontWeight: '500'}}>
            Add new address
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    // backgroundColor: '#e6e6e6',
    justifyContent: 'center',
  },
  headerWrapper: {
    position: 'relative',
    width,
    paddingTop: DeviceInfo.hasNotch() ? TOP_SPACING_FROM_NOTCH : 10,
    paddingBottom: 10,
    backgroundColor: 'white',
  },
  heading1: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  heading2: {
    fontSize: 16,
    fontWeight: '500',
  },
  sectionWrapper: {
    // marginTop: 15,
    width,
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingTop: 10,
    // marginBottom: 15,
  },
  flexRow: {
    width: '100%',
    flexDirection: 'row',
  },
  flexRowBetween: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  addButton: {
    width: '100%',
    backgroundColor: 'black',
    padding: 10,
  },
});
