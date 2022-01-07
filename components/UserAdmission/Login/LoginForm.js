import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Button,
  Image,
  Picker,
} from 'react-native';
import {Formik, Form, Field} from 'formik';
import Feather from 'react-native-vector-icons/Feather';
import colors from '../../../colors/colors';
import {CheckBox} from 'react-native-elements';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSelector, useDispatch} from 'react-redux';

import {signin} from '../../../store/action/auth';

export const LoginForm = ({navigation}) => {
  const [checked, setChecked] = useState(false);
  const handleLogin = values => {
    axios
      .post('http://localhost:3007/v1/api/auth/login-with-otp', {
        phone: values.phone,
        otp: values.password,
      })
      .then(async res => {
        await AsyncStorage.setItem('user_token', res.data.token);
      })
      .catch(err => alert(err));
  };

  const initialValues = {
    phone: '',
    password: '',
  };

  // const token = useSelector(state => state.UserReducer.token);
  const dispatch = useDispatch();

  const form = useSelector(state => state.UserReducer.signup_form);
  useEffect(() => {
    console.log(form);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.headerWrapper}>
        <Image
          source={require('../../../assets/image/logo.png')}
          resizeMode="contain"
          style={styles.logoImage}
        />
        <Text style={styles.logoText}>Tastie!</Text>
      </View>
      <Formik
        initialValues={initialValues}
        // onSubmit={values => handleLogin(values)}
        onSubmit={values => dispatch(signin(values.phone, values.password))}>
        {formikProps => {
          const {
            errors,
            values,
            touched,
            handleSubmit,
            handleChange,
            handleBlur,
          } = formikProps;

          return (
            <View style={styles.formWrapper}>
              <View style={styles.inputWrapper}>
                <Text style={styles.label}>Phone number:</Text>
                <TextInput
                  style={styles.inputField}
                  onChangeText={handleChange('phone')}
                  onBlur={handleBlur('phone')}
                />
              </View>
              <View style={styles.inputWrapper}>
                <Text style={styles.label}>Password:</Text>
                <TextInput
                  style={styles.inputField}
                  secureTextEntry={true}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                />
              </View>
              <CheckBox
                title="Remember password"
                checked={checked}
                checkedIcon="check"
                onPress={() => setChecked(!checked)}
                containerStyle={styles.checkbox}
                uncheckedColor="#000"
              />
              <View style={styles.buttonWrapper}>
                <TouchableOpacity
                  style={styles.signinButton}
                  onPress={handleSubmit}>
                  <Text style={styles.signinLabel}>Sign in</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.buttonWrapper}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('ForgotForm')}>
                  <Text style={styles.forgotPassword}>Forgot password</Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 20,
                }}>
                <Text>Not a Delitaste member yet ? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                  <Text style={{color: colors.primary, fontWeight: 'bold'}}>
                    Sign up
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  headerWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  logoImage: {
    width: 60,
    height: 60,
  },
  logoText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: colors.red,
    marginLeft: 10,
  },
  formWrapper: {
    paddingHorizontal: 20,
    // marginRight: 80,
    width: '100%',
  },
  inputWrapper: {
    marginTop: 20,
    paddingHorizontal: 20,
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  inputField: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#e6e6e6',
    borderRadius: 5,
    width: '100%',
    marginTop: 10,
    fontSize: 18,
  },
  checkbox: {
    backgroundColor: '#fff',
    borderWidth: 0,
    textAlign: 'left',
  },
  buttonWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  signinButton: {
    backgroundColor: colors.primary,
    marginVertical: 20,
    paddingVertical: 10,
    paddingHorizontal: 5,
    width: '40%',
    borderRadius: 20,
  },
  signinLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  forgotPassword: {
    color: '#997500',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
