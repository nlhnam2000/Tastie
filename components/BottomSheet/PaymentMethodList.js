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

export const PaymentMethodList = props => {
  const renderPaymentMethod = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => props.onSelect(item.name)}
        style={[
          styles.wrapper,
          {backgroundColor: item.name === props.selected ? '#07b351' : 'white'},
        ]}>
        <Image
          source={item.logo}
          style={{width: 20, height: 20, marginRight: 20}}
          resizeMode="cover"
        />
        <Text
          style={{
            fontSize: 17,
            fontWeight: '500',
            color: item.name === props.selected ? 'white' : 'black',
          }}>
          {item.name}
        </Text>
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
    borderColor: 'green',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
});
