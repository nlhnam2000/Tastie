import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  StatusBar,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {signout} from '../../store/action/auth';
import {NavigationBar} from '../Menu/NavigationBar';
import {Formik} from 'formik';
import Feather from 'react-native-vector-icons/Feather';

export const Cart = props => {
  const dispatch = useDispatch();
  const state = useSelector(state => state.UserReducer);
  const [timer, setTimer] = useState(7);

  useEffect(() => {
    const countdown = timer > 0 && setInterval(() => setTimer(timer - 1), 1000);

    return () => {
      clearInterval(countdown);
      // setTimeout(() => {
      //   alert('Done');
      // }, 6000);
    };
  }, [timer]);

  useEffect(() => {
    if (timer === 0) {
      alert('Done');
    }
  }, [timer]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <StatusBar barStyle="dark-content" />
        <Text>{timer}</Text>
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
