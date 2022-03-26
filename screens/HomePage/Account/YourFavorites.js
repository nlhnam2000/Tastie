import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export const YourFavorites = props => {
  return (
    <View style={styles.container}>
      <Text>Your favorites</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});
