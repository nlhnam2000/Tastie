import React from 'react';
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

export const ProviderList = props => {
  return (
    <View>
      {props.data.map((item, index) => {
        return (
          <TouchableOpacity
            key={index}
            onPress={() => props.navigation.navigate('DetailProvider', {data: item})}>
            <View style={styles.popularDataWrapper}>
              <ImageBackground style={styles.popularImage} resizeMode="cover" source={item.image} />
              <View style={styles.popularDetail}>
                <View style={styles.popularInfo}>
                  <Text style={{fontWeight: 'bold', color: 'black'}}>{item.title}</Text>
                  <Text>{item.deliveryTime}</Text>
                </View>
                <View style={styles.popularRating}>
                  <Text style={{color: 'black'}}>{item.rating}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  popularDataWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  popularImage: {
    height: 200,
    width: Dimensions.get('screen').width,
  },
  popularDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: Dimensions.get('screen').width,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'white',
  },
  popularInfo: {
    flexDirection: 'column',
  },
  popularRating: {
    padding: 10,
    borderRadius: 40,
    backgroundColor: '#e6e6e6',
  },
});
