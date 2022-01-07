import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
  TouchableOpacity,
  TextInput,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  Animated,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

const {width, height} = Dimensions.get('screen');

export const DetailOrder = props => {
  const {item} = props.route.params;
  const renderToppingItem = ({item}) => {
    return (
      <TouchableOpacity style={styles.toppingItem}>
        <Text style={styles.toppingTitle}>{item.toppingTitle}</Text>
        <View style={styles.toppingInfo}>
          <Text style={{fontWeight: 'bold'}}>+{item.price}</Text>
          <Image
            source={item.image}
            resizeMode="contain"
            style={styles.toppingImage}
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.headerWrapper}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => props.navigation.goBack()}>
          <Feather name="chevron-left" size={18} color={'gray'} />
        </TouchableOpacity>
        <View
          style={{
            padding: 5,
            borderRadius: 40,
            borderColor: 'white',
            borderWidth: 1,
            backgroundColor: 'white',
          }}>
          <Image
            source={require('../../../assets/image/avatar.jpeg')}
            resizeMode="contain"
            style={styles.avatar}
          />
        </View>
      </View>
      <View style={styles.foodImageWrapper}>
        <Image
          source={item.image}
          resizeMode="cover"
          style={styles.foodImage}
        />
      </View>

      <View style={{width: width, paddingHorizontal: 20}}>
        <Text style={styles.foodName}>{item.itemTitle}</Text>
      </View>
      {/* Content */}
      <View style={styles.contentWrapper}>
        {/* <Image
          source={item.image}
          resizeMode="contain"
          style={styles.foodImage}
        /> */}
        {/* <View>
          <Text style={styles.foodName}>{item.itemTitle}</Text>
        </View> */}

        <View style={styles.foodContainerWrapper}>
          <View style={styles.foodContainer}>
            <View style={styles.foodContainerLeft}>
              <View style={{marginLeft: -40}}>
                <Text
                  style={{
                    color: '#999999',
                    fontSize: 20,
                    marginBottom: 10,
                    fontWeight: '600',
                  }}>
                  {item.itemTitle}
                </Text>
                <Text style={{fontSize: 25, fontWeight: 'bold'}}>
                  {item.price}
                </Text>
              </View>
              <View>
                <View style={{flexDirection: 'row', paddingHorizontal: 10}}>
                  <Image
                    source={require('../../../assets/image/avatar.jpeg')}
                    resizeMode="contain"
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 40,
                      marginLeft: -10,
                    }}
                  />
                  <Image
                    source={require('../../../assets/image/avatar.jpeg')}
                    resizeMode="contain"
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 40,
                      marginLeft: -10,
                    }}
                  />
                  <Image
                    source={require('../../../assets/image/avatar.jpeg')}
                    resizeMode="contain"
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 40,
                      marginLeft: -10,
                    }}
                  />
                </View>
                <Text style={{fontWeight: 'bold', marginTop: 5}}>
                  Rick, Stan, Agatha
                </Text>
                <Text style={{color: '#999999', fontWeight: '600'}}>
                  and 7 recommendations
                </Text>
              </View>
            </View>
            <View style={styles.foodContainerRight}>
              {/* <Image
                source={item.image}
                resizeMode="cover"
                style={styles.foodImage}
              /> */}
            </View>
          </View>
        </View>
        <View style={styles.toppingList}>
          <FlatList
            data={item.toppings}
            keyExtractor={item => item.toppingId}
            renderItem={renderToppingItem}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            bounces={false}
          />
        </View>
      </View>
      {/* Footer */}
      <View style={styles.footerWrapper}>
        <Feather name="share-2" size={25} color={'gray'} />
        <Feather name="heart" size={25} color={'gray'} />
        <TouchableOpacity
          style={{
            backgroundColor: '#00e600',
            padding: 10,
            width: 150,
            borderRadius: 20,
          }}>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 19,
              fontWeight: '400',
              color: 'white',
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
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
    zIndex: 0,
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  headerWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: width,
    paddingHorizontal: 20,
  },
  backButton: {
    padding: 15,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#e6e6e6',
    backgroundColor: 'white',
  },
  avatar: {
    borderRadius: 50,
    width: 50,
    height: 50,
  },
  contentWrapper: {
    paddingHorizontal: 20,
    // paddingLeft: 20,
    width: width,
  },
  foodName: {
    fontWeight: 'bold',
    fontSize: 40,
  },
  foodContainerWrapper: {
    marginTop: 30,
    padding: 3,
    backgroundColor: '#f2f2f2',
    borderRadius: 20,
    overflow: 'hidden',
    // width: width,
  },
  foodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 0,
    paddingLeft: 15,
    backgroundColor: 'white',
    borderRadius: 20,
    overflow: 'hidden',
    height: 300,
  },
  foodContainerLeft: {
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
  },
  foodContainerRight: {
    borderRadius: 200,
    overflow: 'hidden',
  },
  foodImageWrapper: {
    position: 'absolute',
    top: height / 2 - 190,
    right: -180,
    zIndex: 10,
    marginLeft: 20,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    padding: 5,
    borderWidth: 1,
    borderRadius: 350,
    borderColor: 'rgba(242,242,242,0.1)',
    overflow: 'hidden',
  },
  foodImage: {
    // width: 175,
    // height: 175,
    // borderRadius: 200,

    width: 350,
    height: 350,
    borderRadius: 350,

    // overflow: 'visible',
  },
  toppingList: {
    marginTop: 40,
    zIndex: 100,
    shadowColor: 'rgba(0,0,0,0.5)',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  toppingItem: {
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 20,
    marginLeft: 15,
    overflow: 'visible',
  },
  toppingTitle: {
    fontSize: 19,
    fontWeight: 'bold',
  },
  toppingInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  toppingImage: {
    width: 70,
    height: 70,
    // borderRadius: 60,
    // marginLeft: 20,
  },
  footerWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: width,
    paddingHorizontal: 20,
  },
});
