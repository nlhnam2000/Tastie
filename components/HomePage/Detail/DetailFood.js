import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
  TextInput,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  Animated,
  ActivityIndicator,
  Platform,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import colors from '../../../colors/colors';

const {width, height} = Dimensions.get('screen');

export const DetailOrder = props => {
  const {item} = props.route.params;
  const [loading, setLoading] = useState(true);
  const [toggle, setToggle] = useState(true);

  let optionTabs = [];
  let toggledList = [];
  item.additionalOptions.forEach(o => {
    optionTabs.push(o.optionName);
    toggledList.push('1'); // to expand all options
  });
  const [optionToggled, setOptionToggled] = useState({
    target: optionTabs[0],
    toggled: toggledList,
  });

  useEffect(() => {
    console.log(toggledList);
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
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={{paddingBottom: 20}}>
          {/* Header */}
          <View style={styles.headerWrapper}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => props.navigation.goBack()}>
              <Feather name="arrow-left" size={20} color={'black'} />
            </TouchableOpacity>
            <Text style={{fontWeight: '600', fontSize: 18, marginLeft: 15}}>
              {item.itemTitle}
            </Text>
          </View>
          {/* Image */}
          <View style={styles.foodImageWrapper}>
            <Image
              source={item.image}
              resizeMode="cover"
              style={{width, height: 200}}
            />
          </View>
          <View style={{padding: 20}}>
            <Text style={{fontSize: 25, fontWeight: '500'}}>
              {item.itemTitle}
            </Text>
          </View>
          {/* Additional option here */}
          {item.additionalOptions.map((option, index) => {
            return (
              <View key={index} style={{marginBottom: 5}}>
                <View style={styles.additionalOptionWrapper}>
                  <TouchableOpacity
                    style={styles.additionalTitle}
                    onPress={() => {
                      if (optionToggled.toggled[index] === '0') {
                        optionToggled.toggled[index] = '1';
                      } else {
                        optionToggled.toggled[index] = '0';
                      }
                      setOptionToggled({
                        target: option.optionName,
                        toggled: optionToggled.toggled,
                      });
                    }}>
                    <View>
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: '500',
                          marginBottom: 10,
                        }}>
                        {option.optionName}
                      </Text>
                      <Text style={{fontSize: 14, color: 'gray'}}>
                        {option.required ? 'Required' : 'Optional'}
                      </Text>
                    </View>
                    <View>
                      <View style={styles.dropdownButton}>
                        <Feather
                          name={
                            optionToggled.toggled[index] === '1'
                              ? 'chevron-up'
                              : 'chevron-down'
                          }
                          size={18}
                          color={'black'}
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
                {optionToggled.toggled[index] === '1' ? (
                  <View style={styles.dropdownContent}>
                    {option.optionList.map((item, id) => {
                      return (
                        <View style={styles.dropdownItem} key={id}>
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'flex-start',
                              alignItems: 'center',
                            }}>
                            <TouchableOpacity
                              style={[
                                styles.dropdownButton,
                                {
                                  borderWidth: 1,
                                  borderColor: 'rgba(230,230,230,0.7)',
                                },
                              ]}>
                              <Feather name="plus" size={15} color={'black'} />
                            </TouchableOpacity>
                            <Text style={{fontWeight: '500', marginLeft: 20}}>
                              {item.optionItemName}
                            </Text>
                          </View>
                          <Text>{item.price}</Text>
                        </View>
                      );
                    })}
                  </View>
                ) : null}
              </View>
            );
          })}
        </View>
      </ScrollView>
      <View style={styles.orderButtonWrapper}>
        <TouchableOpacity style={styles.orderButton}>
          <Text
            style={{
              textAlign: 'center',
              fontWeight: '500',
              color: 'white',
              fontSize: 18,
            }}>
            Place Order
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: 'white',
  },
  headerWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: width,
    paddingHorizontal: 20,
    marginTop: Platform.OS === 'android' ? 20 : 5,
  },
  foodImageWrapper: {
    width,
    marginTop: 20,
  },
  additionalOptionWrapper: {
    padding: 20,
    backgroundColor: 'rgba(230,230,230, 0.4)',
    width,
  },
  additionalTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownButton: {
    padding: 5,
    borderRadius: 20,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'rgb(220,220,220)',
  },
  dropdownContent: {
    paddingHorizontal: 20,
    width,
  },
  dropdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(230,230,230,0.7)',
  },
  orderButtonWrapper: {
    paddingHorizontal: 20,
    paddingVertical: Platform.OS === 'android' ? 20 : 5,
    width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderButton: {
    width: '100%',
    padding: 15,
    backgroundColor: 'black',
    // borderRadius: 10,
    marginTop: 10,
  },
});
