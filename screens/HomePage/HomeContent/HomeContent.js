import React, {useState, useEffect, useRef} from 'react';
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
  Platform,
  ActivityIndicator,
  Modal,
  Switch,
  TouchableWithoutFeedback,
  RefreshControl,
  NativeModules,
} from 'react-native';
import colors from '../../../colors/colors';
import {useDispatch, useSelector} from 'react-redux';
import {DeliveryTab} from '../../../components/Home/DeliveryTab';
import {PickupTab} from '../../../components/Home/PickupTab';
import PushNotification from 'react-native-push-notification';

const {width} = Dimensions.get('window');

export const HomeContent = props => {
  const headerTab = ['Delivery', 'Pickup'];
  const [selectedTab, setSelectedTab] = useState(headerTab[0]);
  const [loading, setLoading] = useState(true);
  const state = useSelector(state => state.UserReducer);

  const createChannel = () => {
    PushNotification.createChannel({
      channelId: 'homescreen-channel',
      channelName: 'HomeScreen Channel',
    });
  };

  useEffect(() => {
    console.log(state.userLocation);
    // createChannel();
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <View style={styles.content}>
        <StatusBar barStyle="dark-content" />
        <ActivityIndicator size={'large'} color={colors.red} />
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.headerWrapper}>
          <View style={[styles.tabWrapper, {}]}>
            {headerTab.map((tab, index) => {
              return (
                <TouchableOpacity
                  onPress={() => setSelectedTab(tab)}
                  style={tab === selectedTab ? styles.tabButtonClicked : styles.tabButton}
                  key={index}>
                  <Text
                    style={
                      tab === selectedTab ? styles.labelTabButtonClicked : styles.labelTabButton
                    }>
                    {tab}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
        {selectedTab === 'Delivery' ? <DeliveryTab {...props} /> : <PickupTab {...props} />}
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    flex: 1,
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    flex: 1,
  },
  headerWrapper: {
    marginTop: Platform.OS === 'ios' ? 40 : 0,
    paddingHorizontal: 20,
  },
  tabWrapper: {
    flexDirection: 'row',
    width: Dimensions.get('screen').width,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  tabButton: {
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginLeft: 10,
  },
  tabButtonClicked: {
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginLeft: 10,
    backgroundColor: 'black',
  },
  labelTabButton: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
  },
  labelTabButtonClicked: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'white',
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f2f2f2',
    width: '90%',
    paddingVertical: Platform.OS === 'ios' ? 10 : 0,
    paddingHorizontal: 8,
    borderRadius: 25,
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 25,
  },
  categoryWrapper: {
    backgroundColor: 'white',
    height: 100,
    marginTop: 20,
    width: '100%',
  },
  categoryItem: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryImage: {
    width: 80,
    height: 80,
  },
  categoryTitle: {
    fontWeight: 'bold',
  },
  contentWrapper: {
    backgroundColor: '#e6e6e6',
    marginTop: 20,
  },
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
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    // backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalView: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderWidth: 1,
    borderColor: colors.secondary,
    width,
    height: '90%',
    overflow: 'hidden',
  },
  map: {
    width: '100%',
    height: 200,
  },
  modalHeader: {
    padding: 10,
  },
  providerName: {
    padding: 15,
    width: '100%',
  },
  sectionWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 15,
  },
  flexRowBetween: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
});
