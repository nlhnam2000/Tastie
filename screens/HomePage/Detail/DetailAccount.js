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
  Image,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector, useDispatch} from 'react-redux';
import {signout} from '../../../store/action/auth';
import colors from '../../../colors/colors';
import {
  SimpleAlertDialog,
  DuoAlertDialog,
  ActionAlertDialog,
} from '../../../components/Error/AlertDialog';
import {Header} from '../../../components/Layout/Header/Header';
import {IP_ADDRESS, getAccessToken} from '../../../global';
import {
  clearAlertMessage,
  UpdateProfile,
  retrieveToken,
  DisplayAlertMessage,
} from '../../../store/action/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {ScrollView} from 'react-native-gesture-handler';
import {launchImageLibrary} from 'react-native-image-picker';

const {width, height} = Dimensions.get('window');

const ACCOUNT_FORM_HEIGHT = height - 250;

export const DetailAccount = props => {
  const dispatch = useDispatch();
  const state = useSelector(state => state.UserReducer);
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [updateForm, setUpdateForm] = useState({
    account_id: state.user_id,
    phone: state.phone || '',
    email: state.email || '',
    first_name: state.first_name || '',
    last_name: state.last_name || '',
    isChanged: false,
  });
  const [showUpdateButton, setShowUpdateButton] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [assetAvatar, setAssetAvatar] = useState(null);

  const submitForm = () => {
    const form = {
      account_id: updateForm.account_id,
      phone: updateForm.phone,
      email: updateForm.email,
      first_name: updateForm.first_name,
      last_name: updateForm.last_name,
    };
    dispatch(UpdateProfile(form));
    setTimeout(() => {
      props.navigation.goBack();
      // dispatch(NavigateToAccount());
    }, 2500);
  };

  const phoneInputRef = useRef();
  const firstnameInputRef = useRef();
  const lastnameInputRef = useRef();
  const emailInputRef = useRef();

  const handleSetAvatar = () => {
    launchImageLibrary({}, response => {
      setAssetAvatar(response.assets[0].uri);
      console.log(response.assets);
    });
  };

  const handleUploadAvatar = async () => {
    const data = new FormData();
    data.append('user_id', state.user_id);
    data.append('image_name', `${new Date()}_avatar`);
    data.append('image', {
      uri: assetAvatar,
      name: `${new Date()}_avatar`,
      type: 'image/png',
    });

    try {
      const res = await axios.post(
        `http://${'localhost'}:3777/upload/image-user-cloudinary`,
        data,
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      if (res.data.status) {
        // success
        setAvatar(res.data.url);
        setAssetAvatar(null);
        // await AsyncStorage.setItem('@userAvatar', assetAvatar);
        alert('Upload image successfully !');
      }
    } catch (error) {
      console.error('Cannot upload avatar', error);
    }
  };

  const RetrieveAvatar = async () => {
    try {
      const res = await axios.get(`http://${IP_ADDRESS}:3777/upload/image-user/${state.user_id}`);
      if (res.data.status) {
        setAvatar(`data:image/png;base64,${res.data.response.at(-1).url_str}`);

        // cache avatar using AsyncStorage
        // await AsyncStorage.setItem(
        //   '@userAvatar',
        //   `data:image/png;base64,${res.data.response.at(-1).url_str}`,
        // );
      }
    } catch (error) {
      console.error('cannot get user image', error);
    }
  };

  const RetrieveAvatarCloudinary = async () => {
    try {
      const res = await axios.get(
        `http://${'localhost'}:3777/upload/image-user-cloudinary/${state.user_id}`,
      );
      if (res.data.url) {
        setAvatar(res.data.url);
      }
    } catch (error) {
      console.log('cannot get user image', error);
    }
  };

  useEffect(() => {
    setTimeout(async () => {
      let refreshToken = await AsyncStorage.getItem('user_token');
      let accessToken = await getAccessToken(refreshToken);
      dispatch(retrieveToken(accessToken));

      await RetrieveAvatarCloudinary();

      // console.log(state);
      setLoading(false);
    }, 200);
    // setLoading(false);
  }, []);

  useEffect(() => {
    if (updateForm.isChanged) {
      setShowUpdateButton(true);
    }
  }, [updateForm]);

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
        <View style={styles.content}>
          <Header goBack title="Profile" {...props} />
          <View style={styles.flexJustifyCenter}>
            <View
              style={{
                width: 80,
                height: 80,
                backgroundColor: '#f2f2f2',
                borderRadius: 40,
                justifyContent: 'center',
              }}>
              <TouchableOpacity onPress={() => handleSetAvatar()}>
                {avatar ? (
                  <Image
                    source={{uri: assetAvatar ? assetAvatar : avatar}}
                    style={{width: 80, height: 80, overflow: 'hidden', borderRadius: 40}}
                  />
                ) : (
                  <MaterialIcon
                    name="account"
                    size={45}
                    color="black"
                    style={{alignSelf: 'center'}}
                  />
                )}
              </TouchableOpacity>
            </View>
            <Text
              style={{
                fontSize: 17,
                fontWeight: '600',
                marginTop: 10,
              }}>{`${state.first_name} ${state.last_name}`}</Text>
            {assetAvatar ? <Button title="Upload" onPress={() => handleUploadAvatar()} /> : null}
          </View>
          <View style={styles.formWrapper}>
            <View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>First Name</Text>
                <TextInput
                  ref={firstnameInputRef}
                  style={styles.inputField}
                  value={updateForm.first_name}
                  onChangeText={text =>
                    setUpdateForm(prev => ({
                      ...prev,
                      first_name: text,
                      isChanged: true,
                    }))
                  }
                  onFocus={() =>
                    firstnameInputRef.current.setNativeProps({
                      style: {
                        borderBottomWidth: 1,
                        borderBottomColor: 'rgba(230,230,230, 1.0)',
                        marginBottom: 10,
                        paddingBottom: 0,
                      },
                    })
                  }
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Last Name</Text>
                <TextInput
                  ref={lastnameInputRef}
                  style={styles.inputField}
                  value={updateForm.last_name}
                  onChangeText={text =>
                    setUpdateForm(prev => ({
                      ...prev,
                      last_name: text,
                      isChanged: true,
                    }))
                  }
                  onFocus={() =>
                    lastnameInputRef.current.setNativeProps({
                      style: {
                        borderBottomWidth: 1,
                        borderBottomColor: 'rgba(230,230,230, 1.0)',
                        marginBottom: 10,
                        paddingBottom: 0,
                      },
                    })
                  }
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Phone number</Text>
                <TextInput
                  ref={phoneInputRef}
                  style={styles.inputField}
                  value={updateForm.phone}
                  onChangeText={text =>
                    setUpdateForm(prev => ({
                      ...prev,
                      phone: text,
                      isChanged: true,
                    }))
                  }
                  onFocus={() =>
                    phoneInputRef.current.setNativeProps({
                      style: {
                        borderBottomWidth: 1,
                        borderBottomColor: 'rgba(230,230,230, 1.0)',
                        marginBottom: 10,
                        paddingBottom: 0,
                      },
                    })
                  }
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Email</Text>
                <TextInput
                  ref={emailInputRef}
                  style={styles.inputField}
                  value={updateForm.email}
                  onChangeText={text =>
                    setUpdateForm(prev => ({
                      ...prev,
                      email: text,
                      isChanged: true,
                    }))
                  }
                  onFocus={() =>
                    emailInputRef.current.setNativeProps({
                      style: {
                        borderBottomWidth: 1,
                        borderBottomColor: 'rgba(230,230,230, 1.0)',
                        marginBottom: 10,
                        paddingBottom: 0,
                      },
                    })
                  }
                />
              </View>
              {updateForm.isChanged && (
                <TouchableOpacity
                  onPress={() => submitForm()}
                  style={{
                    backgroundColor: colors.boldred,
                    width: '30%',
                    alignSelf: 'center',
                    paddingVertical: 10,
                    marginTop: 10,
                  }}>
                  <Text style={{textAlign: 'center', color: 'white', fontWeight: '500'}}>
                    Update
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                width: '100%',
                justifyContent: 'center',
              }}>
              <TouchableOpacity style={styles.signoutButton} onPress={() => setOpenModal(true)}>
                <Text
                  style={{color: 'white', fontSize: 16, fontWeight: '500', textAlign: 'center'}}>
                  Sign out
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
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
    // position: 'relative',
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
    width: '100%',
    fontWeight: '500',
    marginTop: 5,
    fontSize: 17,
    // paddingVertical: Platform.OS === 'ios' ? 10 : 0,
    color: 'black',
    marginVertical: Platform.OS === 'ios' ? 10 : 0,
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
    backgroundColor: 'black',
    borderRadius: 20,
    padding: 10,
    width: '30%',
  },
  flexJustifyCenter: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#c4c4c4',
  },
  formWrapper: {
    width: '100%',
    padding: 15,
    // backgroundColor: 'red',
    justifyContent: 'space-between',
    position: 'relative',
    height: ACCOUNT_FORM_HEIGHT,
  },
  formGroup: {
    marginBottom: Platform.OS === 'ios' ? 10 : 0,
  },
  formLabel: {
    color: 'gray',
  },
  signoutButton: {
    backgroundColor: 'black',
    paddingHorizontal: 15,
    paddingVertical: 10,
    width: '50%',
  },
});
