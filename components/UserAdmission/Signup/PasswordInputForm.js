import React, {useRef, useState} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Dimensions,
  StatusBar,
} from 'react-native';
import {Formik} from 'formik';
import axios from 'axios';
import Feather from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch} from 'react-redux';
import {SkipUpdate} from '../../../store/action/auth';

const {width, height} = Dimensions.get('window');

export const PasswordInputForm = props => {
  const password1InputRef = useRef();
  const password2InputRef = useRef();
  const dispatch = useDispatch();

  let {phone, email, firstname, lastname} = props.route.params.data; // phone, email, firstname, lastname

  let [password1, setPassword1] = useState('');
  let [password2, setPassword2] = useState('');

  const handleSubmitPassword = (password1, password2) => {
    if (password1 !== '' && password2 !== '' && password1 === password2) {
      // Signup api
      let body = {
        phone,
        email,
        firstname,
        lastname,
        password: password1,
      };
      dispatch(SkipUpdate(body));
    } else {
      alert('Please complete the form');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="default" />
      <View style={styles.contentWrapper}>
        <Text style={{fontWeight: '600', fontSize: 19}}>
          Set up your password
        </Text>
        <TextInput
          style={styles.inputField}
          placeholder="Password"
          clearButtonMode="always"
          secureTextEntry
          ref={password1InputRef}
          onFocus={() =>
            password1InputRef.current.setNativeProps({
              style: {
                borderWidth: 2,
                borderColor: 'black',
              },
            })
          }
          onBlur={() => {
            password1InputRef.current.setNativeProps({
              style: {
                borderWidth: 0,
              },
            });
          }}
          onChangeText={text => setPassword1(text)}
        />
        <TextInput
          style={styles.inputField}
          secureTextEntry
          placeholder="Re-enter your password"
          clearButtonMode="always"
          ref={password2InputRef}
          onFocus={() =>
            password2InputRef.current.setNativeProps({
              style: {
                borderWidth: 2,
                borderColor: 'black',
              },
            })
          }
          onBlur={() => {
            password2InputRef.current.setNativeProps({
              style: {
                borderWidth: 0,
              },
            });
          }}
          onChangeText={text => setPassword2(text)}
        />
        <Text style={{marginTop: 20}}>
          The password must contains at least 8 characters, 1 capitalized
          character and 1 number
        </Text>
      </View>
      <View style={styles.buttonWrapper}>
        <TouchableOpacity
          onPress={() => props.navigation.goBack()}
          style={{
            padding: 10,
            borderRadius: 60,
            backgroundColor: 'rgba(230, 230, 230, 0.5)',
          }}>
          <Feather name="arrow-left" size={20} color={'black'} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleSubmitPassword(password1, password2)}
          style={{
            borderRadius: 25,
            padding: 10,
            backgroundColor: colors.yellow,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              color: 'black',
              fontSize: 18,
              marginRight: 5,
              fontWeight: '500',
            }}>
            Next
          </Text>
          <Feather name="arrow-right" size={20} color={'black'} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width,
    height: height - 70,
    paddingVertical: 20,
  },
  contentWrapper: {
    paddingHorizontal: 20,
    marginTop: 10,
    width,
  },
  inputField: {
    width: '100%',
    backgroundColor: 'rgba(230,230,230,0.9)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  buttonWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width,
    paddingHorizontal: 20,
  },
});
