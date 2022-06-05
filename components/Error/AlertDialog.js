import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from 'react-native';
import colors from '../../colors/colors';

// ActionAlertDialog is for onCancel() using dispacth to interact with the redux store
export const ActionAlertDialog = props => {
  if (!props.visible) {
    return null;
  }
  return (
    <Modal animationType="slide" transparent={true} visible={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalView}>
          <Text style={{fontSize: 18, fontWeight: '500', textAlign: 'center'}}>
            {props.message}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              marginTop: 20,
            }}>
            <TouchableOpacity style={styles.confirmModal} onPress={() => props.onCancel()}>
              <Text
                style={{
                  textAlign: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                }}>
                OK
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// SimpleAlertDialog is use for normal alert dialog
export const SimpleAlertDialog = props => {
  const [openModal, setOpenModal] = useState(props.visible);
  if (!props.visible) {
    return null;
  }
  return (
    <Modal animationType="slide" transparent={true} visible={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalView}>
          <Text style={{fontSize: 18, fontWeight: '500', textAlign: 'center'}}>
            {props.message}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              marginTop: 20,
            }}>
            <TouchableOpacity style={styles.confirmModal} onPress={() => props.onCancel()}>
              <Text
                style={{
                  textAlign: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                }}>
                OK
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// DuoAlertDialog is for alert dialog with 2 option (YES OR NO)
export const DuoAlertDialog = props => {
  if (!props.visible) {
    return null;
  }
  return (
    <Modal animationType="slide" transparent={true} visible={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalView}>
          <Text style={{textAlign: 'center', lineHeight: 25}}>{props.message}</Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              marginTop: 20,
            }}>
            <TouchableOpacity style={styles.cancelModal} onPress={() => props.onCancel()}>
              <Text
                style={{
                  textAlign: 'center',
                  color: 'black',
                  fontWeight: 'bold',
                }}>
                No
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmModal} onPress={() => props.onConfirm()}>
              <Text
                style={{
                  textAlign: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                }}>
                Yes
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export const SingleDialog = props => {
  return (
    <Modal animationType="slide" transparent={true} visible={props.visible}>
      <View style={styles.modalContainer}>
        <View style={styles.modalView}>
          <Text style={{fontSize: 18, fontWeight: '500', textAlign: 'center'}}>
            {props.message}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              marginTop: 20,
            }}>
            <ActivityIndicator size={'large'} color={colors.red} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    borderRadius: 15,
    padding: 20,
    paddingVertical: 35,
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
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    width: '30%',
    marginRight: 20,
    borderWidth: 1,
  },
  confirmModal: {
    backgroundColor: 'black',
    borderRadius: 10,
    padding: 10,
    width: '30%',
  },
});
