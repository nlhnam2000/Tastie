import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
} from 'react-native';
import {popularData} from '../../assets/dummy/popularData';
import {shuffle, IP_ADDRESS} from '../../global';
import colors from '../../colors/colors';
import axios from 'axios';
import {useSelector} from 'react-redux';

const {width} = Dimensions.get('window');

export const CategoryList = props => {
  const data = shuffle([...popularData]);
  const [loading, setLoading] = useState(true);
  const [providerList, setProviderList] = useState([]);
  const state = useSelector(state => state.UserReducer);

  useEffect(() => {
    const loadProvider = async group_id => {
      let res = await axios.post(
        `http://${IP_ADDRESS}:3008/v1/api/provider/dashboard/home/get-group-provider`,
        {
          group_provider_id: 7,
          limit: 6,
          offset: 1,
          latitude: state.userLocation.latitude,
          longitude: state.userLocation.longitude,
        },
      );
      if (res.data.response) {
        setProviderList(res.data.response);
      }
      setLoading(false);
    };

    loadProvider(props.groupID);
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size={'large'} color={colors.red} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.flexRowBetween, {paddingHorizontal: 20, width: '100%'}]}>
        <Text style={styles.heading}>{props.categoryTitle}</Text>
        <Text>View all</Text>
      </View>
      <FlatList
        data={providerList}
        keyExtractor={item => item.provider_id}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({item}) => {
          return (
            <TouchableOpacity
              onPress={() => props.navigation.navigate('DetailProvider', {data: item})}
              style={styles.providerWrapper}>
              <ImageBackground
                source={{uri: item.profile_pic}}
                resizeMode="cover"
                style={{height: 150, width: width - 80}}
              />
              <View style={[styles.flexRowBetween]}>
                <View style={{paddingVertical: 10, paddingHorizontal: 15}}>
                  <View style={{width: width - 200, marginBottom: 5}}>
                    <Text numberOfLines={1} style={[styles.subheading]}>
                      {item.provider_name}
                    </Text>
                  </View>
                  <Text>{item.estimated_cooking_time} minutes</Text>
                </View>
                <View
                  style={{padding: 10, borderRadius: 40, backgroundColor: 'rgba(230,230,230,0.6)'}}>
                  <Text>{item.order_totals}</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 10,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  flexRowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  providerWrapper: {
    paddingHorizontal: 15,
  },
  subheading: {
    fontWeight: '600',
    fontSize: 17,
  },
});
