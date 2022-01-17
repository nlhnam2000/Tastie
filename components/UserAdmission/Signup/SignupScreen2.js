import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Button,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import {Formik, Form, Field} from 'formik';
import axios from 'axios';
import Feather from 'react-native-vector-icons/Feather';
import colors from '../../../colors/colors';
import {useSelector, useDispatch} from 'react-redux';
import {
  SendOTP,
  EmailVerification,
  clearAlertMessage,
} from '../../../store/action/auth';
import {IP_ADDRESS} from '../../../global';
import {SimpleAlertDialog} from '../../Error/AlertDialog';

const {width, height} = Dimensions.get('window');

export const SignupScreen2 = ({navigation, route}) => {
  const registerState = useSelector(state => state.UserReducer);
  const dispatch = useDispatch();

  let [verifyToken, setVerifyToken] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [openModal, setOpenModal] = useState(false);

  const {data} = route.params; // phone, email

  const initialValues = {
    input1: '',
    input2: '',
    input3: '',
    input4: '',
    input5: '',
    input6: '',
  };

  const inputRef1 = useRef();
  const inputRef2 = useRef();
  const inputRef3 = useRef();
  const inputRef4 = useRef();
  const inputRef5 = useRef();
  const inputRef6 = useRef();

  const [timer, setTimer] = useState(7);

  // send verification code to email
  useEffect(() => {
    // focus the first input field
    inputRef1.current.focus();
    // send email verification code
  }, []);

  useEffect(() => {
    const countdown = timer > 0 && setInterval(() => setTimer(timer - 1), 1000);

    return () => {
      clearInterval(countdown);
    };
  }, [timer]);

  useEffect(() => {
    if (timer === 0) {
      SendCodeToEmail(data.email);
    }
  }, [timer]);

  const SendCodeToEmail = async email => {
    try {
      let res = await axios.post(
        `http://${IP_ADDRESS}:3007/v1/api/auth/send-code-with-email`,
        {
          email: email,
        },
      );
      if (res.data.status === true) {
        // await AsyncStorage.removeItem('verified_email_token');
        console.log('Email token ', res.data.result.verifyEmailToken);
        setVerifyToken(res.data.result.verifyEmailToken);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const EmailVerification = async (emailToken, otp, email) => {
    try {
      let res = await axios.post(
        `http://${IP_ADDRESS}:3007/v1/api/auth/verify-code-with-email`,
        {
          verifyEmailToken: emailToken,
          code: otp,
          email: email,
        },
      );
      // success
      if (res.data.status === true) {
        navigation.navigate('NameInputForm', {data: data});
      } else {
        setErrorMessage('OTP Code is incorrect');
        setOpenModal(true);
      }
    } catch (error) {
      setErrorMessage('OTP Code is incorrect');
      setOpenModal(true);
    }
  };

  const handleEmailVerification = async values => {
    let otp =
      values.input1 +
      values.input2 +
      values.input3 +
      values.input4 +
      values.input5 +
      values.input6;

    await EmailVerification(verifyToken, otp, data.email);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titleHeader}>Email Verification</Text>
      <View
        style={{
          marginTop: 15,
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          width: '100%',
          paddingHorizontal: 20,
        }}>
        <Text style={{fontSize: 17}}>
          A verification code will be sent to{' '}
          <Text style={{fontWeight: 'bold', fontSize: 17}}>{data.email}</Text>
          {` in ${timer} seconds`}.
        </Text>
        <Text style={{marginTop: 10}}>
          Please enter the 6-digit code below.
        </Text>
      </View>
      <Formik
        initialValues={initialValues}
        onSubmit={values => handleEmailVerification(values)}>
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
            <View
              style={{
                width,
                height: height - 200,
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <View>
                <View style={styles.verifyCodeWrapper}>
                  <TextInput
                    keyboardType="numeric"
                    style={styles.verifyCodeInput}
                    maxLength={1}
                    onChangeText={text => {
                      handleChange('input1')(text);
                      if (text !== '') {
                        inputRef2.current.focus();
                      }
                    }}
                    onBlur={handleBlur('input1')}
                    value={values.input1}
                    ref={inputRef1}
                  />
                  <View style={{padding: 10}}></View>
                  <TextInput
                    keyboardType="numeric"
                    style={styles.verifyCodeInput}
                    maxLength={1}
                    onChangeText={text => {
                      handleChange('input2')(text);
                      if (text !== '') {
                        inputRef3.current.focus();
                      }
                    }}
                    onBlur={handleBlur('input2')}
                    value={values.input2}
                    ref={inputRef2}
                    onKeyPress={({nativeEvent}) => {
                      if (nativeEvent.key === 'Backspace') {
                        inputRef1.current.focus();
                      }
                    }}
                  />
                  <View style={{padding: 10}}></View>
                  <TextInput
                    keyboardType="numeric"
                    style={styles.verifyCodeInput}
                    maxLength={1}
                    onChangeText={text => {
                      handleChange('input3')(text);
                      if (text !== '') {
                        inputRef4.current.focus();
                      }
                    }}
                    onBlur={handleBlur('input3')}
                    value={values.input3}
                    ref={inputRef3}
                    onKeyPress={({nativeEvent}) => {
                      if (nativeEvent.key === 'Backspace') {
                        inputRef2.current.focus();
                      }
                    }}
                  />
                  <View style={{padding: 10}}></View>
                  <TextInput
                    keyboardType="numeric"
                    style={styles.verifyCodeInput}
                    maxLength={1}
                    onChangeText={text => {
                      handleChange('input4')(text);
                      if (text !== '') {
                        inputRef5.current.focus();
                      }
                    }}
                    onBlur={handleBlur('input4')}
                    value={values.input4}
                    ref={inputRef4}
                    onKeyPress={({nativeEvent}) => {
                      if (nativeEvent.key === 'Backspace') {
                        inputRef3.current.focus();
                      }
                    }}
                  />
                  <View style={{padding: 10}}></View>
                  <TextInput
                    keyboardType="numeric"
                    style={styles.verifyCodeInput}
                    maxLength={1}
                    onChangeText={text => {
                      handleChange('input5')(text);
                      if (text !== '') {
                        inputRef6.current.focus();
                      }
                    }}
                    onBlur={handleBlur('input5')}
                    value={values.input5}
                    ref={inputRef5}
                    onKeyPress={({nativeEvent}) => {
                      if (nativeEvent.key === 'Backspace') {
                        inputRef4.current.focus();
                      }
                    }}
                  />
                  <View style={{padding: 10}}></View>
                  <TextInput
                    keyboardType="numeric"
                    style={styles.verifyCodeInput}
                    maxLength={1}
                    onChangeText={handleChange('input6')}
                    onBlur={handleBlur('input6')}
                    value={values.input6}
                    ref={inputRef6}
                    onKeyPress={({nativeEvent}) => {
                      if (nativeEvent.key === 'Backspace') {
                        inputRef5.current.focus();
                      }
                    }}
                  />
                </View>
                <TouchableOpacity
                  style={styles.resendCodeWrapper}
                  onPress={() => dispatch(SendOTP(registerState.email))}>
                  <View style={{marginRight: 10}}>
                    <Feather name="mail" size={24} color={colors.primary} />
                  </View>
                  <Text>Resend verify code</Text>
                </TouchableOpacity>
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
      {/* Alert dialog here */}
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
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#fff',
  },
  titleHeader: {
    fontWeight: 'bold',
    fontSize: 24,
    alignSelf: 'flex-start',
    paddingHorizontal: 20,
  },
  verifyCodeWrapper: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 20,
  },
  verifyCodeInput: {
    padding: 10,
    width: '10%',
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    textAlign: 'center',
    fontSize: 20,
  },
  resendCodeWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  submitButton: {
    backgroundColor: colors.primary,
    marginVertical: 20,
    paddingVertical: 10,
    paddingHorizontal: 5,
    width: '40%',
    borderRadius: 20,
  },
  submitButtonText: {
    fontSize: 19,
    fontWeight: 'bold',
    textAlign: 'center',
    width: '100%',
  },
});
