import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Button,
} from 'react-native';
import {Formik, Form, Field} from 'formik';
import Feather from 'react-native-vector-icons/Feather';
import {AccountRegistrationValidation} from '../../../validations/signupFormValidation';
import {useSelector, useDispatch} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {AccountRegistration} from '../../../store/action/auth';
import colors from '../../../colors/colors';
// Feather.loadFont();

const {width, height} = Dimensions.get('window');

export const SignupScreen = ({navigation}) => {
  const initialValues = {
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    password1: '',
    password2: '',
  };

  const inputRef1 = useRef();
  const inputRef2 = useRef();
  const inputRef3 = useRef();
  const inputRef4 = useRef();
  const inputRef5 = useRef();
  const inputRef6 = useRef();

  const state = useSelector(state => state.UserRegistration);
  const dispatch = useDispatch();

  const submitForm = values => {
    dispatch(AccountRegistration(values));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Formik
          initialValues={initialValues}
          validationSchema={AccountRegistrationValidation}
          onSubmit={values => submitForm(values)}>
          {formikProps => {
            const {errors, values, handleChange, handleBlur, handleSubmit} =
              formikProps;
            return (
              <View style={styles.formWrapper}>
                <View>
                  <View style={styles.inputWrapperCol2}>
                    <View style={{width: '47%'}}>
                      <Text style={{fontWeight: '600'}}>First name:</Text>
                      <TextInput
                        clearButtonMode="always"
                        onChangeText={handleChange('firstname')}
                        onBlur={() => {
                          handleBlur('firstname');
                          inputRef1.current.setNativeProps({
                            style: {
                              borderWidth: 0,
                            },
                          });
                        }}
                        style={styles.inputField}
                        ref={inputRef1}
                        onFocus={() =>
                          inputRef1.current.setNativeProps({
                            style: {
                              borderWidth: 1,
                              borderColor: 'black',
                            },
                          })
                        }
                      />
                      <Text style={{color: 'red', marginTop: 5}}>
                        {errors.firstname ? errors.firstname : null}
                      </Text>
                    </View>
                    <View style={{width: '47%'}}>
                      <Text style={{fontWeight: '600'}}>Last name:</Text>
                      <TextInput
                        clearButtonMode="always"
                        onChangeText={handleChange('lastname')}
                        onBlur={() => {
                          handleBlur('firstname');
                          inputRef2.current.setNativeProps({
                            style: {
                              borderWidth: 0,
                            },
                          });
                        }}
                        style={styles.inputField}
                        ref={inputRef2}
                        onFocus={() =>
                          inputRef2.current.setNativeProps({
                            style: {
                              borderWidth: 1,
                              borderColor: 'black',
                            },
                          })
                        }
                        style={styles.inputField}
                      />
                      <Text style={{color: 'red', marginTop: 5}}>
                        {errors.lastname ? errors.lastname : null}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.inputWrapper}>
                    <Text style={{fontWeight: '600'}}>Email</Text>
                    <TextInput
                      autoCapitalize="none"
                      clearButtonMode="always"
                      style={styles.inputField}
                      onChangeText={handleChange('email')}
                      ref={inputRef3}
                      onFocus={() =>
                        inputRef3.current.setNativeProps({
                          style: {
                            borderWidth: 1,
                            borderColor: 'black',
                          },
                        })
                      }
                      onBlur={() => {
                        handleBlur('email');
                        inputRef3.current.setNativeProps({
                          style: {
                            borderWidth: 0,
                          },
                        });
                      }}
                    />
                    <Text style={{color: 'red', marginTop: 5}}>
                      {errors.email ? errors.email : null}
                    </Text>
                  </View>
                  <View style={styles.inputWrapper}>
                    <Text style={{fontWeight: '600'}}>Phone</Text>
                    <TextInput
                      clearButtonMode="always"
                      style={styles.inputField}
                      onChangeText={handleChange('phone')}
                      ref={inputRef4}
                      onFocus={() =>
                        inputRef4.current.setNativeProps({
                          style: {
                            borderWidth: 1,
                            borderColor: 'black',
                          },
                        })
                      }
                      onBlur={() => {
                        handleBlur('phone');
                        inputRef4.current.setNativeProps({
                          style: {
                            borderWidth: 0,
                          },
                        });
                      }}
                    />
                    <Text style={{color: 'red', marginTop: 5}}>
                      {errors.phone ? errors.phone : null}
                    </Text>
                  </View>
                  <View style={styles.inputWrapper}>
                    <Text style={{fontWeight: '600'}}>Password</Text>
                    <TextInput
                      secureTextEntry
                      clearButtonMode="always"
                      style={styles.inputField}
                      onChangeText={handleChange('password1')}
                      ref={inputRef5}
                      onFocus={() =>
                        inputRef5.current.setNativeProps({
                          style: {
                            borderWidth: 1,
                            borderColor: 'black',
                          },
                        })
                      }
                      onBlur={() => {
                        handleBlur('password1');
                        inputRef5.current.setNativeProps({
                          style: {
                            borderWidth: 0,
                          },
                        });
                      }}
                    />
                    <Text style={{color: 'red', marginTop: 5}}>
                      {errors.password1 ? errors.password1 : null}
                    </Text>
                  </View>
                  <View style={styles.inputWrapper}>
                    <Text style={{fontWeight: '600'}}>Re-enter password</Text>
                    <TextInput
                      secureTextEntry
                      clearButtonMode="always"
                      style={styles.inputField}
                      onChangeText={handleChange('password2')}
                      ref={inputRef6}
                      onFocus={() =>
                        inputRef6.current.setNativeProps({
                          style: {
                            borderWidth: 1,
                            borderColor: 'black',
                          },
                        })
                      }
                      onBlur={() => {
                        handleBlur('password2');
                        inputRef6.current.setNativeProps({
                          style: {
                            borderWidth: 0,
                          },
                        });
                      }}
                    />
                    <Text style={{color: 'red', marginTop: 5}}>
                      {errors.password2 ? errors.password2 : null}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width,
                    paddingHorizontal: 20,
                  }}>
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
                    onPress={handleSubmit}
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
              </View>
            );
          }}
        </Formik>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  content: {
    // paddingHorizontal: 20,
    marginTop: 20,
  },
  formWrapper: {
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    height: height - 100,
  },
  inputWrapperCol2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width,
    paddingHorizontal: 20,
  },
  inputField: {
    width: '100%',
    backgroundColor: 'rgba(230, 230, 230, 0.5)',
    padding: 10,
    marginTop: 5,
  },
  inputWrapper: {
    paddingHorizontal: 20,
    marginTop: 5,
    width,
  },
});
