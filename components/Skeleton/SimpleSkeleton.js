import React from 'react';
import {View, Dimensions, StyleSheet} from 'react-native';

import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const {width} = Dimensions.get('window');

export const SimpleSkeleton = () => {
  return (
    <SkeletonPlaceholder>
      <View style={{width: width - 30, height: 150}} />
      <View style={[styles.flexRowBetween, {width: width - 30}]}>
        <View style={{paddingVertical: 10}}>
          <View style={{width: width - 100, marginBottom: 5, height: 50}} />
        </View>
        <View
          style={{
            padding: 10,
            borderRadius: 40,
            backgroundColor: 'rgba(230,230,230,0.6)',
            width: 40,
            height: 40,
          }}
        />
      </View>
    </SkeletonPlaceholder>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 10,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  flexRowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  providerWrapper: {
    paddingHorizontal: 15,
  },
  subheading: {
    fontWeight: '600',
    fontSize: 17,
  },
});
