/**
 * @format
 */
import React from 'react';
import {AppRegistry, Platform} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {Provider} from 'react-redux';
import {store} from './store/store';
import PushNotification from 'react-native-push-notification';

PushNotification.configure({
  onNotification: function (notification) {
    console.log('NOTIFICATION:', notification);

    // process the notification
  },
  requestPermissions: Platform.OS === 'ios',
});

const RootScreen = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

AppRegistry.registerComponent(appName, () => RootScreen);
