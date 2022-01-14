import React, {useState} from 'react';
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
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {useSelector, useDispatch} from 'react-redux';
import {signout} from '../../../store/action/auth';
import colors from '../../../colors/colors';

const {width, height} = Dimensions.get('window');

export const DetailAccount = props => {
  const dispatch = useDispatch();
  const state = useSelector(state => state.UserReducer);
  const fullname = state.first_name + ' ' + state.last_name;

  const [openModal, setOpenModal] = useState(false);

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
              // backgroundColor: 'red',
              marginLeft: 30,
            }}>
            Profile
          </Text>
          <TouchableOpacity>
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
                editable={false}
                style={styles.inputField}
                value={state.phone}
              />
              <Button title="EDIT" color={colors.yellow} />
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
                editable={false}
                style={styles.inputField}
                value={state.email}
              />
            </View>
          </View>
          <View style={{marginTop: 60}}>
            <Button
              color={colors.yellow}
              title="Logout"
              onPress={() => setOpenModal(true)}
            />
          </View>
        </View>
      </SafeAreaView>
      {/* <Text>Hello</Text> */}
      <Modal animationType="slide" transparent={true} visible={openModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text>Are you sure to logout ?</Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                marginTop: 20,
              }}>
              <TouchableOpacity
                style={styles.cancelModal}
                onPress={() => setOpenModal(false)}>
                <Text
                  style={{
                    textAlign: 'center',
                    color: 'black',
                    fontWeight: 'bold',
                  }}>
                  No
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmModal}
                onPress={() => dispatch(signout())}>
                <Text
                  style={{
                    textAlign: 'center',
                    color: 'black',
                    fontWeight: 'bold',
                  }}>
                  Yes``
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
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
    // backgroundColor: '#f2f2f2',
    width: '100%',
  },
  headerWrapper: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'white',
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
    // borderBottomColor: 'rgba(230,230,230,0.7)',
    // borderBottomWidth: 1,
    paddingVertical: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
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
