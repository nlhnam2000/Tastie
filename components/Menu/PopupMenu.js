import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  ScrollView,
} from 'react-native';
import colors from '../../colors/colors';
import Feather from 'react-native-vector-icons/Feather';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
const {width} = Dimensions.get('window');

export const PopupMenu = props => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size={'large'} color={colors.red} />
      </View>
    );
  }

  return (
    <Modal animationType="slide" transparent={true} visible={props.visible}>
      <View style={styles.modalContainer}>
        <View style={styles.modalView}>
          <MapView
            initialRegion={{
              latitude: 12.203214000000004,
              longitude: 109.19345021534353,
              latitudeDelta: 0.015,
              longitudeDelta: 0.0121,
            }}
            provider={PROVIDER_GOOGLE}
            style={styles.map}></MapView>
          <TouchableOpacity style={styles.modalHeader} onPress={() => props.closeModal()}>
            <Feather name="x" size={20} color={'black'} />
          </TouchableOpacity>
          <View style={styles.providerName}>
            <Text style={{fontSize: 20, fontWeight: 'bold'}}>Pizza Hut</Text>
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
                borderBottomColor: 'rgba(230,230,230,1)',
                borderBottomWidth: 2,
                paddingVertical: 25,
              }}>
              <Text style={{fontSize: 17, fontWeight: '600'}}>135B Tran Hung Dao</Text>
              <Feather name="plus" size={22} color={'gray'} />
            </View>
          </View>
          <View style={styles.sectionWrapper}>
            <View>
              <Feather name="clock" size={22} color={'black'} />
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                paddingHorizontal: 15,
                borderBottomColor: 'rgba(230,230,230,1)',
                borderBottomWidth: 2,
                paddingVertical: 25,
              }}>
              <Text style={{fontSize: 17, fontWeight: '600'}}>Open until 10 PM</Text>
              <Feather name="plus" size={22} color={'gray'} />
            </View>
          </View>
          <View style={styles.sectionWrapper}>
            <View>
              <Feather name="star" size={22} color={'black'} />
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                paddingHorizontal: 15,
                borderBottomColor: 'rgba(230,230,230,1)',
                borderBottomWidth: 2,
                paddingVertical: 25,
              }}>
              <Text style={{fontSize: 17, fontWeight: '600'}}>Rating & Reviews</Text>
              <Feather name="plus" size={22} color={'gray'} />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    // backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalView: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 4,
    // elevation: 5,
    borderWidth: 2,
    borderColor: colors.secondary,
    borderBottomWidth: 0,
    width,
    height: '90%',
    overflow: 'hidden',
  },
  map: {
    width: '100%',
    height: 200,
  },
  modalHeader: {
    position: 'absolute',
    left: '1%',
    top: '1%',
    backgroundColor: 'white',
    borderRadius: 40,
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
});
