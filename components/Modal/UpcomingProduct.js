import React, {createRef, useEffect, useRef, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
  TouchableOpacity,
  TextInput,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  Animated,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
  Modal,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import colors from '../../colors/colors';

export const UpcomingProduct = props => {
  const [selected, setSelected] = useState(null);
  const options = [
    'Absolutely yes! I cannot wait to try this!',
    'It seems good. I am curious about its favor.',
    'Neutral. I am not sure.',
    'I am not interested.',
    'It is not my thing!',
    'Other',
  ];
  return (
    <Modal animationType="slide" transparent={true} visible={props.visible}>
      <View style={styles.modalContainer}>
        <View style={styles.modalView}>
          <View style={styles.modalHeader}>
            <View style={styles.upcomingBanner}>
              <Text style={{fontSize: 16, fontWeight: 'bold', color: 'white'}}>Comming soon</Text>
            </View>
            <TouchableOpacity onPress={() => props.onCancel()}>
              <Feather name="x" size={20} color={'black'} style={{paddingHorizontal: 10}} />
            </TouchableOpacity>
          </View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{width: '100%', position: 'absolute', height: Dimensions.get('window').height}}>
            <View style={{width: '100%', height: 'auto'}}>
              <Image
                source={require('../../assets/image/upcomingproduct.png')}
                resizeMode="cover"
                style={{width: '100%', height: 250}}
              />
              <View style={styles.productInfo}>
                <View style={styles.productHeader}>
                  <Text style={styles.heading}>Sunny Side Breakfast Bowl</Text>
                  <Text>$5.50</Text>
                </View>
                <Text>
                  Organic sunny-side egg, avocado, caramelized onion, roasted Brussels sprouts and
                  sweet potato, farro, massaged kale, citrus-cumin salt, pistachio dukkah. This item
                  contains nuts.
                </Text>
                <View style={styles.optionHeader}>
                  <Text style={{fontSize: 17, fontWeight: '500'}}>
                    Are you eager to try this upcoming product?
                  </Text>
                  <Text style={{color: 'gray', marginTop: 5}}>Required</Text>
                </View>
                <View style={styles.optionWrapper}>
                  {options.map((item, index) => (
                    <View key={index} style={styles.options}>
                      <TouchableOpacity
                        style={styles.radioButton}
                        onPress={() => setSelected(item)}>
                        <View
                          style={{
                            borderRadius: 40,
                            backgroundColor: selected === item ? 'black' : 'white',
                            width: 15,
                            height: 15,
                          }}></View>
                      </TouchableOpacity>
                      <Text style={{fontSize: 17, fontWeight: '400'}}>{item}</Text>
                    </View>
                  ))}
                </View>
                {selected === 'Other' && (
                  <KeyboardAvoidingView
                    style={styles.inputField}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                    <TextInput
                      placeholder="Tell us about your idea ..."
                      placeholderTextColor={'#787878'}
                      style={{padding: 15}}
                      multiline={true}
                      numberOfLines={3}
                    />
                  </KeyboardAvoidingView>
                )}
                <TouchableOpacity
                  style={{
                    padding: 10,
                    backgroundColor: 'black',
                    marginTop: 15,
                    width: '100%',
                  }}>
                  <Text
                    style={{color: 'white', fontWeight: '500', textAlign: 'center', fontSize: 18}}>
                    Submit
                  </Text>
                </TouchableOpacity>
                <View style={{width: '100%', height: 100}}></View>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    // backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalView: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',

    borderWidth: 2,
    borderColor: colors.secondary,
    borderBottomWidth: 0,
    width: '100%',
    height: '90%',
    overflow: 'hidden',
  },
  modalHeader: {
    width: '100%',
    zIndex: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  upcomingBanner: {
    padding: 15,
    backgroundColor: '#53B404',
    marginLeft: -2,
    marginTop: -2,
    borderBottomRightRadius: 25,
  },
  productInfo: {
    padding: 20,
    alignItems: 'center',
    width: '100%',
  },
  productHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 15,
  },
  heading: {
    fontSize: 19,
    fontWeight: 'bold',
  },
  optionHeader: {
    width: Dimensions.get('window').width,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'rgb(230,230,230)',
    marginTop: 20,
  },
  optionWrapper: {
    width: '100%',
    marginTop: 20,
  },
  options: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  radioButton: {
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#787878',
    width: 20,
    height: 20,
    marginRight: 10,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputField: {
    width: '100%',

    fontSize: 16,
    borderColor: '#787878',
    borderWidth: 1,
  },
});
