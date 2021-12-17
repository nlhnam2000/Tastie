import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {Formik, Form, Field} from 'formik';
import Feather from 'react-native-vector-icons/Feather';
import {AccountRegistrationValidation} from '../../../validations/signupFormValidation';
import {useSelector, useDispatch} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {AccountRegistration} from '../../../store/action/auth';
// Feather.loadFont();

export const SignupScreen = ({navigation}) => {
  const initialValues = {
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    password1: '',
    password2: '',
  };

  const state = useSelector(state => state.UserRegistration);
  const dispatch = useDispatch();

  const submitForm = async values => {
    dispatch(AccountRegistration(values));
  };

  // useEffect(() => {
  //   setTimeout(async () => {
  //     await AsyncStorage.removeItem('token');
  //   }, 1000);
  // }, []);

  // useEffect(() => {
  //   alert(state.first_name);
  // }, []);

  return (
    <View style={styles.container}>
      <View style={styles.signupTitleWrapper}>
        <Text style={styles.signupTitle}>Account registration</Text>
      </View>
      <View style={styles.signupForm1Wrapper}>
        <Formik
          initialValues={initialValues}
          validationSchema={AccountRegistrationValidation}
          onSubmit={values => submitForm(values)}>
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
              <View style={styles.form1Wrapper}>
                <View style={styles.inputWrapper}>
                  <Text>First Name</Text>
                  <TextInput
                    name="firstname"
                    style={styles.inputField}
                    onChangeText={handleChange('firstname')}
                    onBlur={handleBlur('firstname')}
                    value={values.firstname}
                  />
                  {errors.firstname && touched.firstname && (
                    <Feather
                      name="alert-circle"
                      size={18}
                      color="red"
                      style={{marginLeft: 10}}
                    />
                  )}
                </View>
                {errors.firstname && touched.firstname && (
                  <View style={styles.errorWrapper}>
                    <Text style={{color: 'white'}}>First Name</Text>
                    <Text style={styles.errorText}>{errors.firstname}</Text>
                  </View>
                )}

                <View style={styles.inputWrapper}>
                  <Text>Last Name</Text>
                  <TextInput
                    name="lastname"
                    style={styles.inputField}
                    onChangeText={handleChange('lastname')}
                    onBlur={handleBlur('lastname')}
                    value={values.lastname}
                  />
                  {errors.lastname && touched.lastname && (
                    <Feather
                      name="alert-circle"
                      size={18}
                      color="red"
                      style={{marginLeft: 10}}
                    />
                  )}
                </View>
                {errors.lastname && touched.lastname && (
                  <View style={styles.errorWrapper}>
                    <Text style={{color: 'white'}}>Last Name</Text>
                    <Text style={styles.errorText}>{errors.lastname}</Text>
                  </View>
                )}
                <View style={styles.inputWrapper}>
                  <Text>Email</Text>
                  <TextInput
                    name="email"
                    style={styles.inputField}
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    value={values.email}
                    autoCapitalize="none"
                  />
                  {errors.email && touched.email && (
                    <Feather
                      name="alert-circle"
                      size={18}
                      color="red"
                      style={{marginLeft: 10}}
                    />
                  )}
                </View>
                {errors.email && touched.email && (
                  <View style={styles.errorWrapper}>
                    <Text style={{color: 'white'}}>Email</Text>
                    <Text style={styles.errorText}>{errors.email}</Text>
                  </View>
                )}
                <View style={styles.inputWrapper}>
                  <Text>Phone Number</Text>
                  <TextInput
                    name="phone"
                    style={styles.inputField}
                    onChangeText={handleChange('phone')}
                    onBlur={handleBlur('phone')}
                    value={values.phone}
                  />
                  {errors.phone && touched.phone && (
                    <Feather
                      name="alert-circle"
                      size={18}
                      color="red"
                      style={{marginLeft: 10}}
                    />
                  )}
                </View>
                {errors.phone && touched.phone && (
                  <View style={styles.errorWrapper}>
                    <Text style={{color: 'white'}}>phone</Text>
                    <Text style={styles.errorText}>{errors.phone}</Text>
                  </View>
                )}
                <View style={styles.inputWrapper}>
                  <Text>Password</Text>
                  <TextInput
                    name="password1"
                    style={styles.inputField}
                    secureTextEntry={true}
                    onChangeText={handleChange('password1')}
                    onBlur={handleBlur('password1')}
                    value={values.password1}
                    textContentType="none"
                  />
                  {errors.password1 && touched.password1 && (
                    <Feather
                      name="alert-circle"
                      size={18}
                      color="red"
                      style={{marginLeft: 10}}
                    />
                  )}
                </View>
                {errors.password1 && touched.password1 && (
                  <View style={styles.errorWrapper}>
                    <Text style={{color: 'white'}}>password</Text>
                    <Text style={styles.errorText}>{errors.password1}</Text>
                  </View>
                )}
                <View style={styles.inputWrapper}>
                  <Text>Re-enter Password</Text>
                  <TextInput
                    name="password2"
                    style={styles.inputField}
                    secureTextEntry={true}
                    onChangeText={handleChange('password2')}
                    onBlur={handleBlur('password2')}
                    value={values.password2}
                    textContentType="none"
                  />
                  {errors.password2 && touched.password2 && (
                    <Feather
                      name="alert-circle"
                      size={18}
                      color="red"
                      style={{marginLeft: 10}}
                    />
                  )}
                </View>
                {errors.password2 && touched.password2 && (
                  <View style={styles.errorWrapper}>
                    <Text style={{color: 'white'}}>Re-enter password</Text>
                    <Text style={styles.errorText}>{errors.password2}</Text>
                  </View>
                )}
                <Text style={styles.note}>
                  Delitaste may use your phone number to call or send text
                  messages with information regarding your account.
                </Text>
                <Text style={styles.note}>
                  By clicking Sign Up, you are indicating that you have read and
                  acknowledge the{' '}
                  <Text style={{color: '#eab200', fontWeight: 'bold'}}>
                    Terms of Service
                  </Text>{' '}
                  and{' '}
                  <Text style={{color: '#eab200', fontWeight: 'bold'}}>
                    Privacy Notice
                  </Text>{' '}
                  .
                </Text>
                <TouchableOpacity
                  style={styles.signupButton}
                  // onPress={() => navigation.navigate("Map")}
                  onPress={handleSubmit}>
                  <Text style={styles.signupText}>Sign up </Text>
                </TouchableOpacity>
              </View>
            );
          }}
        </Formik>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signupTitleWrapper: {},
  signupTitle: {
    fontWeight: 'bold',
    fontSize: 24,
  },
  signupForm1Wrapper: {},
  form1Wrapper: {
    padding: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  inputField: {
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#e6e6e6',
    borderRadius: 5,
    marginLeft: 20,
    width: '55%',
  },
  note: {
    paddingHorizontal: 20,
    paddingVertical: 5,
    marginTop: 15,
    textAlign: 'center',
  },
  signupButton: {
    backgroundColor: '#eab200',
    marginVertical: 40,
    padding: 10,
    width: '50%',
    borderRadius: 20,
    position: 'absolute',
    top: '100%',
    left: '30%',
  },
  signupText: {
    fontSize: 19,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  errorWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    marginTop: 2,
    marginRight: 30,
    color: 'red',
  },
});
