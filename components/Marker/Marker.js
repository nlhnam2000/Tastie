import React from 'react';
import {View} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../../colors/colors';

export const ProviderMarker = ({selected = false, isFavorited = false}) => {
  return (
    <View
      style={{
        padding: selected ? 10 : 5,
        borderRadius: 40,
        backgroundColor: selected ? 'white' : 'black',
        borderColor: selected ? 'black' : '#c4c4c4',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 0,
        },
        shadowRadius: 0,
        shadowOpacity: 0.25,
        elevation: 3,
        zIndex: selected ? 10 : -1,
      }}>
      <MaterialIcon
        name={isFavorited ? 'heart' : 'silverware'}
        size={22}
        color={selected ? 'black' : 'white'}
      />
    </View>
  );
};

export const UserMarker = () => {
  return (
    <View
      style={{
        padding: 5,
        borderRadius: 40,
        backgroundColor: colors.boldred,
        borderColor: '#c4c4c4',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowRadius: 0,
        shadowOpacity: 0.25,
        elevation: 3,
      }}>
      <MaterialIcon name="account" size={22} color={'white'} />
    </View>
  );
};

export const ShipperMarker = props => {
  return (
    <View
      style={{
        padding: 5,
        borderRadius: 40,
        backgroundColor: colors.yellow,
        borderColor: '#c4c4c4',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowRadius: 0,
        shadowOpacity: 0.25,
        elevation: 3,
      }}>
      <MaterialIcon name="moped" size={22} color={'white'} />
    </View>
  );
};
