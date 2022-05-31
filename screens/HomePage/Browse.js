import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Platform,
  ActivityIndicator,
  StatusBar,
  FlatList,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {categoryData} from '../../assets/dummy/categoryData';
import colors from '../../colors/colors';
import {NavigationBar} from '../../components/Menu/NavigationBar';
import {IP_ADDRESS} from '../../global';

const {width, height} = Dimensions.get('window');

export const Browse = props => {
  const [loading, setLoading] = useState(true);
  const [searchKey, setSearchKey] = useState(null);

  const renderCategory = ({item, index}) => {
    return (
      <TouchableOpacity
        style={styles.categoryWrapper}
        onPress={() =>
          props.navigation.navigate('ResultContent', {
            categoryFilter: {
              type: item.type,
              categoryID: item.id,
            },
            title: item.title,
            image: item.image,
          })
        }>
        <Text style={{fontWeight: '600'}}>{item.title}</Text>
        <Image source={item.image} style={{width: 70, height: 70, alignSelf: 'flex-end'}} />
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <ActivityIndicator size={'large'} color={colors.red} />
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
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
              placeholderTextColor={'gray'}
              style={{marginLeft: 15, width: '80%'}}
              clearButtonMode="always"
              onSubmitEditing={event => {
                if (searchKey && searchKey !== '') {
                  props.navigation.navigate('ResultContent', {
                    keyword: searchKey,
                    title: `Search result for ${searchKey}`,
                  });
                }
              }}
              returnKeyType="search"
              // autoFocus
              onChangeText={text => setSearchKey(text)}
            />
          </View>
        </View>
        {/* <ScrollView>
          <View style={styles.content}>
            {categoryData.map((item, index) => {
              return (
                <TouchableOpacity style={styles.categoryWrapper} key={index}>
                  <Text style={{fontWeight: '600'}}>{item.title}</Text>
                  <Image
                    source={item.image}
                    style={{width: 70, height: 70, alignSelf: 'flex-end'}}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView> */}
        <View style={{width: '100%', paddingHorizontal: 20}}>
          <FlatList
            data={categoryData}
            keyExtractor={(item, index) => item.id + index}
            numColumns={2}
            renderItem={renderCategory}
            style={{height: '70%'}}
          />
        </View>

        <NavigationBar active={props.tabname} />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
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
    margin: 10,
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
