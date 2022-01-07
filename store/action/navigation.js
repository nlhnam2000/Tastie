import * as types from './types';

export const NavigateToAccount = () => dispatch => {
  dispatch({
    type: types.ACCOUNT_TAB,
    payload: {
      currentTab: 'Account',
    },
  });
};

export const NavigateToHome = () => dispatch => {
  dispatch({
    type: types.HOME_TAB,
    payload: {
      currentTab: 'Home',
    },
  });
};

export const NavigateToBrowse = () => dispatch => {
  dispatch({
    type: types.BROWSE_TAB,
    payload: {
      currentTab: 'Browse',
    },
  });
};

export const NavigateToNotification = () => dispatch => {
  dispatch({
    type: types.NOTIFICATION_TAB,
    payload: {
      currentTab: 'Notification',
    },
  });
};

export const NavigateToCart = () => dispatch => {
  dispatch({
    type: types.CART_TAB,
    payload: {
      currentTab: 'Cart',
    },
  });
};
