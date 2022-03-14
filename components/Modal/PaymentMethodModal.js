import React from 'react';
import {View, Text, TouchableOpacity, Modal, StyleSheet} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

export const PaymentMethodModal = props => {
  return (
    <Modal animationType="slide" transparent visible={props.show}>
      <View style={styles.modalContainer}>
        <View style={styles.modalView}>
          <Text style={[styles.heading, {textAlign: 'center', marginVertical: 10}]}>
            Choose a payment method
          </Text>
          {props.data.map((item, index) => (
            <View
              key={index}
              style={{flexDirection: 'row', alignItems: 'center', width: '100%', marginTop: 10}}>
              <TouchableOpacity onPress={() => props.onChange(item)} style={styles.radioButton}>
                <View
                  style={{
                    width: 15,
                    height: 15,
                    backgroundColor: item === props.selectedPayment ? 'black' : 'white',
                    borderRadius: 10,
                  }}></View>
              </TouchableOpacity>
              <Text>{item}</Text>
            </View>
          ))}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-end',
              width: '100%',
            }}>
            <TouchableOpacity
              style={{padding: 15, backgroundColor: 'black', marginTop: 10}}
              onPress={() => props.onCancel()}>
              <Text style={{color: 'white', fontWeight: '600', fontSize: 17}}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  modalView: {
    margin: 15,
    backgroundColor: 'white',
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
  },
  heading: {
    fontSize: 19,
    fontWeight: '600',
  },
  radioButton: {
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#787878',
    width: 20,
    height: 20,
    marginRight: 10,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
