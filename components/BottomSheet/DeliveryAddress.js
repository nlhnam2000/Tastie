import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Dimensions,
  Button,
} from 'react-native';

import {IP_ADDRESS} from '../../global';
import BottomSheet from '@gorhom/bottom-sheet';
import axios from 'axios';
import {useSelector, useDispatch} from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {SetUserLocation} from '../../store/action/auth';

const {width} = Dimensions.get('window');

export const DeliveryAddressBottomSheet = props => {
  const state = useSelector(state => state.UserReducer);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [currentAddress, setCurrentAddress] = useState({
    latitude: props.currentLocation.latitude,
    longitude: props.currentLocation.longitude,
    address: props.currentLocation.address,
    edited: false,
  });
  const [customerAddress, setCustomerAddress] = useState({
    user_id: null,
    user_phone: null,
    user_address: [],
  });

  const GetCustomerAddress = async user_id => {
    try {
      const res = await axios.get(
        `http://${IP_ADDRESS}:3007/v1/api/tastie/checkout/get_contact/${user_id}`,
      );
      if (res.data.status && res.data.response !== null) {
        setCustomerAddress(res.data.response);
      }
    } catch (error) {
      console.error('Cannot get customer address', error);
    } finally {
      setLoading(false);
    }
  };

  const AddressTypeIcon = type => {
    switch (type) {
      case 1:
        return <MaterialCommunityIcon name="home" size={30} color="black" />;
      case 2: {
        return <MaterialCommunityIcon name={'briefcase-outline'} size={30} color="black" />;
      }

      default:
        return <MaterialCommunityIcon name={'bookmark-outline'} size={30} color="black" />;
    }
  };

  useEffect(() => {
    GetCustomerAddress(state.user_id);
  });

  return (
    <View style={styles.wrapper}>
      <View>
        <Text style={{fontSize: 17, fontWeight: '500', textAlign: 'center'}}>
          Edit your delivery address
        </Text>
        <TextInput
          style={styles.inputField}
          value={currentAddress.address}
          clearButtonMode="always"
          onChangeText={text => setCurrentAddress(prev => ({...prev, address: text}))}
          onSubmitEditing={event => {
            props.navigation.navigate('MapScreen', {
              address: currentAddress.address,
              fromScreen: 'checkout',
            });
          }}
        />
        <Text style={{fontSize: 17, fontWeight: '500'}}>Or choose your saved address</Text>
        {customerAddress.user_address ? (
          customerAddress.user_address
            // .sort((a, b) => a.type - b.type)
            .map((item, index) => (
              <View key={index} style={styles.sectionWrapper}>
                <TouchableOpacity
                  onPress={() => {
                    // setCurrentAddress(prev => ({
                    //   ...prev,
                    //   address: item.address,
                    //   latitude: parseFloat(item.latitude),
                    //   longitude: parseFloat(item.longitude),
                    // }));
                    dispatch(
                      SetUserLocation({
                        address: item.address,
                        latitude: parseFloat(item.latitude),
                        longitude: parseFloat(item.longitude),
                      }),
                    );
                  }}
                  style={[
                    styles.flexRow,
                    {
                      paddingVertical: 10,
                      justifyContent: 'flex-start',
                      borderBottomWidth: 1,
                      borderBottomColor: '#c4c4c4',
                      paddingBottom: 15,
                    },
                  ]}>
                  {AddressTypeIcon(item.type)}
                  <View
                    style={[
                      styles.flexRow,
                      {
                        alignItems: 'center',
                        // justifyContent: 'space-between',
                        width: '80%',
                        marginLeft: 10,
                      },
                    ]}>
                    <View style={{}}>
                      <Text style={styles.heading2}>{item.address}</Text>
                    </View>
                  </View>
                  {/* <TouchableOpacity
                  style={{paddingEnd: 5}}
                  onPress={() =>
                    props.navigation.navigate('EditCustomerAddress', {
                      pre_latitude: parseFloat(item.latitude),
                      pre_longitude: parseFloat(item.longitude),
                      type: item.type,
                      address: item.address,
                    })
                  }>
                  <Text>Edit</Text>
                </TouchableOpacity> */}
                </TouchableOpacity>
              </View>
            ))
        ) : (
          <></>
        )}
      </View>
      <Button title="Done" onPress={() => props.onConfirm(currentAddress)} />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    padding: 10,
    paddingVertical: 20,
    justifyContent: 'space-between',
    height: Dimensions.get('window').height - 400,
  },
  inputField: {
    width: '100%',
    paddingHorizontal: 10,
    paddingVertical: 20,
    marginTop: 10,
    marginBottom: 20,
    // borderBottomWidth: 1,
    backgroundColor: '#f2f2f2',
  },
  sectionWrapper: {
    width: '100%',
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingTop: 10,
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
  heading1: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  heading2: {
    fontSize: 16,
    fontWeight: '500',
  },
});
