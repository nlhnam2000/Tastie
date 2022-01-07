import React, {useEffect, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {signout} from '../../store/action/auth';
import {NavigationBar} from '../Menu/NavigationBar';
import {Formik} from 'formik';
import Feather from 'react-native-vector-icons/Feather';

export const Cart = props => {
  const dispatch = useDispatch();
  const state = useSelector(state => state.UserReducer);
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

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Formik
          initialValues={initialValues}
          onSubmit={values => console.log(values)}>
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
                    ref={inputRef1}
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
                  />
                  <View style={{padding: 10}}></View>
                  <TextInput
                    ref={inputRef2}
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
                    onKeyPress={({nativeEvent}) => {
                      if (nativeEvent.key === 'Backspace') {
                        inputRef1.current.focus();
                      }
                    }}
                  />
                  <View style={{padding: 10}}></View>
                  <TextInput
                    ref={inputRef3}
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
                    onKeyPress={({nativeEvent}) => {
                      if (nativeEvent.key === 'Backspace') {
                        inputRef2.current.focus();
                      }
                    }}
                  />
                  <View style={{padding: 10}}></View>
                  <TextInput
                    ref={inputRef4}
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
                    onKeyPress={({nativeEvent}) => {
                      if (nativeEvent.key === 'Backspace') {
                        inputRef3.current.focus();
                      }
                    }}
                  />
                  <View style={{padding: 10}}></View>
                  <TextInput
                    ref={inputRef5}
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
                    onKeyPress={({nativeEvent}) => {
                      if (nativeEvent.key === 'Backspace') {
                        inputRef4.current.focus();
                      }
                    }}
                  />
                  <View style={{padding: 10}}></View>
                  <TextInput
                    ref={inputRef6}
                    keyboardType="numeric"
                    style={styles.verifyCodeInput}
                    maxLength={1}
                    onChangeText={handleChange('input6')}
                    onBlur={handleBlur('input6')}
                    value={values.input6}
                    onKeyPress={({nativeEvent}) => {
                      if (nativeEvent.key === 'Backspace') {
                        inputRef5.current.focus();
                      }
                    }}
                  />
                  <View style={{padding: 10}}></View>
                </View>
                <TouchableOpacity
                  style={styles.resendCodeWrapper}
                  onPress={() => dispatch(SendOTP(registerState.email))}>
                  <View style={{marginRight: 10}}>
                    <Feather name="mail" size={24} color={colors.primary} />
                  </View>
                  <Text>Resend verify code</Text>
                </TouchableOpacity>
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

      <NavigationBar active={props.tabname} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
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
