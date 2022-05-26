import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Platform,
} from 'react-native';

// assets & components
import {Header} from '../../../../components/Layout/Header';

// libraries
import Feather from 'react-native-vector-icons/Feather';
import moment from 'moment';
import PushNotification from 'react-native-push-notification';

export const DetailEcoupon = props => {
  const {item} = props.route.params;

  const weekly_usage_per_user = str => {
    switch (str) {
      case 1:
        return 'once';
      case 2:
        return 'twice';
      default:
        return str + ' times';
    }
  };

  const get_payment_method = id => {
    switch (id) {
      case 1:
        return 'cash';
      case 2:
        return 'Momo wallet';
      case 3:
        return 'Credit or debit card';
      default:
        return 'Unknown';
    }
  };

  const notify = () => {
    PushNotification.localNotification({
      channelId: 'homescreen-channel',
      title: 'Test notification',
      message: 'test123',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header goBack {...props} />
      <View style={styles.ecouponWrapper}>
        <View style={{width: '90%'}}>
          <Text style={{fontSize: 18, fontWeight: '600'}}>{item.ecoupon_name}</Text>
          <Text style={{marginTop: 5, color: 'gray'}}>{item.ecoupon_description}</Text>
        </View>
        <Feather name="gift" size={25} color="black" style={{alignSelf: 'flex-end'}} />
      </View>
      <ScrollView contentContainerStyle={{paddingHorizontal: 15, paddingVertical: 5}}>
        <Text style={styles.text}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque tempora, vitae dolores
          suscipit corrupti ea similique nobis totam. Officiis, quas. Animi expedita quidem, illo
          repellendus reprehenderit
        </Text>
        <Text style={styles.text}>Ecoupon information: </Text>
        <Text style={styles.text}>• Ecoupon name: {item.ecoupon_name}</Text>
        <Text style={styles.text}>• Description: {item.ecoupon_description}</Text>
        <Text style={styles.text}>• Available until {moment(item.expire_date).format('LLLL')}</Text>
        <Text style={styles.text}>
          • This ecoupon is only used {weekly_usage_per_user(item.weekly_usage_limit_per_user)} per
          week
        </Text>
        <Text style={styles.text}>
          • Only available for {get_payment_method(item.payment_method_id)} payment
        </Text>
        <Text style={styles.text}>• For more information, contact tastie@app.com</Text>
      </ScrollView>
      <TouchableOpacity style={styles.button} onPress={() => notify()}>
        <Text
          style={{
            textAlign: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: 18,
            textTransform: 'uppercase',
          }}>
          Order Now
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
    position: 'relative',
  },
  ecouponWrapper: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    height: 100,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
  },
  text: {
    color: 'gray',
    fontSize: 16,
    marginBottom: 10,
  },
  button: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 30 : 10,
    backgroundColor: 'black',
    width: '100%',
    paddingVertical: 15,
  },
});
