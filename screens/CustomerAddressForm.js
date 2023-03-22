import React, {useEffect, useState, useRef} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
// libraries
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';
import {Modalize} from 'react-native-modalize';
import MapView, {Marker, PROVIDER_DEFAULT, PROVIDER_GOOGLE} from 'react-native-maps';
import axios from 'axios';

// assets
import colors from '../colors/colors';
import {IP_ADDRESS} from '../global';

const {width} = Dimensions.get('window');
const TOP_SPACING_FROM_NOTCH = 50;
const MODAL_HEIGHT = Dimensions.get('window').height - 50;

export const CustomerAddressForm = props => {
  const state = useSelector(state => state.UserReducer);
  const userLocationModalize = useRef();
  const [markerLocation, setMarkerLocation] = useState({
    latitude: state.userLocation.latitude ?? null,
    longitude: state.userLocation.longitude ?? null,
  });
  const [address, setAddress] = useState(state.userLocation.address ?? '');
  const [selectedType, setSelectedType] = useState(1);
  const [userLocation, setUserLocation] = useState({
    receiverName: state.first_name + ' ' + state.last_name,
    receiverPhone: state.phone,
    latitude: null,
    longitude: null,
    city: null,
    type: 1,
    address: null,
  });

  const submitNewAddress = async formData => {
    try {
      const res = await axios.post(`https://${IP_ADDRESS}/v1/api/tastie/add-customer-address`, {
        customer_id: state.user_id,
        address: formData.address,
        city: formData.city,
        type: formData.type,
        longtitude: formData.longitude.toString(),
        latitude: formData.latitude.toString(),
      });

      if (res.data.status) {
        props.navigation.navigate('CustomerAddress');
      }
    } catch (error) {
      console.error('Cannot submit new address', error);
    }
  };

  useEffect(() => {
    setUserLocation(prev => ({
      ...prev,
      type: selectedType,
    }));
  }, [selectedType]);

  useEffect(() => {
    if (markerLocation.latitude && markerLocation.longitude) {
      setUserLocation(prev => ({
        ...prev,
        longitude: markerLocation.longitude,
        latitude: markerLocation.latitude,
      }));
    }
  }, [markerLocation]);

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
        <Text style={[styles.heading1, {textAlign: 'center'}]}>Add new address</Text>
      </View>

      <ScrollView>
        <View style={[styles.sectionWrapper, {borderTopWidth: 1, borderTopColor: '#e6e6e6'}]}>
          <TextInput
            style={{width: '100%', padding: 10, borderBottomWidth: 1, borderBottomColor: '#e6e6e6'}}
            value={userLocation.receiverName}
            onChangeText={text => setUserLocation(prev => ({...prev, receiverName: text}))}
          />
          <TextInput
            style={{width: '100%', padding: 10}}
            value={userLocation.receiverPhone}
            onChangeText={text => setUserLocation(prev => ({...prev, receiverPhone: text}))}
          />
        </View>
        <View style={[styles.sectionWrapper, {marginTop: 20}]}>
          <TouchableOpacity
            style={[styles.flexRowBetween, {paddingBottom: 10}]}
            onPress={() => userLocationModalize.current?.open()}>
            <Text style={{color: 'gray', paddingStart: 10}}>
              {userLocation.address ?? 'Enter your address'}
            </Text>
            <Feather name="chevron-right" size={20} color={'gray'} />
          </TouchableOpacity>
          <TextInput
            style={{
              width: '100%',
              padding: 10,
              borderColor: '#e6e6e6',
              borderTopWidth: 1,
              borderBottomWidth: 1,
            }}
            placeholder="City"
            placeholderTextColor={'gray'}
            onChangeText={text => setUserLocation(prev => ({...prev, city: text}))}
          />
          <View style={[styles.flexRow, {padding: 15}]}>
            <TouchableOpacity
              onPress={() => setSelectedType(1)}
              style={[
                styles.typeButton,
                {backgroundColor: selectedType === 1 ? 'black' : '#e6e6e6'},
              ]}>
              <Text style={[styles.heading2, {color: selectedType === 1 ? 'white' : 'black'}]}>
                Home
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSelectedType(2)}
              style={[
                styles.typeButton,
                {backgroundColor: selectedType === 2 ? 'black' : '#e6e6e6'},
              ]}>
              <Text style={[styles.heading2, {color: selectedType === 2 ? 'white' : 'black'}]}>
                Work
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSelectedType(3)}
              style={[
                styles.typeButton,
                {backgroundColor: selectedType === 3 ? 'black' : '#e6e6e6'},
              ]}>
              <Text style={[styles.heading2, {color: selectedType === 3 ? 'white' : 'black'}]}>
                Other
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View
        style={[
          styles.sectionWrapper,
          {position: 'absolute', bottom: 25, padding: 10, backgroundColor: '#f2f2f2'},
        ]}>
        <TouchableOpacity style={styles.addButton} onPress={() => submitNewAddress(userLocation)}>
          <Text style={{textAlign: 'center', color: 'white', fontSize: 17, fontWeight: '500'}}>
            Save
          </Text>
        </TouchableOpacity>
      </View>

      <Modalize
        ref={userLocationModalize}
        modalHeight={MODAL_HEIGHT}
        HeaderComponent={
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              width,
              marginBottom: 10,
              position: 'relative',
              paddingHorizontal: 20,
              paddingVertical: 10,
            }}>
            <TouchableOpacity
              style={[styles.modalHeader, {position: 'absolute', left: '1%'}]}
              onPress={() => userLocationModalize.current.close()}>
              <Feather name="x" size={20} color={'black'} />
            </TouchableOpacity>
            <Text style={{fontSize: 18, fontWeight: 'bold', textAlign: 'center'}}>
              Select your location
            </Text>
          </View>
        }>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            paddingHorizontal: 15,
            marginBottom: 20,
            backgroundColor: '#f2f2f2',
          }}>
          <TextInput
            style={{
              width: '100%',
              paddingVertical: 15,
            }}
            onChangeText={text =>
              setUserLocation(prev => ({
                ...prev,
                address: text,
              }))
            }
            placeholder="Enter your address then mark your location on the map"
            placeholderTextColor={'gray'}
            onSubmitEditing={event => {
              userLocationModalize.current?.close();
            }}
          />
        </View>
        <View style={styles.modalContainer}>
          <MapView
            initialRegion={{
              latitude:
                state.userLocation.latitude === 0
                  ? 12.203214000000004
                  : state.userLocation.latitude,
              longitude:
                state.userLocation.longitude === 0
                  ? 109.19345021534353
                  : state.userLocation.longitude,
              latitudeDelta: 0.015,
              longitudeDelta: 0.0121,
            }}
            onPress={event => {
              setMarkerLocation({
                latitude: event.nativeEvent.coordinate.latitude,
                longitude: event.nativeEvent.coordinate.longitude,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
              });
            }}
            showsUserLocation
            showsMyLocationButton
            minZoomLevel={17}
            provider={PROVIDER_GOOGLE}
            mapType="terrain"
            loadingEnabled
            style={styles.map}>
            {markerLocation.latitude && markerLocation.longitude ? (
              <Marker coordinate={markerLocation} />
            ) : null}
          </MapView>
        </View>
      </Modalize>
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
    fontSize: 15,
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
  typeButton: {
    // backgroundColor: '#e6e6e6',
    padding: 5,
    marginRight: 15,
    paddingHorizontal: 10,
  },
  map: {
    width: '100%',
    height: MODAL_HEIGHT - 100,
  },
  modalHeader: {
    padding: 10,
  },
  providerName: {
    padding: 15,
    width: '100%',
  },
});
