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
import {
  SimpleAlertDialog,
  DuoAlertDialog,
  ActionAlertDialog,
} from '../../Error/AlertDialog';
import {IP_ADDRESS, getAccessToken} from '../../../global';
import {
  clearAlertMessage,
  UpdateProfile,
  retrieveToken,
} from '../../../store/action/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
const {width, height} = Dimensions.get('window');

export const DetailAccount = props => {
  const dispatch = useDispatch();
  const state = useSelector(state => state.UserReducer);
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [phone, setPhone] = useState(state.phone || '');
  const [email, setEmail] = useState(state.email || '');
  const [openUpdate, setOpenUpdate] = useState(false);

  const fullname = state.first_name + ' ' + state.last_name;

  let phoneInputRef = useRef();
  let nameInputRef = useRef();
  let emailInputRef = useRef();

  useEffect(() => {
    setTimeout(async () => {
      let refreshToken = await AsyncStorage.getItem('user_token');
      let accessToken = await getAccessToken(refreshToken);
      dispatch(retrieveToken(accessToken));
      console.log(state);
      setLoading(false);
    }, 200);
  }, []);

  // useEffect(() => {
  //   setLoading(false);
  // });

  const handleUpdateProfile = (phone, email) => {
    console.log('phone and email: ' + phone + ' ' + email);
    let user_id = state.user_id;
    dispatch(UpdateProfile(user_id, phone, email));
    setTimeout(() => {
      props.navigation.goBack();
    }, 2500);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <SafeAreaView
          style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size={'large'} color={colors.red} />
        </SafeAreaView>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.content}>
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
              Profile
            </Text>
            <TouchableOpacity
              disabled={!edit}
              onPress={() => handleUpdateProfile(phone, email)}>
              <Text
                style={{color: colors.yellow, fontWeight: '600', fontSize: 17}}>
                Update
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.accountContent}>
            <View style={styles.inputWrapper}>
              <Text style={{color: 'gray', fontSize: 17, fontWeight: '600'}}>
                Mobile Number
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <TextInput
                  editable={edit}
                  style={styles.inputField}
                  value={phone}
                  onChangeText={phone => setPhone(phone)}
                  ref={phoneInputRef}
                />
                <Button
                  title="EDIT"
                  color={colors.yellow}
                  onPress={() => {
                    setEdit(true);
                    setTimeout(() => {
                      phoneInputRef.current.focus();
                    }, 200);
                  }}
                />
              </View>
            </View>
            <View style={{backgroundColor: '#f2f2f2', height: 5, width}}></View>
            <View style={styles.inputWrapper}>
              <Text style={{color: 'gray', fontSize: 17, fontWeight: '600'}}>
                Name
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <TextInput
                  editable={false}
                  style={styles.inputField}
                  value={fullname}
                />
              </View>
            </View>
            <View style={styles.inputWrapper}>
              <Text style={{color: 'gray', fontSize: 17, fontWeight: '600'}}>
                Email
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <TextInput
                  editable={edit}
                  autoCapitalize="none"
                  style={styles.inputField}
                  value={email}
                  onChangeText={email => setEmail(email)}
                  ref={emailInputRef}
                  onFocus={() =>
                    emailInputRef.current.setNativeProps({
                      style: {
                        borderBottomWidth: 2,
                        borderBottomColor: 'rgba(230,230,230, 1.0)',
                      },
                    })
                  }
                />
              </View>
            </View>
            <View
              style={{
                marginTop: 60,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {Platform.OS === 'ios' ? (
                <Button
                  color={colors.yellow}
                  title="Logout"
                  onPress={() => setOpenModal(true)}
                />
              ) : (
                <View style={{width: '30%'}}>
                  <Button
                    color={colors.yellow}
                    title="Logout"
                    onPress={() => setOpenModal(true)}
                  />
                </View>
              )}
            </View>
          </View>
        </SafeAreaView>
        {/* Alert Dialog */}
        <DuoAlertDialog
          message="Are you sure to logout ?"
          visible={openModal}
          onCancel={() => setOpenModal(false)}
          onConfirm={() => {
            dispatch(signout());
            setOpenModal(false);
          }}
        />
        <ActionAlertDialog
          message={state.alertMessage}
          visible={state.triggerAlertMessage}
          onCancel={() => {
            dispatch(clearAlertMessage());
            // setOpenUpdate(false);
          }}
        />
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
