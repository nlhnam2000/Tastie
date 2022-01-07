import React from 'react';
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Image,
  Dimensions,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import colors from '../colors/colors';

const {width, height} = Dimensions.get('window');
export const Begin = props => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ImageBackground
        source={require('../assets/image/Banner/merchant-ads.png')}
        resizeMode="cover"
        style={styles.bannerImage}>
        <View style={styles.logoWrapper}>
          <Image
            source={require('../assets/image/logo.png')}
            resizeMode="contain"
            style={styles.logo}
          />
        </View>

        <View style={styles.buttonWrapper}>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => props.navigation.navigate('Login')}>
            <Text
              style={{
                color: 'white',
                textAlign: 'center',
                fontWeight: '600',
                fontSize: 16,
              }}>
              Login to Tastie
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.registerButton}
            onPress={() => props.navigation.navigate('Signup')}>
            <Text
              style={{
                color: 'white',
                textAlign: 'center',
                fontWeight: '600',
                fontSize: 16,
              }}>
              Register
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  banner: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerImage: {
    width,
    height,
    paddingHorizontal: 40,
  },
  logoWrapper: {
    position: 'absolute',
    top: '8%',
    left: '4%',
  },
  logo: {
    width: 50,
    height: 50,
  },
  buttonWrapper: {
    position: 'absolute',
    width: width,
    top: '80%',
    bottom: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButton: {
    width: '80%',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: colors.red,
  },
  registerButton: {
    width: '80%',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: colors.primary,
    marginTop: 15,
  },
});
