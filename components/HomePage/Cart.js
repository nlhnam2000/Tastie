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
        <Text>Cart</Text>
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
