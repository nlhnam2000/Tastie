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
import {IP_ADDRESS} from '../../../global';

import {signin} from '../../../store/action/auth';

const {width, height} = Dimensions.get('window');

export const ForgotForm = ({navigation, route}) => {
  let {data} = route.params; // phone, email
  let [password, setPassword] = useState('');
  let [showPassword, setShowPassword] = useState(false);

  const passwordInputRef = useRef();

  const dispatch = useDispatch();

  const hideEmail = target => {
    var email = target; // hoangnam12c12@gmail.com
    var hiddenEmail = '';
    for (let i = 0; i < email.length; i++) {
      if (i > 2 && i < email.indexOf('@')) {
        hiddenEmail += '*';
      } else {
        hiddenEmail += email[i];
      }
    }
    return hiddenEmail;
  };

  const getResetPassword = async () => {
    try {
      let res = await axios.post(`http://${IP_ADDRESS}:3007/v1/auth/resest-password`, {
        phone: data.phone,
        email: data.email,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async password => {
    if (password !== '') {
      try {
        let res = await axios.post(`http://${IP_ADDRESS}:3007/v1/api/auth/sign-in`, {
          phone: data.phone,
          password: password,
        });
        if (res.data.loginState === true) {
          navigation.navigate('ChangePasswordForm', {data});
        } else {
          if (Object.keys(res.data.err).length > 0) {
            alert(res.data.err.message);
          } else {
            alert('The Username or Password is incorrect');
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    setTimeout(async () => {
      // reset password
      await getResetPassword();
    }, 3000);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.contentWrapper}>
        <Text style={{fontWeight: '600', fontSize: 19}}>
          We have sent the reset password to{' '}
          <Text style={{fontWeight: 'bold'}}>{hideEmail(data.email)}</Text>
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
            placeholder="Reset password"
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
              onPress={() => setShowPassword(!showPassword)}
              style={{paddingRight: 10}}
            />
          ) : (
            <Feather
              name="eye"
              size={20}
              onPress={() => setShowPassword(!showPassword)}
              style={{paddingRight: 10}}
            />
          )}
        </View>
        <TouchableOpacity
          style={styles.forgotPassword}
          onPress={async () => await getResetPassword()}>
          <Text style={{fontWeight: 'bold'}}>I can't get code</Text>
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
            backgroundColor: 'black',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              color: 'white',
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
    maxWidth: '55%',
    alignItems: 'center',
  },
});
