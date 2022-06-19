import {View, Text, StyleSheet} from 'react-native';
import React, {useRef} from 'react';
import MapView from 'react-native-maps';
import {useSelector} from 'react-redux';
import BottomSheet from '@gorhom/bottom-sheet';

const handleComponent = () => {
  return (
    <View
      style={{
        backgroundColor: 'white',
        padding: 10,
        marginTop: -30,
        width: '25%',
        borderRadius: 50,
        alignSelf: 'center',
      }}>
      <View style={styles.remainingTime}>
        <Text style={{fontSize: 17, fontWeight: '500', textAlign: 'center'}}>14 mins</Text>
      </View>
    </View>
  );
};

export default function TestScreen() {
  const state = useSelector(state => state.UserReducer);
  const bottomSheetRef = useRef();
  return (
    <View style={[styles.container]}>
      <MapView
        style={styles.map}
        provider="google"
        mapType="terrain"
        showsUserLocation
        initialRegion={{
          latitude: state.userLocation.latitude,
          longitude: state.userLocation.longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }}
      />
      <BottomSheet
        ref={bottomSheetRef}
        index={1}
        snapPoints={['25%', '50%']}
        backgroundStyle={{borderWidth: 1, borderColor: '#f2f2f2'}}
        handleIndicatorStyle={{backgroundColor: 'red'}}
        handleComponent={handleComponent}

        // onChange={handleSheetChanges}
      >
        <View style={styles.contentContainer}>
          <Text>Awesome 🎉</Text>
        </View>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  map: {
    width: '100%',
    height: '99%',
  },
  remainingTime: {
    padding: 15,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#AB2E15',
    backgroundColor: 'white',
  },
  currentPositionButton: {
    position: 'absolute',
    top: '80%',
    left: '85%',
    padding: 10,
    borderRadius: 20,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#c6c6c6',
  },
  inputWrapper: {
    position: 'absolute',
    top: '10%',
    left: '0%',
    right: 0,
    width: '100%',
    paddingHorizontal: 20,
  },
  inputField: {
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderColor: 'black',
    borderWidth: 1,
  },
  shipperInfo: {
    width: '100%',
    height: '40%',
    backgroundColor: 'white',
    marginBottom: 30,
    paddingVertical: 20,
  },
  remainingTime: {
    padding: 15,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#AB2E15',
    backgroundColor: 'white',
  },
  progress: {
    width: '100%',
    paddingHorizontal: 10,
    marginTop: 20,
    height: '10%',
  },
  flexRowBetween: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
