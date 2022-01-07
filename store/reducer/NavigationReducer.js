import * as types from '../action/types';

const initialState = {
  currentTab: 'Home',
};

export const NavigationReducer = (state = initialState, action) => {
  const {type, payload} = action;
  switch (type) {
    case types.HOME_TAB: {
      return {
        ...state,
        ...payload,
      };
    }
    case types.ACCOUNT_TAB: {
      return {
        ...state,
        ...payload,
      };
    }
    case types.BROWSE_TAB: {
      return {
        ...state,
        ...payload,
      };
    }
    case types.NOTIFICATION_TAB: {
      return {
        ...state,
        ...payload,
      };
    }
    case types.CART_TAB: {
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
