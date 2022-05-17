import React, {useState, useEffect, useRef, forwardRef} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
  TouchableOpacity,
  TextInput,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  Animated,
  Platform,
  ActivityIndicator,
  Modal,
  Switch,
  TouchableWithoutFeedback,
  RefreshControl,
} from 'react-native';

// reducer
import {SetUserLocation, AutoSetLocation} from '../../store/action/auth';

// libraries
import {useDispatch, useSelector} from 'react-redux';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import {Modalize} from 'react-native-modalize';
import axios from 'axios';

// components
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../../colors/colors';

export const AddressModal = forwardRef((props, ref) => {
  const state = useSelector(state => state.UserReducer);

  const [loading, setLoading] = useState(true);
  const [markerLocation, setMarkerLocation] = useState({
    latitude: state.userLocation.latitude ?? null,
    longitude: state.userLocation.longitude ?? null,
  });
  const [address, setAddress] = useState(state.userLocation.address ?? '');

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return <ActivityIndicator size={'large'} color={colors.red} />;
  }

  return (
    <Modalize
      ref={ref}
      modalHeight={Dimensions.get('window').height - 130}
      HeaderComponent={
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            marginBottom: 10,
            position: 'relative',
            paddingHorizontal: 20,
            paddingVertical: 10,
          }}>
          <TouchableOpacity
            style={[styles.modalHeader, {position: 'absolute', left: '5%'}]}
            onPress={() => ref.current.close()}>
            <Feather name="x" size={20} color={'black'} />
          </TouchableOpacity>
          <Text style={{fontSize: 18, fontWeight: 'bold', textAlign: 'center'}}>
            Select your location
          </Text>
        </View>
      }>
      <View style={styles.modalContainer}>
        <MapView
          cacheEnabled
          initialRegion={{
            latitude:
              state.userLocation.latitude === 0 ? 12.203214000000004 : state.userLocation.latitude,
            longitude:
              state.userLocation.longitude === 0
                ? 109.19345021534353
                : state.userLocation.longitude,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}
          onPress={event =>
            setMarkerLocation({
              latitude: event.nativeEvent.coordinate.latitude,
              longitude: event.nativeEvent.coordinate.longitude,
              latitudeDelta: 0.015,
              longitudeDelta: 0.0121,
            })
          }
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

        <View style={styles.providerName}>
          <Text style={{fontSize: 20, fontWeight: 'bold'}}>Enter your address</Text>
        </View>
        <View style={styles.sectionWrapper}>
          <View>
            <Feather name="map-pin" size={22} color={'black'} />
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              paddingHorizontal: 15,
            }}>
            <TextInput
              style={{
                width: '100%',
                paddingVertical: 15,
                borderBottomWidth: 1,
              }}
              onChangeText={text => setAddress(text)}
              value={address}
            />
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            width: '100%',
            marginTop: 15,
            paddingHorizontal: 20,
          }}>
          <TouchableOpacity
            onPress={() => {
              submitLocation();
              ref.current.close();
            }}
            style={{padding: 10, backgroundColor: 'black', borderRadius: 5}}>
            <Text style={{fontWeight: '500', color: 'white'}}>Done</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.providerName}>
          <Text style={{fontSize: 15, fontWeight: '500'}}>Your recent address</Text>
        </View>
        <View style={{width, paddingHorizontal: 10}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <MaterialCommunityIcon name="map-marker" size={30} color="black" />
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '88%',
              }}>
              <Text style={{fontWeight: '600', fontSize: 17}}>135B Tran Hung Dao</Text>
              <TouchableOpacity
                style={{
                  padding: 10,
                  borderRadius: 20,
                  backgroundColor: 'rgba(230,230,230,0.7)',
                }}>
                <Feather name="edit-2" size={17} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modalize>
  );
});

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    flex: 1,
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    flex: 1,
  },
  headerWrapper: {
    // marginTop: Platform.OS === 'ios' ? 40 : 0,
    paddingHorizontal: 20,
  },
  tabWrapper: {
    flexDirection: 'row',
    width: Dimensions.get('screen').width,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  tabButton: {
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginLeft: 10,
  },
  tabButtonClicked: {
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginLeft: 10,
    backgroundColor: 'black',
  },
  labelTabButton: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
  },
  labelTabButtonClicked: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'white',
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f2f2f2',
    width: '90%',
    paddingVertical: Platform.OS === 'ios' ? 10 : 0,
    paddingHorizontal: 8,
    borderRadius: 25,
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 25,
  },
  categoryWrapper: {
    backgroundColor: 'white',
    height: 100,
    marginTop: 20,
    width: '100%',
  },
  categoryItem: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryImage: {
    width: 80,
    height: 80,
  },
  categoryTitle: {
    fontWeight: 'bold',
  },
  contentWrapper: {
    backgroundColor: '#e6e6e6',
    marginTop: 20,
  },
  popularDataWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  popularImage: {
    height: 200,
    width: Dimensions.get('screen').width,
  },
  popularDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: Dimensions.get('screen').width,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'white',
  },
  popularInfo: {
    flexDirection: 'column',
  },
  popularRating: {
    padding: 10,
    borderRadius: 40,
    backgroundColor: '#e6e6e6',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 20,
    // backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalView: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderWidth: 1,
    borderColor: colors.secondary,
    width: '100%',
    height: '90%',
    overflow: 'hidden',
  },
  map: {
    width: '100%',
    height: 200,
  },
  modalHeader: {
    padding: 10,
  },
  providerName: {
    padding: 15,
    width: '100%',
  },
  sectionWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 15,
  },
  flexRowBetween: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
});
