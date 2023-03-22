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
import {useSelector} from 'react-redux';
import axios from 'axios';
import {IP_ADDRESS} from '../../global';

export const UpcomingProduct = props => {
  const state = useSelector(state => state.UserReducer);
  const [selected, setSelected] = useState(null);
  const options = [
    'Absolutely yes! I cannot wait to try this!',
    'It seems good. I am curious about its favor.',
    'Neutral. I am not sure.',
    'I am not interested.',
    'It is not my thing!',
    'Other',
  ];

  const Submit = async () => {
    const form = {
      upcoming_product_id: props.data.upcoming_product_id,
      customer_id: state.user_id,
      response: selected,
    };

    try {
      const res = await axios.post(
        `http://${IP_ADDRESS}:3007/v1/api/tastie/home/submit-upcoming-product-review`,
        form,
      );

      if (res.data.status) {
        console.log('Submit review successfully');
        props.dismiss();
      }
    } catch (error) {
      console.log('Cannot submit review', error);
    }
  };

  return (
    <>
      <View style={{width: '100%', height: 'auto'}}>
        <ImageBackground
          source={{uri: props.data.product_image}}
          resizeMode="cover"
          style={{width: '100%', height: 250, position: 'relative'}}>
          <View
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              padding: 15,
              backgroundColor: '#53B404',
              borderBottomRightRadius: 25,
            }}>
            <Text style={{fontSize: 16, fontWeight: 'bold', color: 'white'}}>Comming soon</Text>
          </View>
        </ImageBackground>
        <View style={styles.productInfo}>
          <View style={styles.productHeader}>
            <Text style={styles.heading}>{props.data.product_name}</Text>
            <Text>${props.data.estimated_price.toFixed(2)}</Text>
          </View>
          <Text>{props.data.product_description}</Text>
          <View style={styles.optionHeader}>
            <Text style={{fontSize: 17, fontWeight: '500'}}>
              Are you eager to try this upcoming product?
            </Text>
            <Text style={{color: 'gray', marginTop: 5}}>Required</Text>
          </View>
          <View style={styles.optionWrapper}>
            {props.data.choice.map((item, index) => (
              <View key={index} style={styles.options}>
                <TouchableOpacity
                  style={styles.radioButton}
                  onPress={() => setSelected(item.content)}>
                  <View
                    style={{
                      borderRadius: 40,
                      backgroundColor: selected === item.content ? 'black' : 'white',
                      width: 15,
                      height: 15,
                    }}></View>
                </TouchableOpacity>
                <Text style={{fontSize: 17, fontWeight: '400'}}>{item.content}</Text>
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
            }}
            onPress={() => Submit()}>
            <Text style={{color: 'white', fontWeight: '500', textAlign: 'center', fontSize: 18}}>
              Submit
            </Text>
          </TouchableOpacity>
          <View style={{width: '100%', height: 100}}></View>
        </View>
      </View>
    </>
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
