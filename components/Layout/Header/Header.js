import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

import Feather from 'react-native-vector-icons/Feather';

export const Header = props => {
  return (
    <View style={[styles.headerWrapper, {...props.style}]}>
      {props.goBack && (
        <TouchableOpacity style={styles.backButton} onPress={() => props.navigation.goBack()}>
          <Feather name="arrow-left" size={20} color="black" />
        </TouchableOpacity>
      )}
      <Text
        style={{
          textAlign: 'center',
          fontSize: 17,
          fontWeight: '600',
          opacity: props.titleOpacity === 0 ? 0 : 1,
        }}>
        {props.title ?? ''}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerWrapper: {
    paddingHorizontal: 10,
    paddingVertical: 15,
    position: 'relative',
    width: '100%',
    zIndex: 0,
  },
  backButton: {
    position: 'absolute',
    top: 15,
    left: 10,
    zIndex: 10,
  },
});
