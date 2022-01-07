import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Button} from 'react-native';

export const ResetPasswordDone = props => {
  return (
    <View style={styles.container}>
      <Text style={{textAlign: 'center'}}>
        Please check your email to log in your account with the reset password
        we have sent to your email. It might take a few second to send the
        password to your email.
      </Text>
      <Button
        title="Back to login"
        onPress={() => props.navigation.navigate('Login')}
      />
      <View style={styles.retry}>
        <Text>No password ? </Text>
        <Button
          title="Check if your phone or email is correct"
          onPress={() => props.navigation.goBack()}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  retry: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
