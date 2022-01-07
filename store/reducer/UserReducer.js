import {
  SIGN_IN,
  SIGN_OUT,
  RETRIEVE_TOKEN,
  TOKEN_NOT_FOUND,
  SIGN_IN_BY_PHONE,
  ACCOUNT_REGISTRATION,
  EMAIL_VERIFICATION_DONE,
  EMAIL_VERIFICATION_SENDING,
  EMAIL_VERIFICATION_FAILED,
  UPDATE_PROFILE,
  SKIP_UPDATE_PROFILE,
  HOME_TAB,
  ACCOUNT_TAB,
  BROWSE_TAB,
  CART_TAB,
  NOTIFICATION_TAB,
} from '../action/types';

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
  signup_screen: 'cover', // cover => email + phone => verification => name => password
  isLoading: true,
  user_token: null,
  verified_email_token: null,
  alertMessage: null,
  currentTab: 'Home',
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
        ...payload,
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
    case EMAIL_VERIFICATION_FAILED: {
      return {
        ...state,
        ...payload,
      };
    }
    case SKIP_UPDATE_PROFILE: {
      return {
        ...state,
        ...payload,
      };
    }
    // Navigation only
    case HOME_TAB: {
      return {
        ...state,
        ...payload,
      };
    }
    case ACCOUNT_TAB: {
      return {
        ...state,
        ...payload,
      };
    }
    case BROWSE_TAB: {
      return {
        ...state,
        ...payload,
      };
    }
    case NOTIFICATION_TAB: {
      return {
        ...state,
        ...payload,
      };
    }
    case CART_TAB: {
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
