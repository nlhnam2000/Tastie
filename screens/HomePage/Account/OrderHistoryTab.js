import React from 'react';
import {View, Text, StyleSheet, SafeAreaView} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import colors from '../../../colors/colors';
import {Header} from '../../../components/Layout/Header/Header';
import {OrderHistory} from './OrderHistory';

const Tab = createMaterialTopTabNavigator();

const OnGoing = () => {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, {marginTop: insets.top}]}>
      <Text>Ongoing</Text>
    </View>
  );
};

const Completed = () => {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, {marginTop: insets.top}]}>
      <Text>Completed</Text>
    </View>
  );
};

const ToRate = () => {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, {marginTop: insets.top}]}>
      <Text>To Rate</Text>
    </View>
  );
};

export const OrderHistoryTab = props => {
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <Header title="My Order" goBack {...props} style={{backgroundColor: 'white'}} />
      <Tab.Navigator
        initialRouteName="OnGoing"
        screenOptions={{
          tabBarPressColor: 'white',
          // tabBarActiveTintColor: colors.boldred,
          tabBarIndicatorStyle: {backgroundColor: colors.boldred},
          tabBarLabelStyle: {fontWeight: '600'},
        }}>
        <Tab.Screen
          name="On Going"
          children={() => <OrderHistory filterStatus={'Ongoing'} {...props} />}
        />
        <Tab.Screen
          name="History"
          children={() => <OrderHistory filterStatus={'History'} {...props} />}
        />
        <Tab.Screen
          name="To Rate"
          children={() => <OrderHistory filterStatus={'ToRate'} {...props} />}
        />
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
