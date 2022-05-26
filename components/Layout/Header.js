import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

import Feather from 'react-native-vector-icons/Feather';

export const Header = props => {
  return (
    <View style={[styles.headerWrapper, {...props.style}]}>
      {props.goBack && (
        <TouchableOpacity style={styles.backButton} onPress={() => props.navigation.goBack()}>
          <Feather name="arrow-left" size={20} color="black" style={{zIndex: 10}} />
        </TouchableOpacity>
      )}
      <Text style={{textAlign: 'center', fontSize: 17, fontWeight: '600'}}>
        {props.title ?? ''}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerWrapper: {
    paddingHorizontal: 20,
    paddingVertical: 5,
    position: 'relative',
    width: '100%',
    zIndex: 0,
  },
  backButton: {
    position: 'absolute',
    top: 5,
    left: 20,
  },
});
