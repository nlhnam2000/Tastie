import React, {useRef, useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, TextInput, Modal} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

export const AddPromoModal = props => {
  return (
    <Modal animationType="slide" transparent visible={props.show}>
      <View style={styles.modalContainer}>
        <View style={styles.modalView}>
          <TouchableOpacity
            style={{alignSelf: 'flex-end', marginBottom: 20}}
            onPress={() => props.onCancel()}>
            <Feather name="x" size={20} color="black" />
          </TouchableOpacity>
          <Text style={[styles.heading, {textAlign: 'center'}]}>Enter your promo code</Text>
          <TextInput style={styles.inputField} onChangeText={text => props.onChange(text)} />
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
              <Text style={{color: 'white', fontWeight: '600', fontSize: 17}}>Save</Text>
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
    backgroundColor: 'white',
    padding: 20,
    paddingTop: 10,
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
  inputField: {
    padding: 15,
    width: '100%',
    margin: 20,
    borderBottomWidth: 1,
  },
});
