# Tastie (Mobile Platform)

## 1. Required tools: 
- This project require react-native command, not expo. 
- For Android Simulator, Android Studio is required and Xcode for IOS Simulator

## 2. Setup Environnment: 
Visit here: https://reactnative.dev/docs/environment-setup
> Note: This project use Android 10, remember to install Android 10 ( just in case the Android 10 checkbox is uncheck :P )
### **Android:**
- Open directory Tastie/android/app in Android Studio, wait for the building progress finish (see the loading bar at the bottom right corner)
- Tools -> AVD Manager -> create virtual device -> configure a device you want -> show advance setting -> set RAM to about 12GB -> Finish
- You will see the list of avaible simulator, choose a device by clicking the Play button
- Go to Tastie/global.js -> change the `IP_ADDRESS` as your Wifi IP Address
- Open Terminal, cd Tastie/, run `react-native run-android` command to run the android simulator
### **IOS:**
- Open Terminal, cd Tastie/, run `react-native run-ios` command to run the ios simulator
