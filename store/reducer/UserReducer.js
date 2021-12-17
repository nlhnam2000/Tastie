import {
  SIGN_IN,
  SIGN_OUT,
  RETRIEVE_TOKEN,
  TOKEN_NOT_FOUND,
  SIGN_IN_BY_PHONE,
  ACCOUNT_REGISTRATION,
  EMAIL_VERIFICATION_DONE,
  EMAIL_VERIFICATION_SENDING,
  UPDATE_PROFILE,
  SKIP_UPDATE_PROFILE,
} from '../action/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
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
  isLoading: true,
  token: null,
  verified_email_token: null,
};

export const UserReducer = (state = initialState, action) => {
  const {type, payload} = action;
  switch (type) {
    case SIGN_IN_BY_PHONE: {
      return {
        ...state,
        phone: payload.phone,
        token: payload.token,
        isLoading: false,
      };
    }
    case SIGN_IN: {
      return {
        ...state,
        ...payload,
      };
    }
    case SIGN_OUT: {
      return {
        ...state,
        phone: null,
        token: null,
      };
    }
    case RETRIEVE_TOKEN: {
      return {
        ...state,
        ...payload,
      };
    }
    case TOKEN_NOT_FOUND: {
      return {
        ...state,
        ...payload,
      };
    }
    case ACCOUNT_REGISTRATION: {
      return {
        ...state,
        ...payload,
        signup_form: 2,
      };
    }
    case EMAIL_VERIFICATION_SENDING: {
      return {
        ...state,
        ...payload,
      };
    }
    case EMAIL_VERIFICATION_DONE: {
      return {
        ...state,
        ...payload,
        signup_form: 3,
      };
    }
    case SKIP_UPDATE_PROFILE: {
      return {
        ...state,
        ...payload,
      };
    }
    default: {
      return state;
    }
  }
};

// export const UserRegistration = (state = initialState, action) => {
//   const {type, payload} = action;
//   switch (type) {
//     case EMAIL_VERIFICATION: {
//       return {
//         ...state,
//         ...payload,
//         signup_form: 3,
//       };
//     }
//     default: {
//       return state;
//     }
//   }
// };
