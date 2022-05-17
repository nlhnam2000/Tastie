import React, {useState, useEffect} from 'react';
import {View, Text, Modal, StyleSheet, TouchableOpacity, Dimensions} from 'react-native';

// components
import {IP_ADDRESS} from '../../global';

// libraries
import SelectDropdown from 'react-native-select-dropdown';
import Feather from 'react-native-vector-icons/Feather';
import axios from 'axios';

export const SchedulePickerModal = props => {
  const [scheduleTime, setScheduleTime] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedScheduleTime, setSelectedScheduleTime] = useState({
    day: null,
    time: null,
  });
  const GetScheduleTime = async provider_id => {
    try {
      const res = await axios.get(
        `http://${IP_ADDRESS}:3007/v1/api/tastie/checkout/get_schedule_time/${provider_id}`,
      );
      if (res.data.status && res.data.response.length > 0) {
        setScheduleTime(res.data.response);
      }
    } catch (error) {
      console.error('Cannot get schedule time', error);
    }
  };

  useEffect(() => {
    GetScheduleTime(props.provider_id);
  }, []);

  return (
    <Modal {...props} animationType="fade" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalView}>
          <TouchableOpacity
            style={{position: 'absolute', top: 15, left: 15}}
            onPress={() => props.onClose()}>
            <Feather name="x" size={20} color="black" />
          </TouchableOpacity>
          <Text style={[styles.heading, {marginTop: 40}]}>Pick a time</Text>
          <View
            style={{
              width: '100%',
              marginTop: 20,
            }}>
            <SelectDropdown
              data={scheduleTime}
              onSelect={(selectedItem, index) => {
                console.log(selectedItem.day, index);
                setSelectedIndex(index);
                setSelectedScheduleTime(prev => ({
                  ...prev,
                  day: selectedItem.day,
                }));
              }}
              buttonTextAfterSelection={(selectedItem, index) => {
                return selectedItem.day;
              }}
              buttonStyle={{width: '100%', marginBottom: 10, borderBottomWidth: 2}}
              buttonTextStyle={{textAlign: 'left'}}
              rowTextForSelection={(item, index) => {
                return item.day;
              }}
              defaultButtonText="Choose a day"
              renderDropdownIcon={() => <Feather name="chevron-down" size={20} color="black" />}
              dropdownIconPosition="right"
            />
            <SelectDropdown
              data={scheduleTime[selectedIndex]?.schedule_time}
              onSelect={(selectedItem, index) => {
                console.log(selectedItem, index);
                setSelectedScheduleTime(prev => ({
                  ...prev,
                  time: selectedItem,
                }));
              }}
              buttonStyle={{width: '100%', marginBottom: 10}}
              buttonTextStyle={{textAlign: 'left'}}
              buttonTextAfterSelection={(selectedItem, index) => {
                return selectedItem;
              }}
              rowTextForSelection={(item, index) => {
                return item;
              }}
              defaultButtonText="Choose a time"
              renderDropdownIcon={() => <Feather name="chevron-down" size={20} color="black" />}
              dropdownIconPosition="right"
            />
            <TouchableOpacity
              style={styles.button}
              onPress={() => props.onConfirm(selectedScheduleTime)}>
              <Text style={[styles.heading, {textAlign: 'center', color: 'white', fontSize: 17}]}>
                Schedule
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalView: {
    backgroundColor: 'white',
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    // shadowRadius: 4,
    elevation: 5,
    width: '80%',
    position: 'relative',
  },
  contentWrapper: {
    marginTop: 30,
  },
  heading: {
    fontSize: 24,
    fontWeight: '600',
  },
  button: {
    width: '100%',
    padding: 15,
    backgroundColor: 'black',
  },
});
