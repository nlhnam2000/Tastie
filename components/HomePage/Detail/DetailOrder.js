import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Button,
  Dimensions,
  TextInput,
  Modal,
  ActivityIndicator,
  Platform,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {useSelector, useDispatch} from 'react-redux';
import {signout} from '../../../store/action/auth';
import colors from '../../../colors/colors';
import {SimpleAlertDialog, DuoAlertDialog, ActionAlertDialog} from '../../Error/AlertDialog';
import {IP_ADDRESS, getAccessToken} from '../../../global';
import {clearAlertMessage, UpdateProfile, retrieveToken} from '../../../store/action/auth';
import {NavigateToAccount} from '../../../store/action/navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import io from 'socket.io-client';
const {width, height} = Dimensions.get('window');

let socket;

export const DetailOrder = props => {
  const dispatch = useDispatch();
  const state = useSelector(state => state.UserReducer);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [serverMessage, setServerMessage] = useState([]);

  useEffect(() => {
    // socket = io(`ws://5fbe-27-69-189-219.ngrok.io`); // ngrok
    socket = io(`http://${IP_ADDRESS}:3007`);
    socket.on('hello-from-server', data => {
      setServerMessage(prevState => setServerMessage([...prevState, data.message]));
    });

    setLoading(false);
    return () => {
      socket.disconnect();
    };
  }, []);

  // useEffect(() => {
  //   this.socket.on('hello-from-server', data => {
  //     setServerMessage(prevState => setServerMessage([...prevState, data.message]));
  //   });
  // }, [serverMessage]);

  const sendMessage = message => {
    socket.emit('hello-from-client', message);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size={'large'} color={colors.red} />
        </SafeAreaView>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <SafeAreaView style={[styles.content, {justifyContent: 'space-between'}]}>
          <View style={styles.headerWrapper}>
            <TouchableOpacity onPress={() => props.navigation.goBack()}>
              <Feather name="arrow-left" size={20} color={'black'} />
            </TouchableOpacity>
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 18,
                textAlign: 'center',
                marginLeft: 30,
              }}>
              Orders
            </Text>
            <TouchableOpacity>
              <Text style={{color: colors.yellow, fontWeight: '600', fontSize: 17}}>Update</Text>
            </TouchableOpacity>
          </View>
          {/* <View>
            <Text>{message !== null ? message : 'Hihi'}</Text>
          </View> */}
          <View>
            {serverMessage
              ? serverMessage.map((item, index) => <Text key={index}>{item}</Text>)
              : null}
          </View>
          <View
            style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
            <TextInput
              placeholder="type something"
              placeholderTextColor={'gray'}
              style={{
                width: '80%',
                borderWidth: 1,
                borderColor: 'gray',
                padding: 10,
                backgroundColor: 'rgba(230,230,230,0.5)',
              }}
              onChangeText={text => setMessage(text)}
            />
            <Button title="Send" onPress={() => sendMessage(message)} />
          </View>
        </SafeAreaView>
        {/* Alert Dialog */}
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
  },
  headerWrapper: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'white',
    marginTop: Platform.OS === 'android' ? 10 : 0,
  },
  accountContent: {
    width,
    // paddingHorizontal: 20,
    marginTop: 20,
  },
  inputWrapper: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  nameInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 20,
    width: '80%',
  },
  inputField: {
    width: '85%',
    fontWeight: '500',
    marginTop: 5,
    fontSize: 17,
    paddingVertical: 10,
    color: 'black',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
  },
  cancelModal: {
    backgroundColor: colors.red,
    borderRadius: 20,
    padding: 10,
    width: '30%',
    marginRight: 20,
  },
  confirmModal: {
    backgroundColor: colors.yellow,
    borderRadius: 20,
    padding: 10,
    width: '30%',
  },
});
