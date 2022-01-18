import React, {useRef, useState, useEffect} from 'react';
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
import {useDispatch} from 'react-redux';
import {IP_ADDRESS} from '../../../global';

const {width, height} = Dimensions.get('window');

export const EmailInputForm = props => {
  const dispatch = useDispatch();
  const emailInputRef = useRef();

  const [email, setEmail] = useState('');

  const {data} = props.route.params; // phone

  useEffect(() => {
    emailInputRef.current.focus();
  }, []);

  const handleSubmit = async email => {
    let body = {
      phone: data.phone,
      email: email,
    };
    if (email !== '') {
      // dispatch(CheckExistingEmail(phone, email));
      try {
        let res = await axios.post(
          `http://${IP_ADDRESS}:3007/v1/api/auth/check-exist-email-and-phone`,
          body,
        );
        if (res.data.isEmailDuplicated === true) {
          alert('This email is already taken');
        } else if (res.data.isEmailDuplicated === false) {
          props.navigation.navigate('EmailVerification', {data: body});
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      alert('Please complete those input field');
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.contentWrapper}>
        <Text style={{fontWeight: '600', fontSize: 19}}>
          Welcome, please enter your email for registration
        </Text>
        <TextInput
          style={styles.inputField}
          placeholder="Your email"
          clearButtonMode="always"
          keyboardType="email-address"
          autoCapitalize="none"
          ref={emailInputRef}
          onFocus={() =>
            emailInputRef.current.setNativeProps({
              style: {
                borderWidth: 2,
                borderColor: 'black',
              },
            })
          }
          onBlur={() => {
            emailInputRef.current.setNativeProps({
              style: {
                borderWidth: 0,
              },
            });
          }}
          onChangeText={text => setEmail(text)}
        />
        <Text style={{marginTop: 20}}>
          By clicking Next, we will send OTP code to your email
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
          onPress={() => handleSubmit(email)}
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
