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
  Modal,
  Platform,
} from 'react-native';
import {Formik} from 'formik';
import axios from 'axios';
import Feather from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch} from 'react-redux';
import {SkipUpdate} from '../../../store/action/auth';
import {SimpleAlertDialog} from '../../Error/AlertDialog';
import {useEffect} from 'react';

const {width, height} = Dimensions.get('window');

export const PasswordInputForm = props => {
  let [showPassword1, setShowPassword1] = useState(false);
  let [showPassword2, setShowPassword2] = useState(false);

  const password1InputRef = useRef();
  const password2InputRef = useRef();
  const password1Ref = useRef();
  const dispatch = useDispatch();

  let {phone, email, firstname, lastname} = props.route.params.data; // phone, email, firstname, lastname

  let [password1, setPassword1] = useState('');
  let [password2, setPassword2] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    password1Ref.current.focus();
  }, []);

  const handleShowPassword1 = () => {
    setShowPassword1(!showPassword1);
  };

  const handleShowPassword2 = () => {
    setShowPassword2(!showPassword2);
  };

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
    }
    if (password1 !== password2) {
      setErrorMessage('The password does not match');
      setOpenModal(true);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="default" />
      <View style={styles.contentWrapper}>
        <Text style={{fontWeight: '600', fontSize: 19}}>
          Set up your password
        </Text>
        <View
          ref={password1InputRef}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(230,230,230,0.9)',
            marginTop: 20,
            paddingVertical: Platform.OS === 'ios' ? 10 : 0,
          }}>
          <TextInput
            style={styles.inputField}
            placeholder="Password"
            clearButtonMode="always"
            secureTextEntry={!showPassword1}
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
            ref={password1Ref}
          />
          {showPassword1 ? (
            <Feather
              name="eye-off"
              size={20}
              style={{paddingRight: 10}}
              onPress={() => handleShowPassword1()}
            />
          ) : (
            <Feather
              name="eye"
              size={20}
              style={{paddingRight: 10}}
              onPress={() => handleShowPassword1()}
            />
          )}
        </View>
        <View
          ref={password2InputRef}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(230,230,230,0.9)',
            marginTop: 20,
            paddingVertical: Platform.OS === 'ios' ? 10 : 0,
          }}>
          <TextInput
            style={styles.inputField}
            secureTextEntry={!showPassword2}
            placeholder="Re-enter your password"
            clearButtonMode="always"
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
          {showPassword2 ? (
            <Feather
              name="eye-off"
              size={20}
              style={{paddingRight: 10}}
              onPress={() => handleShowPassword2()}
            />
          ) : (
            <Feather
              name="eye"
              size={20}
              style={{paddingRight: 10}}
              onPress={() => handleShowPassword2()}
            />
          )}
        </View>

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
      {/* Alert Dialog here */}
      <SimpleAlertDialog
        message={errorMessage}
        visible={openModal}
        onCancel={() => setOpenModal(false)}
      />
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
    flex: 1,
    paddingHorizontal: 20,
  },
  buttonWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width,
    paddingHorizontal: 20,
  },
});
