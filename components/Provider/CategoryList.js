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
  Image,
} from 'react-native';
import {shuffle, IP_ADDRESS, OpenStatus, convertDollar} from '../../global';
import axios from 'axios';
import {useSelector} from 'react-redux';
import {SimpleSkeleton} from '../Skeleton/SimpleSkeleton';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../../colors/colors';
import FastImage from 'react-native-fast-image';

const {width} = Dimensions.get('window');

export const CategoryList = props => {
  const [loading, setLoading] = useState(true);
  const [providerList, setProviderList] = useState([]);
  const state = useSelector(state => state.UserReducer);

  const loadProvider = async group_id => {
    let res = await axios.post(
      `https://${IP_ADDRESS}/v1/api/provider/dashboard/home/get-group-provider`,
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
      // setProviderList(res.data.response.filter(r => OpenStatus(r.operation_time) !== 'OFF'));
      setProviderList(
        res.data.response.filter(r => r.provider_name !== '2 Amigos Latinos Restaurant'),
      );
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

  const renderItem = ({item}) => {
    // const [imageSrc, setImageSrc] = useState({uri: item.profile_pic});
    return (
      <TouchableOpacity
        onPress={() => props.navigation.navigate('DetailProvider', {data: item.provider_id})}
        style={styles.providerWrapper}>
        <FastImage
          // onError={() => {
          //   console.log('error');
          //   setIsError(true);
          // }}
          source={
            item.profile_pic
              ? {uri: item.profile_pic}
              : require('../../assets/image/SlideShowImg/Picture1.jpg')
          }
          // source={{uri: item.profile_pic}}
          resizeMode={FastImage.resizeMode.cover}
          style={{
            height: 150,
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}>
          {item.operation_time[0].status !== 1 && (
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
        </FastImage>
        <View style={[styles.flexRowBetween, {paddingVertical: 10}]}>
          <View style={{maxWidth: '70%'}}>
            <View style={{marginBottom: 5}}>
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
          <View style={{padding: 10, borderRadius: 40, backgroundColor: 'rgba(230,230,230,0.6)'}}>
            <Text>
              {item.customer_rating ? parseFloat(item.customer_rating).toFixed(1) : 'New'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

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
        keyExtractor={item => item.provider_id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
        pagingEnabled
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
    width,
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
    width,
  },
  subheading: {
    fontWeight: '600',
    fontSize: 17,
  },
});
