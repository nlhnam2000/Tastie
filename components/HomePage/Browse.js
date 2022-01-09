import React from 'react';
import {
  View,
  Text,
  Flatlist,
  Image,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

import {ShortcutImage} from '../../assets/shortcuts/ShortcutImage';
import {NavigationBar} from '../Menu/NavigationBar';

const {width, height} = Dimensions.get('window');

export const Browse = props => {
  return (
    <View style={styles.container}>
      <View style={styles.searchWrapper}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Feather name="map-pin" size={22} />
          <TextInput
            placeholder="Search"
            style={{marginLeft: 5}}
            maxLength={25}
          />
        </View>
        <TouchableOpacity style={styles.searchButton}>
          <Feather name="clock" size={20} style={{marginRight: 5}} />
          <Text>Search</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {ShortcutImage.map((item, index) => {
          return (
            <TouchableOpacity style={styles.categoryWrapper} key={item.id}>
              <Text style={{fontWeight: '600'}}>{item.name}</Text>
              <Image
                source={{uri: item.image}}
                style={{width: 70, height: 70, alignSelf: 'flex-end'}}
              />
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <NavigationBar active={props.tabname} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width,
    paddingVertical: 40,
    flexWrap: 'wrap',
    flexBasis: '40%',
    flex: 1,
    paddingHorizontal: 20,
  },
  categoryWrapper: {
    backgroundColor: 'rgba(230,230,230,0.3)',
    borderRadius: 10,
    width: '45%',
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 20,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#e6e6e6',
    width: '90%',
    paddingVertical: 15,
    paddingHorizontal: 8,
    borderRadius: 25,
    marginTop: 60,
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 25,
  },
});
