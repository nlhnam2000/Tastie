import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Image,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

export const PaymentMethodList = props => {
  const renderPaymentMethod = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => props.onSelect(item.name)}
        style={[
          styles.wrapper,
          {
            justifyContent: item.name === props.selected ? 'space-between' : 'flex-start',
          },
        ]}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image
            source={item.logo}
            style={{width: 20, height: 20, marginRight: 20}}
            resizeMode="cover"
          />
          <Text
            style={{
              fontSize: 17,
              fontWeight: '500',
            }}>
            {item.name}
          </Text>
        </View>
        {item.name === props.selected && <Feather name="check" size={20} color="black" />}
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={props.data}
      keyExtractor={(item, index) => item.id.toString()}
      renderItem={renderPaymentMethod}
      style={{paddingHorizontal: 20}}
      ListHeaderComponent={
        <View style={{width: '100%'}}>
          <Text style={{fontSize: 16, fontWeight: '500', textAlign: 'center', marginVertical: 15}}>
            These are the available payment methods
          </Text>
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  wrapper: {
    width: '100%',
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
});
