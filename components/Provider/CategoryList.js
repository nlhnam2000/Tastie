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
import {shuffle, IP_ADDRESS, OpenStatus, convertDollar} from '../../global';
import axios from 'axios';
import {useSelector} from 'react-redux';
import {SimpleSkeleton} from '../Skeleton/SimpleSkeleton';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../../colors/colors';

const {width} = Dimensions.get('window');

export const CategoryList = props => {
  const [loading, setLoading] = useState(true);
  const [providerList, setProviderList] = useState([]);
  const state = useSelector(state => state.UserReducer);

  const loadProvider = async group_id => {
    let res = await axios.post(
      `http://${IP_ADDRESS}:3008/v1/api/provider/dashboard/home/get-group-provider`,
      {
        group_provider_id: group_id,
        limit: 6,
        offset: props.offset ?? 1,
        latitude: props.location.latitude,
        longitude: props.location.longitude,
        user_id: state.user_id,
      },
    );
    if (res.data.response) {
      setProviderList(res.data.response.filter(r => OpenStatus(r.operation_time) !== 'OFF'));
    }
    setLoading(false);
  };

  useEffect(() => {
    loadProvider(props.groupID);
  }, []);

  useEffect(() => {
    if (props.location !== null) {
      setLoading(true);
      loadProvider(props.groupID);
    }
  }, [props.location]);

  if (loading || providerList.length === 0) {
    return (
      <View style={styles.container}>
        <SimpleSkeleton />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.flexRowBetween, {paddingHorizontal: 20, width: '100%'}]}>
        <Text style={styles.heading}>{props.categoryTitle}</Text>
        <TouchableOpacity
          onPress={() =>
            props.navigation.navigate('ResultContent', {
              groupID: props.groupID,
              title: props.categoryTitle,
            })
          }>
          <Text>View all</Text>
        </TouchableOpacity>
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
                style={{
                  height: 150,
                  width: width - 80,
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                }}>
                {OpenStatus(item.operation_time) === 'CLOSED' && (
                  <View
                    style={{
                      backgroundColor: 'rgba(0,0,0,0.5)',
                      width: '100%',
                      height: 150,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Feather name="moon" size={20} color="white" />
                    <Text style={{color: 'white', fontWeight: 'bold', marginTop: 10}}>
                      Currently unavaible
                    </Text>
                  </View>
                )}
                {item.isFavorite ? (
                  <MaterialIcon
                    name="heart"
                    size={22}
                    color={'white'}
                    style={{
                      position: 'absolute',
                      right: 5,
                      top: 5,
                    }}
                  />
                ) : (
                  <Feather
                    name="heart"
                    size={22}
                    color="white"
                    style={{position: 'absolute', right: 5, top: 5}}
                  />
                )}
              </ImageBackground>
              <View style={[styles.flexRowBetween]}>
                <View style={{paddingVertical: 10, paddingHorizontal: 15}}>
                  <View style={{width: width - 200, marginBottom: 5}}>
                    <Text numberOfLines={1} style={[styles.subheading]}>
                      {item.provider_name}
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text>{(item.distance / 1000).toFixed(2)} km • </Text>
                    <Text>${convertDollar(item.delivery_fee)} delivery fee • </Text>
                    <Text>{item.estimated_cooking_time} min</Text>
                  </View>
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
    marginTop: 10,
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
