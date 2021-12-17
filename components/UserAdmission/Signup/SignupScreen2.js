import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Button,
} from 'react-native';
import {Formik, Form, Field} from 'formik';
import Feather from 'react-native-vector-icons/Feather';
import colors from '../../../colors/colors';
import {useSelector, useDispatch} from 'react-redux';
import {SendOTP, EmailVerification} from '../../../store/action/auth';

export const SignupScreen2 = ({navigation, route}) => {
  const registerState = useSelector(state => state.UserReducer);
  const dispatch = useDispatch();

  const initialValues = {
    input1: '',
    input2: '',
    input3: '',
    input4: '',
    input5: '',
    input6: '',
  };

  useEffect(() => {
    setTimeout(() => {
      dispatch(SendOTP(registerState.email));
    }, 500);
  }, []);

  const handleEmailVerification = values => {
    let otp =
      values.input1 +
      values.input2 +
      values.input3 +
      values.input4 +
      values.input5 +
      values.input6;

    dispatch(
      EmailVerification(
        registerState.verified_email_token,
        otp,
        registerState.email,
      ),
    );
    // console.log('Email token', registerState.verified_email_token);
    // console.log('Code', otp);
    // console.log('Email', registerState.email);
    // alert(otp);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titleHeader}>Email Verification</Text>
      <View style={{marginTop: 15, alignItems: 'flex-start'}}>
        <Text>A verification code was sent to your gmail.</Text>
        <Text>
          Please enter the 6-digit code already sent to your email{' '}
          <Text style={{fontWeight: 'bold'}}>{registerState.email}</Text>.
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
            <>
              <View style={styles.verifyCodeWrapper}>
                <TextInput
                  keyboardType="numeric"
                  style={styles.verifyCodeInput}
                  maxLength={1}
                  onChangeText={handleChange('input1')}
                  onBlur={handleBlur('input1')}
                  value={values.input1}
                />
                <View style={{padding: 10}}></View>
                <TextInput
                  keyboardType="numeric"
                  style={styles.verifyCodeInput}
                  maxLength={1}
                  onChangeText={handleChange('input2')}
                  onBlur={handleBlur('input2')}
                  value={values.input2}
                />
                <View style={{padding: 10}}></View>
                <TextInput
                  keyboardType="numeric"
                  style={styles.verifyCodeInput}
                  maxLength={1}
                  onChangeText={handleChange('input3')}
                  onBlur={handleBlur('input3')}
                  value={values.input3}
                />
                <View style={{padding: 10}}></View>
                <TextInput
                  keyboardType="numeric"
                  style={styles.verifyCodeInput}
                  maxLength={1}
                  onChangeText={handleChange('input4')}
                  onBlur={handleBlur('input4')}
                  value={values.input4}
                />
                <View style={{padding: 10}}></View>
                <TextInput
                  keyboardType="numeric"
                  style={styles.verifyCodeInput}
                  maxLength={1}
                  onChangeText={handleChange('input5')}
                  onBlur={handleBlur('input5')}
                  value={values.input5}
                />
                <View style={{padding: 10}}></View>
                <TextInput
                  keyboardType="numeric"
                  style={styles.verifyCodeInput}
                  maxLength={1}
                  onChangeText={handleChange('input6')}
                  onBlur={handleBlur('input6')}
                  value={values.input6}
                />
                <View style={{padding: 10}}></View>
              </View>
              <View style={styles.resendCodeWrapper}>
                <TouchableOpacity style={{marginRight: 10}}>
                  <Feather name="mail" size={24} color={colors.primary} />
                </TouchableOpacity>
                <Text>Resend verify code</Text>
              </View>
              <TouchableOpacity style={styles.submitButton}>
                <Text style={styles.submitButtonText} onPress={handleSubmit}>
                  Verify
                </Text>
              </TouchableOpacity>
            </>
          );
        }}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  titleHeader: {
    fontWeight: 'bold',
    fontSize: 24,
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
    justifyContent: 'space-between',
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
