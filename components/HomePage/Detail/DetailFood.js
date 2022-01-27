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
  const [totalPrice, setTotalPrice] = useState(parseFloat(item.price));
  const [orderData, setOrderData] = useState(null);

  /* 
    This is pre-processing section
    TODO: intial the default value for the additional option form
  */
  let optionTabs = [];
  let toggledList = [];
  let form = [];
  let radioOptions = [];
  let checkOptions = [];
  item.additionalOptions.forEach(o => {
    optionTabs.push(o.optionName);
    toggledList.push('1'); // to expand all options

    // inital the default submit form
    form.push({
      optionName: o.optionName,
      options: o.required
        ? [
            {
              optionItemName: o.optionList[0].optionItemName,
              price: o.optionList[0].price,
            },
          ]
        : [],
    });
    // this is an array of the option list whose type is radio input (only choose one)
    radioOptions.push(o.radio ? o.optionList[0] : {});
    // this is an array of the option list whose type is checkbox (can choose multiple options)
    checkOptions.push([]);
  });
  const [optionToggled, setOptionToggled] = useState({
    target: optionTabs[0],
    toggled: toggledList,
  });

  const [radioSelected, setRadioSelected] = useState(radioOptions);
  const [checkSelected, setCheckSelected] = useState(checkOptions);

  const handleSubmit = () => {};

  useEffect(() => {
    // console.log(toggledList);
    // console.log(form[0]);
    // console.log(form[1]);
    // console.log(form[2]);
    // console.log(form[3]);
    // console.log(radioSelected[0].optionItemName);
    console.log(checkOptions);
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
      <ScrollView>
        <View style={{paddingBottom: 20}}>
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
          {/* Radio option first */}
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
                            {option.radio ? (
                              <TouchableOpacity
                                onPress={() => {
                                  let copy = radioSelected.map((r, i) => {
                                    let oldArray = {...r};
                                    if (i === index) {
                                      oldArray = item;
                                    }
                                    return oldArray;
                                  });
                                  console.log('copy', copy);
                                  setRadioSelected(copy);
                                  // setTotalPrice(
                                  //   (
                                  //     parseFloat(totalPrice) +
                                  //     parseFloat(item.price)
                                  //   ).toFixed(2),
                                  // );
                                }}
                                style={[
                                  styles.dropdownButton,
                                  {
                                    borderWidth: 1,
                                    borderColor: 'rgba(230,230,230,0.7)',
                                  },
                                ]}>
                                <View
                                  style={{
                                    borderRadius: 10,
                                    backgroundColor:
                                      item.optionItemName ===
                                      radioSelected[index].optionItemName
                                        ? 'black'
                                        : 'white',
                                    width: 10,
                                    height: 10,
                                  }}></View>
                              </TouchableOpacity>
                            ) : (
                              <TouchableOpacity
                                onPress={() => {
                                  /* 
                                    Procedure step: 
                                    1. Clone the current state, which is the matrix (an array of an array)
                                    2. use 'some' to check if the array at this index contains the target (which is 'item')
                                    NOTE: use JSON.stringify to compare the objecs
                                    3. if contans => find the index of the value to remove, then use splice(removedPosition, 1)
                                    4. if not contains => push to the current array
                                    
                                    To show whether option is checked, just check if that array contains the target or not (use 'some' to filter)
                                  */
                                  let copy = [...checkSelected];
                                  if (
                                    copy[index].some(
                                      obj =>
                                        JSON.stringify(obj) ===
                                        JSON.stringify(item),
                                    ) === false
                                  ) {
                                    copy[index].push(item);
                                  } else {
                                    let removedPosition =
                                      copy[index].indexOf(item);
                                    copy[index].splice(removedPosition, 1);
                                  }
                                  setCheckSelected(copy);
                                  // setTotalPrice(
                                  //   (
                                  //     parseFloat(totalPrice) +
                                  //     parseFloat(item.price)
                                  //   ).toFixed(2),
                                  // );
                                  console.log(copy);
                                }}
                                style={[
                                  styles.dropdownButton,
                                  {
                                    borderWidth: 1,
                                    // borderColor: 'rgba(230,230,230,0.7)',
                                    borderRadius: 5,
                                    backgroundColor: checkSelected[index].some(
                                      obj =>
                                        JSON.stringify(obj) ===
                                        JSON.stringify(item),
                                    )
                                      ? 'black'
                                      : 'white',
                                  },
                                ]}>
                                <Feather
                                  name="check"
                                  size={10}
                                  color={'white'}
                                />
                              </TouchableOpacity>
                            )}

                            <Text style={{fontWeight: '500', marginLeft: 20}}>
                              {item.optionItemName}
                            </Text>
                          </View>
                          <Text>${item.price}</Text>
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
            Add to cart{' • '}
            <Text
              style={{
                textAlign: 'center',
                fontWeight: '500',
                color: 'white',
                fontSize: 18,
              }}>
              ${totalPrice}
            </Text>
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
    paddingBottom: 10,
    marginTop: Platform.OS === 'android' ? 20 : 5,
  },
  foodImageWrapper: {
    width,
    marginTop: 5,
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
