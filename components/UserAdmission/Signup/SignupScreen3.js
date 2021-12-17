import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Button,
  Image,
  Picker,
} from 'react-native';
import {Formik, Form, Field} from 'formik';
import Feather from 'react-native-vector-icons/Feather';
import colors from '../../../colors/colors';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import DatePicker from 'react-native-date-picker';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';
import RNPickerSelect from 'react-native-picker-select';
import {SkipUpdate} from '../../../store/action/auth';
import {useSelector, useDispatch} from 'react-redux';

export const SignupScreen3 = ({navigation}) => {
  const [avatar, setAvatar] = useState(null);
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(new Date());
  const [selected, setSelected] = useState(false);
  const [gender, setGender] = useState('male');

  const radioProps = [
    {label: 'Male', value: 0},
    {label: 'Female', value: 1},
    {label: 'Other', value: 2},
  ];

  const countries = [
    {label: 'Vietnam', value: 'vietnam'},
    {label: 'United State', value: 'us'},
    {label: 'China', value: 'china'},
  ];

  const cities = [
    {label: 'Hồ Chí Minh', value: 'hcm'},
    {label: 'New York', value: 'newyork'},
    {label: 'Beijing', value: 'beijing'},
  ];

  const districts = [
    {label: 'Quận 1', value: 'q1'},
    {label: 'Quận 5', value: 'q5'},
    {label: 'Quận 8', value: 'q8'},
  ];

  const registerState = useSelector(state => state.UserReducer);
  const dispatch = useDispatch();

  const handleUploadImage = () => {
    const options = {};
    launchImageLibrary(options, response => {
      console.log(response.assets[0].uri);
      setAvatar(response.assets[0].uri);
    });
  };

  useEffect(() => {
    setTimeout(async () => {
      console.log(registerState);
    }, 500);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.titleHeader}>Update your profile</Text>
      {/* {avatar && (
        <Image source={{ uri: avatar }} style={{ width: 300, height: 300 }} />
      )}
      <Button title="Choose your image" onPress={() => handleUploadImage()} /> */}
      <View style={styles.formWrapper}>
        <View>
          <Formik>
            {formikProps => {
              const {values, errors, touched} = formikProps;
              return (
                <View>
                  <View style={styles.previewAvatarWrapper}>
                    {avatar
                      ? [
                          <Image
                            source={{uri: avatar}}
                            style={styles.previewAvatar}
                            key={0}
                          />,
                          <Button
                            title="Change image"
                            onPress={() => handleUploadImage()}
                            key={1}></Button>,
                        ]
                      : [
                          <Image
                            source={require('../../../assets/image/default-avatar.png')}
                            style={styles.previewAvatar}
                            key={0}
                          />,
                          <Button
                            title="Upload image"
                            onPress={() => handleUploadImage()}
                            key={1}></Button>,
                        ]}
                  </View>
                  <View style={styles.formGroup}>
                    <Text style={styles.label}>Birthday</Text>
                    <TextInput
                      style={styles.inputField}
                      value={
                        (selected && date.toISOString().substring(0, 10)) || ''
                      }
                    />
                    <TouchableOpacity onPress={() => setOpen(true)}>
                      <Feather name="calendar" size={20} />
                    </TouchableOpacity>
                    <DatePicker
                      modal
                      mode="date"
                      open={open}
                      date={date}
                      onConfirm={date => {
                        setOpen(false);
                        setDate(date);
                        setSelected(true);
                        // alert(date.toISOString().substring(0, 10));
                      }}
                      onCancel={() => setOpen(false)}
                    />
                  </View>
                  <View style={styles.formGroup}>
                    <Text>Gender</Text>
                    <RadioForm
                      formHorizontal={true}
                      animation={true}
                      style={{marginTop: 5}}>
                      {radioProps.map((obj, i) => (
                        <RadioButton labelHorizontal={true} key={i}>
                          <RadioButtonInput
                            obj={obj}
                            index={i}
                            isSelected={gender === i}
                            borderWidth={1}
                            buttonStyle={{}}
                            buttonSize={10}
                            buttonWrapStyle={{marginLeft: 10}}
                            onPress={() => setGender(i)}
                          />
                          <RadioButtonLabel
                            obj={obj}
                            index={i}
                            labelHorizontal={true}
                            labelWrapStyle={{}}
                          />
                        </RadioButton>
                      ))}
                    </RadioForm>
                  </View>
                  <View style={styles.formGroup}>
                    <Text>Address</Text>
                    <TextInput style={styles.inputField} />
                    <TouchableOpacity
                      onPress={() => navigation.navigate('Location')}>
                      <Feather name="map-pin" size={20} />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.formGroup}>
                    <Text>Country</Text>
                    <View style={styles.selectFieldWrapper}>
                      <RNPickerSelect
                        onValueChange={values => console.log(values)}
                        items={countries}
                        placeholder={{
                          label: 'Select your country ... ',
                          value: null,
                        }}
                      />
                    </View>
                  </View>
                  <View style={styles.formGroup}>
                    <Text>City</Text>
                    <View style={styles.selectFieldWrapper}>
                      <RNPickerSelect
                        onValueChange={values => console.log(values)}
                        items={cities}
                        placeholder={{
                          label: 'Select your city ... ',
                          value: null,
                        }}
                      />
                    </View>
                  </View>
                  <View style={styles.formGroup}>
                    <Text>District</Text>
                    <View style={styles.selectFieldWrapper}>
                      <RNPickerSelect
                        onValueChange={values => console.log(values)}
                        items={districts}
                        placeholder={{
                          label: 'Select your district ... ',
                          value: null,
                        }}
                      />
                    </View>
                  </View>
                  <View style={styles.formGroup}>
                    <Text>Road/Ward</Text>
                    <TextInput style={styles.selectFieldWrapper} />
                  </View>
                  <View style={styles.submitButtonWrapper}>
                    <TouchableOpacity
                      style={styles.skipButton}
                      onPress={() => dispatch(SkipUpdate(registerState))}>
                      <Text style={styles.skipLabel}>Skip</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.updateButton}>
                      <Text style={styles.updateLabel}>Update</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            }}
          </Formik>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  titleHeader: {
    fontWeight: 'bold',
    fontSize: 24,
  },
  formWrapper: {
    marginTop: 20,
  },
  previewAvatarWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  formGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  label: {},
  inputField: {
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#e6e6e6',
    borderRadius: 5,
    marginLeft: 20,
    width: '55%',
  },
  selectFieldWrapper: {
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#e6e6e6',
    borderRadius: 5,
    marginLeft: 20,
    width: '70%',
  },
  submitButtonWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  skipButton: {
    backgroundColor: colors.secondary,
    marginVertical: 20,
    paddingVertical: 10,
    paddingHorizontal: 5,
    width: '40%',
    borderRadius: 20,
  },
  skipLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  updateButton: {
    backgroundColor: colors.primary,
    marginVertical: 20,
    paddingVertical: 10,
    paddingHorizontal: 5,
    width: '40%',
    borderRadius: 20,
  },
  updateLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
