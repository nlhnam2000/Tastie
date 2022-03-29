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
import {shuffle} from '../../global';
import colors from '../../colors/colors';

const {width} = Dimensions.get('window');

export const CategoryList = props => {
  const data = shuffle([...popularData]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
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
        data={data}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({item}) => {
          return (
            <TouchableOpacity
              onPress={() => props.navigation.navigate('DetailProvider', {data: item})}
              style={styles.providerWrapper}>
              <ImageBackground
                source={item.image}
                resizeMode="cover"
                style={{width: width - 60, height: 150}}
              />
              <View style={styles.flexRowBetween}>
                <View style={{paddingVertical: 10, paddingHorizontal: 15}}>
                  <Text style={styles.subheading}>{item.title}</Text>
                  <Text>{item.deliveryTime}</Text>
                </View>
                <View
                  style={{padding: 10, borderRadius: 40, backgroundColor: 'rgba(230,230,230,0.6)'}}>
                  <Text>{item.rating}</Text>
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
