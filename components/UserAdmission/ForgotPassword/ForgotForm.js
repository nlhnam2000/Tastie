import React from 'react';
import {
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import {Formik} from 'formik';
import axios from 'axios';

export const ForgotForm = props => {
  const initialValues = {
    phone: '',
    email: '',
  };
  const handlePasswordReset = async values => {
    console.log('values', values);
    let res = await axios.post(
      'http://localhost:3007/v1/auth/resest-password',
      {
        phone: values.phone,
        email: values.email,
      },
    );
    if (res.data.status === true) {
      props.navigation.navigate('ResetPasswordDone');
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <Text style={{textAlign: 'center'}}>
        Look like you don't remember your password. Please fill your phone
        number and email as below so that we can send the reset password to your
        email
      </Text>
      <Formik initialValues={initialValues} onSubmit={handlePasswordReset}>
        {formikProp => {
          const {
            errors,
            values,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
          } = formikProp;
          return (
            <View style={styles.formWrapper}>
              <View style={styles.inputWrapper}>
                <Text style={styles.label}>Phone number:</Text>
                <TextInput
                  style={styles.inputField}
                  onChangeText={handleChange('phone')}
                  onBlur={handleBlur('phone')}
                  keyboardType="number-pad"
                />
              </View>
              <View style={styles.inputWrapper}>
                <Text style={styles.label}>Email:</Text>
                <TextInput
                  style={styles.inputField}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  autoCapitalize="none"
                />
              </View>
              <View style={styles.buttonWrapper}>
                <TouchableOpacity
                  style={styles.resetButton}
                  onPress={handleSubmit}>
                  <Text style={styles.resetLabel}>Confirm</Text>
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
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 30,
    color: 'rgb(175,0,30)',
    fontWeight: 'bold',
    marginBottom: 15,
  },
  formWrapper: {
    width: '100%',
  },
  inputWrapper: {
    marginTop: 20,
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
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
  buttonWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  resetButton: {
    backgroundColor: colors.primary,
    marginVertical: 20,
    paddingVertical: 10,
    paddingHorizontal: 5,
    width: '40%',
    borderRadius: 20,
  },
  resetLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
