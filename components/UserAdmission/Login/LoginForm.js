import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Button,
  Image,
  Picker,
  Dimensions,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import {Formik, Form, Field} from 'formik';
import Feather from 'react-native-vector-icons/Feather';
import colors from '../../../colors/colors';
import {CheckBox} from 'react-native-elements';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSelector, useDispatch} from 'react-redux';

import {signin} from '../../../store/action/auth';

const {width, height} = Dimensions.get('window');

export const LoginForm = ({navigation, route}) => {
  let [checked, setChecked] = useState(false);
  let [showPassword, setShowPassword] = useState(false);
  let {data} = route.params; // phone, email

  let [phone, setPhone] = useState(data.phone ? data.phone : null);
  let [password, setPassword] = useState(null);

  const phoneInputRef = useRef();
  const passwordInputRef = useRef();

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = password => {
    if (password !== '') {
      dispatch(signin(data.phone, password));
    } else {
      alert('Please complete the form');
    }
  };

  const initialValues = {
    phone: data.phone,
    password: '',
  };

  // const token = useSelector(state => state.UserReducer.token);
  const dispatch = useDispatch();

  // const form = useSelector(state => state.UserReducer.signup_form);
  // useEffect(() => {
  //   console.log(form);
  // }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="default" />
      <View style={styles.contentWrapper}>
        <Text style={{fontWeight: '600', fontSize: 19}}>
          Welcome <Text style={{fontWeight: 'bold'}}>{data.first_name}</Text>,
          please enter your password to signin
        </Text>
        <View
          ref={passwordInputRef}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(230,230,230,0.9)',
            marginTop: 20,
            paddingVertical: 10,
          }}>
          <TextInput
            style={styles.inputPasswordField}
            placeholder="Your password"
            autoCapitalize="none"
            secureTextEntry={!showPassword}
            onFocus={() =>
              passwordInputRef.current.setNativeProps({
                style: {
                  borderWidth: 1,
                  borderColor: 'black',
                },
              })
            }
            onBlur={() => {
              passwordInputRef.current.setNativeProps({
                style: {
                  borderWidth: 0,
                },
              });
            }}
            onChangeText={text => setPassword(text)}
          />
          {showPassword ? (
            <Feather
              name="eye-off"
              size={20}
              style={{paddingRight: 10}}
              onPress={() => handleShowPassword()}
            />
          ) : (
            <Feather
              name="eye"
              size={20}
              style={{paddingRight: 10}}
              onPress={() => handleShowPassword()}
            />
          )}
        </View>
        <TouchableOpacity
          style={styles.forgotPassword}
          onPress={() => navigation.navigate('ForgotForm', {data})} // pass email to forgot form
        >
          <Text style={{fontWeight: 'bold'}}>I forgot my password</Text>
        </TouchableOpacity>

        {/* <Text style={{marginTop: 20}}>
          By clicking Next, we will send OTP code to your email
        </Text> */}
      </View>
      <View style={styles.buttonWrapper}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            padding: 10,
            borderRadius: 60,
            backgroundColor: 'rgba(230, 230, 230, 0.5)',
          }}>
          <Feather name="arrow-left" size={20} color={'black'} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleSubmit(password)}
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
            Signin
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
    // backgroundColor: 'white',
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
  inputPasswordField: {
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
  forgotPassword: {
    padding: 10,
    borderRadius: 25,
    backgroundColor: 'rgba(230,230,230,0.9)',
    marginTop: 20,
    width: '55%',
    alignItems: 'center',
  },
});
