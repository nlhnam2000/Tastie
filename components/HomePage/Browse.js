import React, {useState, useEffect} from 'react';
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
  Platform,
  ActivityIndicator,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

import {ShortcutImage} from '../../assets/dummy/ShortcutImage';
import colors from '../../colors/colors';
import {NavigationBar} from '../Menu/NavigationBar';

const {width, height} = Dimensions.get('window');

export const Browse = props => {
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
  } else {
    return (
      <View style={styles.container}>
        <View style={styles.searchWrapper}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Feather name="search" size={20} color={'black'} />
            <TextInput
              placeholder="Search"
              style={{marginLeft: 10}}
              maxLength={25}
              clearButtonMode="always"
            />
          </View>
        </View>
        <ScrollView>
          <View style={styles.content}>
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
          </View>
        </ScrollView>
        <NavigationBar active={props.tabname} />
      </View>
    );
  }
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
    paddingTop: 10,
    marginTop: 20,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(230,230,230,0.7)',
    width: '90%',
    paddingVertical: Platform.OS === 'ios' ? 10 : 0,
    paddingHorizontal: 8,
    borderRadius: 25,
    marginTop: Platform.OS === 'ios' ? 60 : 20,
    marginBottom: 5,
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
