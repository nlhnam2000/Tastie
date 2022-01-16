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
import {useEffect} from 'react';

const {width, height} = Dimensions.get('window');

export const NameInputForm = props => {
  const firstnameInputRef = useRef();
  const lastnameInputRef = useRef();

  let {data} = props.route.params; // email, phone

  let [firstname, setFirstname] = useState('');
  let [lastname, setLastname] = useState('');

  useEffect(() => {
    firstnameInputRef.current.focus();
  }, []);

  const handleSubmitName = (firstname, lastname) => {
    if (firstname !== '' && lastname !== '') {
      props.navigation.navigate('PasswordInputForm', {
        data: {
          phone: data.phone,
          email: data.email,
          firstname: firstname,
          lastname: lastname,
        },
      });
    } else {
      alert('Please complete the form');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="default" />
      <View style={styles.contentWrapper}>
        <Text style={{fontWeight: '600', fontSize: 19}}>Enter your name</Text>
        <TextInput
          style={styles.inputField}
          placeholder="First Name"
          clearButtonMode="always"
          ref={firstnameInputRef}
          onFocus={() =>
            firstnameInputRef.current.setNativeProps({
              style: {
                borderWidth: 2,
                borderColor: 'black',
              },
            })
          }
          onBlur={() => {
            firstnameInputRef.current.setNativeProps({
              style: {
                borderWidth: 0,
              },
            });
          }}
          onChangeText={text => setFirstname(text)}
        />
        <TextInput
          style={styles.inputField}
          placeholder="Last Name"
          clearButtonMode="always"
          ref={lastnameInputRef}
          onFocus={() =>
            lastnameInputRef.current.setNativeProps({
              style: {
                borderWidth: 2,
                borderColor: 'black',
              },
            })
          }
          onBlur={() => {
            lastnameInputRef.current.setNativeProps({
              style: {
                borderWidth: 0,
              },
            });
          }}
          onChangeText={text => setLastname(text)}
        />
        {/* <Text style={{marginTop: 20}}>
          By clicking Next, we will send OTP code to your email
        </Text> */}
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
          onPress={() => handleSubmitName(firstname, lastname)}
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
