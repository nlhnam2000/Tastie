import {
  SIGN_IN,
  SIGN_IN_ERROR,
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
  EMAIL_PHONE_EXISTED,
  EMAIL_PHONE_NOT_EXISTED,
  CHECK_EXISTING_EMAIL_PHONE,
  CLEAR_ALERT_MESSAGE,
  ADD_TO_CART,
  REMOVE_CART,
  INCREASE_QUANTITY,
  DECREASE_QUANTITY,
  UPDATE_CART,
  ORDER_CONFIRMED,
  SET_USER_LOCATION,
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
  gender: null,
  registered_at: null,
  last_login_at: null,
  delete_at: null,
  signup_form: 1,
  signup_screen: 'email', // cover => email + phone => verification => name => password
  isLoading: true,
  user_token: null,
  verified_email_token: null,
  triggerAlertMessage: false,
  alertMessage: null,
  currentTab: 'Home',
  userLocation: {
    latitude: 0,
    longitude: 0,
    address: null,
  },
  userCart: {
    provider_id: null,
    provider_name: null,
    date: null,
    cart: [],
    status: null,
    // totalPrice: 0.0,
  },
  /* 
    userCart: {
      provider_id: 100000, 
      provider_name: pizza hut
      cart: [
        {
          product_id: 1,
          productName: itemTitle, 
          productPrice: price, 
          productImage: image, 
          additionalOptions: [

          ], 
          totalProductPrice: 1,
          quantity: 1,
          SpecialInstruction: ''
        }, 
        {
          product_id: 2,
          productName: itemTitle, 
          productPrice: price, 
          productImage: image, 
          additionalOptions: [

          ], 
          totalProductPrice: 1,
          quantity: 1,
          SpecialInstruction: ''
        }
      ], 
      totalPrice: 0,
    }
      
  */
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
    case SIGN_IN_ERROR: {
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
    case UPDATE_PROFILE: {
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
    case EMAIL_PHONE_EXISTED: {
      return {
        ...state,
        ...payload,
      };
    }
    case EMAIL_PHONE_NOT_EXISTED: {
      return {
        ...state,
        ...payload,
      };
    }
    case CLEAR_ALERT_MESSAGE: {
      return {
        ...state,
        ...payload,
      };
    }
    case ADD_TO_CART: {
      return {
        ...state,
        userCart: {
          provider_id: payload.userCart.provider_id,
          provider_name: payload.userCart.provider_name,
          date: payload.userCart.date,
          cart: [...state.userCart.cart, payload.userCart.cartItem],
          status: payload.userCart.status,
        },
      };
    }
    case REMOVE_CART: {
      let copy = {...state};
      let removedPosition = state.userCart.cart.indexOf(payload.cartRemoved);
      copy.userCart.cart.splice(removedPosition, 1);

      // if the cart is empty
      if (copy.userCart.cart.length === 0) {
        return {
          ...state,
          userCart: {
            provider_id: null,
            provider_name: null,
            date: null,
            cart: [],
          },
        };
      }

      return {
        ...state,
        ...copy,
      };
    }
    case INCREASE_QUANTITY: {
      console.log('Increase quantity');
      let prevCart = [...state.userCart.cart];
      let position = state.userCart.cart.indexOf(payload.cart);

      prevCart[position].quantity += 1;
      prevCart[position].totalProductPrice += prevCart[position].productPrice;
      return {
        ...state,
        userCart: {
          ...state.userCart,
          cart: prevCart,
        },
      };
    }
    case DECREASE_QUANTITY: {
      let prevCart = [...state.userCart.cart];
      let position = state.userCart.cart.indexOf(payload.cart);

      prevCart[position].quantity -= 1;
      prevCart[position].totalProductPrice -= prevCart[position].productPrice;
      return {
        ...state,
        userCart: {
          ...state.userCart,
          cart: prevCart,
        },
      };
    }
    case ORDER_CONFIRMED: {
      return {
        ...state,
        userCart: {
          ...state.userCart,
          status: payload.orderStatus,
        },
      };
    }
    case SET_USER_LOCATION: {
      return {
        ...state,
        userLocation: {
          ...state.userLocation,
          ...payload.userLocation,
        },
      };
    }
    default: {
      return state;
    }
  }
};
