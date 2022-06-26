import {View, Text, StyleSheet} from 'react-native';
import React, {useRef, useEffect, useState} from 'react';
import MapView from 'react-native-maps';
import {useSelector} from 'react-redux';
import BottomSheet, {BottomSheetModalProvider, BottomSheetModal} from '@gorhom/bottom-sheet';
import {WebView} from 'react-native-webview';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

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

export default function TestScreen(props) {
  const state = useSelector(state => state.UserReducer);
  const bottomSheetRef = useRef();
  const insets = useSafeAreaInsets();
  const [goBack, setGoBack] = useState(false);

  useEffect(() => {
    if (goBack) {
      props.navigation.goBack();
    }
  }, [goBack]);
  return (
    <View style={styles.container}>
      <BottomSheet ref={bottomSheetRef} snapPoints={['95%']} index={0}>
        <WebView
          // style={[styles.container, {marginTop: insets.top}]}
          originWhitelist={['http://', 'https://', 'momo://']}
          onLoadEnd={() =>
            setTimeout(() => {
              setGoBack(true);
            }, 3000)
          }
          source={{
            uri: 'https://test-payment.momo.vn/v2/gateway/pay?t=TU9NT3wxMWMzMjFhMC1mNTEyLTExZWMtYTFmZi1kNTg4NTU0MmJmYzM=',
          }}
        />
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
