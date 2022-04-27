import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  ImageBackground,
  Dimensions,
} from 'react-native';
import colors from '../../../colors/colors';
import Feather from 'react-native-vector-icons/Feather';
import axios from 'axios';
import {IP_ADDRESS} from '../../../global';
import {useSelector} from 'react-redux';

const {width} = Dimensions.get('window');

export const ResultContent = ({navigation, route}) => {
  const [loading, setLoading] = useState(true);
  const {groupID, title, keyword, categoryFilter} = route.params;
  const [data, setData] = useState([]);
  const [offset, setOffset] = useState(1);
  const state = useSelector(state => state.UserReducer);

  const LoadProvider = async (group_id, offset, limit = 20) => {
    try {
      let res = await axios.post(
        `http://${IP_ADDRESS}:3008/v1/api/provider/dashboard/home/get-group-provider`,
        {
          group_provider_id: group_id,
          limit: 20,
          offset: offset,
          latitude: state.userLocation.latitude,
          longitude: state.userLocation.longitude,
        },
      );
      if (res.data.response) {
        setData(res.data.response);
      }
    } catch (error) {
      console.error('Cannot get group provider', error);
    } finally {
      setLoading(false);
    }
  };

  const LoadMoreProvider = async () => {
    try {
      let res = await axios.post(
        `http://${IP_ADDRESS}:3008/v1/api/provider/dashboard/home/get-group-provider`,
        {
          group_provider_id: groupID,
          limit: 20,
          offset: offset + 1,
          latitude: state.userLocation.latitude,
          longitude: state.userLocation.longitude,
        },
      );
      if (res.data.response) {
        setData(prev => [...prev, ...res.data.response]);
        setOffset(offset + 1);
      }
    } catch (error) {
      console.error('Cannot get group provider', error);
    }
  };

  const LoadSearchResult = async keyword => {
    try {
      let res = await axios.post(`http://${IP_ADDRESS}:3007/v1/api/tastie/search`, {
        q: keyword,
        type: '1',
      });
      if (res.data.status) {
        setData(res.data.data.items);
      }
    } catch (error) {
      console.error('Cannot get group provider', error);
    } finally {
      setLoading(false);
    }
  };

  const LoadCategoryResult = async filter => {
    try {
      console.log(filter.type.toString());
      let res = await axios.post(`http://${IP_ADDRESS}:3007/v1/api/tastie/search`, {
        type: '3',
        category_infor: {
          category_type: filter.type.toString(),
          category_id: filter.categoryID,
        },
      });
      if (res.data.status) {
        setData(res.data.data.items);
      }
    } catch (error) {
      console.error('Cannot filter category', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (keyword) {
      LoadSearchResult(keyword);
    } else if (categoryFilter) {
      LoadCategoryResult(categoryFilter);
      // console.log(categoryFilter);
    } else {
      LoadProvider(groupID, offset);
    }
  }, []);

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('DetailProvider', {data: item})}
        style={styles.providerWrapper}>
        <ImageBackground
          source={{uri: item.profile_pic ?? item.avatar}}
          resizeMode="cover"
          style={{height: 200, width: width}}
        />
        <View style={[styles.flexRowBetween]}>
          <View style={{paddingVertical: 10, paddingHorizontal: 15}}>
            <View style={{width: width - 200, marginBottom: 5}}>
              <Text numberOfLines={1} style={[styles.subheading]}>
                {item.provider_name ?? item.name}
              </Text>
            </View>
            <Text>{item.estimated_cooking_time} minutes</Text>
          </View>
          <View style={{padding: 10, borderRadius: 40, backgroundColor: 'rgba(230,230,230,0.6)'}}>
            <Text>{item.order_totals}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, {justifyContent: 'center'}]}>
        <ActivityIndicator size={'large'} color={colors.red} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerWrapper}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={20} color="black" />
        </TouchableOpacity>
        <Text style={[styles.heading, {textAlign: 'center'}]}>{title}</Text>
      </View>
      <View
        style={{
          width: '100%',
        }}>
        <FlatList
          data={data}
          keyExtractor={item => item.provider_id}
          showsVerticalScrollIndicator={false}
          onEndReachedThreshold={2}
          onEndReached={async () => {
            if (keyword) {
              await LoadMoreProvider();
            }
          }}
          renderItem={renderItem}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  headerWrapper: {
    width: '100%',
    // paddingHorizontal: 20,
    paddingVertical: 10,
    position: 'relative',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(230,230,230,1.0)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 10,
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
    // paddingHorizontal: 15,
  },
  subheading: {
    fontWeight: '600',
    fontSize: 17,
  },
});
