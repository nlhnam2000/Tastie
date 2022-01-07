import React from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  SafeAreaView,
  TextInput,
} from 'react-native';
import {Formik} from 'formik';

export const PhoneInputForm = props => {
  const initialValues = {
    phone: '',
    email: '',
  };
  return (
    <SafeAreaView style={styles.container}>
      <Formik initialValues={initialValues}>
        {formilProps => {
          const {errors, values, handleBlur, handleChange, handleSubmit} =
            formilProps;
          return (
            <View>
              <Text>Enter your email and phone number:</Text>
              <TextInput
                style={styles.inputField}
                placeholder="Phone number"
                onChangeText={handleChange('phone')}
              />
              <TextInput
                style={styles.inputField}
                placeholder="Phone number"
                onChangeText={handleChange('phone')}
              />
            </View>
          );
        }}
      </Formik>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
