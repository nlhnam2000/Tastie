import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';

// libraries
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const FULL_WIDTH = Dimensions.get('window').width;

export const DetailProviderSkeleton = () => {
  return (
    <>
      <SkeletonPlaceholder style={styles.container}>
        <View style={{width: FULL_WIDTH, height: 150}} />
      </SkeletonPlaceholder>
      <View
        style={{
          width: FULL_WIDTH,
          height: Dimensions.get('window').height - 150,
          paddingHorizontal: 20,
          paddingVertical: 10,
          backgroundColor: 'white',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        }}>
        <SkeletonPlaceholder>
          <View style={{width: '100%', height: 20, marginBottom: 20}} />
          <View style={{height: 50, width: '100%', marginBottom: 20}}>
            <View style={{width: '20%', height: 10, marginBottom: 10}} />
            <View style={{width: '20%', height: 10, marginBottom: 10}} />
            <View style={{width: '80%', height: 10}} />
          </View>
          <View style={{width: '100%', height: 50, borderRadius: 40}} />
          <View style={{width: '100%', height: 50, marginTop: 20}} />
          <View style={{width: '20%', height: 10, marginTop: 40}} />
          {[0, 1, 2, 3, 4].map((_, index) => (
            <View
              key={index}
              style={{
                width: '100%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 20,
              }}>
              <View style={{width: '80%'}}>
                <View style={{width: '50%', height: 10, marginTop: 10}} />
                <View style={{width: '20%', height: 10, marginTop: 30}} />
              </View>
              <View style={{width: '20%'}}>
                <View style={{width: 80, height: 80}} />
              </View>
            </View>
          ))}
        </SkeletonPlaceholder>
      </View>
    </>
  );
};

const styles = StyleSheet.create({});
