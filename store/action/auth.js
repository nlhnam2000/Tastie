import axios from 'axios';
import {
  SIGN_IN,
  SIGN_OUT,
  RETRIEVE_TOKEN,
  TOKEN_NOT_FOUND,
  SIGN_IN_BY_PHONE,
  ACCOUNT_REGISTRATION,
  EMAIL_VERIFICATION_SENDING,
  EMAIL_VERIFICATION_DONE,
  UPDATE_PROFILE,
  SKIP_UPDATE_PROFILE,
  CHECK_EXISTING_EMAIL_PHONE,
  EMAIL_PHONE_EXISTED,
  EMAIL_PHONE_NOT_EXISTED,
  SIGN_IN_ERROR,
  CLEAR_ALERT_MESSAGE,
  EMAIL_VERIFICATION_FAILED,
  SET_USER_LOCATION,
} from './types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {IP_ADDRESS} from '../../global';

// const validateEmailOrPhone = () => {};

export const clearAlertMessage = () => dispatch => {
  dispatch({
    type: CLEAR_ALERT_MESSAGE,
    payload: {
      isLoading: false,
      triggerAlertMessage: false,
      alertMessage: null,
    },
  });
};

export const signinWithPhone = (phone, otp) => async dispatch => {
  try {
    let res = await axios.post(`http://${IP_ADDRESS}:3007/v1/api/auth/login-with-otp`, {
      phone: phone,
      otp: otp,
    });
    await AsyncStorage.setItem('user_token', res.data.token);
    let token = await AsyncStorage.getItem('user_token');
    dispatch({
      type: SIGN_IN_BY_PHONE,
      payload: {
        phone: phone,
        token: token,
        alertMessage: null,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

export const signin = (phone, password) => async dispatch => {
  try {
    let res = await axios.post(`http://${IP_ADDRESS}:3007/v1/api/auth/sign-in`, {
      phone: phone,
      password: password,
    });
    // console.log('sign in');
    if (res.data.loginState === true) {
      let token = res.data.refreshToken;
      let data = res.data.profile;
      console.log(data);
      console.log('refresh token', res.data.refreshToken);
      await AsyncStorage.setItem('user_token', token);
      dispatch({
        type: SIGN_IN,
        payload: {
          user_id: data.user_id,
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          phone: data.phone,
          role: data.role,
          gender: data.gender,
          birthday: data.birthday,
          registered_at: data.registered_at,
          last_login_at: data.last_login_at,
          delete_at: data.delete_at,
          user_token: token,
          isLoading: false,
        },
      });
    } else {
      console.log('error');
      dispatch({
        type: SIGN_IN_ERROR,
        payload: {
          triggerAlertMessage: true,
          alertMessage: res.data.err.message,
          isLoading: false,
        },
      });
    }
  } catch (error) {
    console.error(error);
  }
};

export const signout = () => async dispatch => {
  try {
    await AsyncStorage.removeItem('user_token');
    dispatch({
      type: SIGN_OUT,
      payload: {
        user_id: null,
        first_name: null,
        last_name: null,
        email: null,
        phone: null,
        role: null,
        gender: null,
        birthday: null,
        registered_at: null,
        last_login_at: null,
        delete_at: null,
        signup_form: 1,
        isLoading: false,
        user_token: null,
        currentTab: 'Home',
        userLocation: {
          latitude: 0,
          longitude: 0,
          address: null,
        },
        provider_id: null,
        provider_name: null,
        date: null,
        cart: [],
        status: null,
      },
    });
  } catch (error) {
    console.warn(error);
  }
};

export const retrieveToken = token => async dispatch => {
  try {
    let res = await axios.post(`http://${IP_ADDRESS}:3007/v1/api/auth/get_profile`, {
      accessToken: token,
    });
    if (res.data.status === true) {
      await AsyncStorage.setItem('user_token', res.data.profile.user_token);
      dispatch({
        type: RETRIEVE_TOKEN,
        payload: {
          user_id: res.data.profile.user_id,
          first_name: res.data.profile.first_name,
          last_name: res.data.profile.last_name,
          email: res.data.profile.email,
          phone: res.data.profile.phone,
          role: res.data.profile.role,
          gender: res.data.profile.gender,
          birthday: res.data.profile.birthday,
          registered_at: res.data.profile.registered_at,
          last_login_at: res.data.profile.last_login_at,
          delete_at: res.data.profile.delete_at,
          isLoading: false,
          user_token: res.data.profile.user_token,
        },
      });
    } else {
      alert('retrieve token error');
    }
  } catch (error) {
    // console.log(error);
    await AsyncStorage.removeItem('user_token');
    dispatch({
      type: TOKEN_NOT_FOUND,
      payload: {
        isLoading: false,
        user_token: null,
        triggerAlertMessage: true,
        alertMessage: 'Ooops look like you are logging on another device',
      },
    });
  }
};

export const TokenNotFound = () => dispatch => {
  dispatch({
    type: TOKEN_NOT_FOUND,
    payload: {
      isLoading: false,
      user_token: null,
    },
  });
};

export const CheckExistingEmail = (phone, email) => async dispatch => {
  try {
    let res = await axios.post(
      `http://${IP_ADDRESS}:3007/v1/api/auth/check-exist-email-and-phone`,
      {
        phone,
        email,
      },
    );
    if (res.data.isPhoneDuplicated === true && res.data.isEmailDuplicated === true) {
      dispatch({
        type: EMAIL_PHONE_EXISTED,
        payload: {
          signup_screen: 'Login',
        },
      });
    }
    if (res.data.isPhoneDuplicated === false || res.data.isEmailDuplicated === false) {
      dispatch({
        type: EMAIL_PHONE_NOT_EXISTED,
        payload: {
          signup_screen: 'EmailVerification',
        },
      });
    }
  } catch (error) {}
};

export const AccountRegistration = body => dispatch => {
  dispatch({
    type: ACCOUNT_REGISTRATION,
    payload: {
      email: body.email,
      password: body.password1,
      phone: body.phone,
      first_name: body.firstname,
      last_name: body.lastname,
      role: 'C',
      registered_at: new Date().toISOString().substring(0, 10),
    },
  });
};

export const SendOTP = email => async dispatch => {
  try {
    let res = await axios.post(`http://${IP_ADDRESS}:3007/v1/api/auth/send-code-with-email`, {
      email: email,
    });
    if (res.data.status === true) {
      // await AsyncStorage.removeItem('verified_email_token');
      console.log('Email token ', res.data.result.verifyEmailToken);
      dispatch({
        type: EMAIL_VERIFICATION_SENDING,
        payload: {
          verified_email_token: res.data.result.verifyEmailToken,
        },
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export const EmailVerification = (emailToken, otp, email) => async dispatch => {
  try {
    let res = await axios.post(`http://${IP_ADDRESS}:3007/v1/api/auth/verify-code-with-email`, {
      verifyEmailToken: emailToken,
      code: otp,
      email: email,
    });
    if (res.data.status === true) {
      dispatch({
        type: EMAIL_VERIFICATION_DONE,
        payload: {
          signup_form: 3,
        },
      });
    } else {
      dispatch({
        type: EMAIL_VERIFICATION_FAILED,
        payload: {
          isLoading: false,
          triggerAlertMessage: true,
          alertMessage: 'OTP code is incorrect',
        },
      });
    }
  } catch (error) {
    alert('OTP Code is incorrect');
  }
};

export const SkipUpdate = body => async dispatch => {
  // SKIP UPDATE ==> signup then navigate to the HomeScreen
  try {
    let res = await axios.post(`http://${IP_ADDRESS}:3007/v1/api/auth/sign-up`, {
      email: body.email,
      password: body.password,
      phone: body.phone,
      first_name: body.firstname,
      last_name: body.lastname,
      role: 1,
      gender: 1,
      registered_at: new Date().toISOString().substring(0, 10),
    });
    if (res.data.registerState === true) {
      let data = res.data.profile;
      let token = res.data.refreshtoken;
      await AsyncStorage.setItem('user_token', token);
      dispatch({
        type: SKIP_UPDATE_PROFILE,
        payload: {
          user_id: data.user_id,
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          phone: data.phone,
          role: data.role,
          gender: data.gender,
          birthday: data.birthday,
          registered_at: data.registered_at,
          last_login_at: data.last_login_at,
          delete_at: data.delete_at,
          user_token: token,
          isLoading: false,
        },
      });
    }
  } catch (error) {
    console.error(error);
  }
};

export const UpdateProfile = body => async dispatch => {
  try {
    let res = await axios.post(`http://${IP_ADDRESS}:3007/v1/api/auth/update`, body);
    if (res.data.message === 'Update successfully') {
      if (res.data.refreshToken !== null) {
        await AsyncStorage.setItem('user_token', res.data.refreshToken); // set new refresh token when update email or phone
        dispatch({
          type: UPDATE_PROFILE,
          payload: {
            triggerAlertMessage: true,
            alertMessage: res.data.message,
            isLoading: false,
            user_token: res.data.refreshToken,
            // currentTab: 'Account',
          },
        });
      } else {
        dispatch({
          type: UPDATE_PROFILE,
          payload: {
            triggerAlertMessage: true,
            alertMessage: res.data.message,
            isLoading: false,
            // currentTab: 'Account',
          },
        });
      }
    } else {
      alert(res.data.message);
    }
  } catch (error) {
    console.error(error);
  }
};

export const SetUserLocation = data => async dispatch => {
  await AsyncStorage.setItem('@userLocation', JSON.stringify(data));
  dispatch({
    type: SET_USER_LOCATION,
    payload: {
      userLocation: {
        latitude: data.latitude,
        longitude: data.longitude,
        address: data.address,
      },
    },
  });
};
