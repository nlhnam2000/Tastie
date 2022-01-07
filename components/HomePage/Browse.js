import React from 'react';
import {View, Text, Flatlist, Image, StyleSheet} from 'react-native';

import {ShortcutImage} from '../../assets/shortcuts/ShortcutImage';
import {NavigationBar} from '../Menu/NavigationBar';

export const Browse = props => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {ShortcutImage.map((item, index) => {
          return (
            <Image
              key={index}
              source={{uri: item.image}}
              style={{width: 50, height: 50}}
            />
          );
        })}
      </View>
      <NavigationBar active={props.tabname} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
