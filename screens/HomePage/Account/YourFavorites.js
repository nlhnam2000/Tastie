import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import axios from 'axios';
import {IP_ADDRESS} from '../../../global';

export const YourFavorites = props => {
  useEffect(() => {
    const LoadData = async () => {
      try {
        let res = await axios.post(`https://${IP_ADDRESS}:3010/v1/api/tastie/admin/get-all-user`, {
          limit: 20,
          offset: 1,
        });
        if (res.data.status) {
          console.log(res.data.response);
        }
      } catch (error) {
        console.error('Cannot get all user', error);
      }
    };

    LoadData();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Your favorites</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});
