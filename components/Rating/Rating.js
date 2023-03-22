import React from 'react';
import {View, Text} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export const Rating = props => {
  if (props.rating === 1) {
    return (
      <View>
        <MaterialIcons name="star" size={20} color="black" />
      </View>
    );
  } else if (props.rating === 2) {
    return (
      <View style={{flexDirection: 'row'}}>
        <MaterialIcons name="star" size={20} color="black" />
        <MaterialIcons name="star" size={20} color="black" />
      </View>
    );
  } else if (props.rating === 3) {
    return (
      <View style={{flexDirection: 'row'}}>
        <MaterialIcons name="star" size={20} color="black" />
        <MaterialIcons name="star" size={20} color="black" />
        <MaterialIcons name="star" size={20} color="black" />
      </View>
    );
  } else if (props.rating === 4) {
    return (
      <View style={{flexDirection: 'row'}}>
        <MaterialIcons name="star" size={20} color="black" />
        <MaterialIcons name="star" size={20} color="black" />
        <MaterialIcons name="star" size={20} color="black" />
        <MaterialIcons name="star" size={20} color="black" />
      </View>
    );
  } else {
    return (
      <View style={{flexDirection: 'row'}}>
        <MaterialIcons name="star" size={20} color="black" />
        <MaterialIcons name="star" size={20} color="black" />
        <MaterialIcons name="star" size={20} color="black" />
        <MaterialIcons name="star" size={20} color="black" />
        <MaterialIcons name="star" size={20} color="black" />
      </View>
    );
  }
};
