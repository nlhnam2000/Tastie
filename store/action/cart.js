import {
  ADD_TO_CART,
  REMOVE_CART,
  INCREASE_QUANTITY,
  DECREASE_QUANTITY,
  UPDATE_CART,
  ORDER_CONFIRMED,
  SAVE_TO_HISTORY_CART,
  ORDER_COMPLETED,
  RETRIEVE_CART,
  UPDATE_QUANTITY,
  CART_IS_EMPTY,
  CLEAR_CART,
} from './types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {IP_ADDRESS} from '../../global';

export const RetrieveCart = user_id => async dispatch => {
  try {
    let res = await axios.get(`http://${IP_ADDRESS}:3007/v1/api/tastie/tastie/get_cart/${user_id}`);
    if (res.data.response) {
      dispatch({
        type: RETRIEVE_CART,
        payload: {
          userCart: res.data.response,
        },
      });
    } else {
      dispatch({
        type: CART_IS_EMPTY,
        payload: {
          userCart: {
            provider_id: null,
            provider_name: null,
            date: null,
            cart: [],
            status: null,
          },
        },
      });
    }
  } catch (error) {
    console.error(error);
  }
};

export const ClearCart = user_id => async dispatch => {
  try {
    let res = await axios.delete(
      `http://${IP_ADDRESS}:3007/v1/api/tastie/tastie/clear-cart/${user_id}`,
    );
    if (res.data.status) {
      dispatch({
        type: CLEAR_CART,
        payload: {},
      });
    }
  } catch (error) {
    console.error('Cannot clear cart', error);
  }
};

export const AddToCart = cartForm => async dispatch => {
  try {
    await axios.post(`http://${IP_ADDRESS}:3007/v1/api/tastie/tastie/insert_product-into-cart`, {
      user_id: cartForm.user_id,
      product_id: cartForm.cartItem.product_id,
      quantity: cartForm.cartItem.quantity,
      special_instruction: cartForm.cartItem.special_instruction,
      additional_option: [], // edit here when the db is ready
    });
    dispatch({
      type: ADD_TO_CART,
      payload: {
        // status: 'ADDED',
        cartForm: cartForm,
      },
    });
  } catch (error) {
    console.error(error);
  }
};

export const RemoveCart = (user_id, product_id, item_code) => async dispatch => {
  try {
    await axios.post(`http://${IP_ADDRESS}:3007/v1/api/tastie/tastie/delete_cart`, {
      user_id,
      product_id,
      item_code,
    });
    dispatch({
      type: REMOVE_CART,
      payload: {
        item_code,
      },
    });
  } catch (error) {
    console.error(error);
  }
};

export const UpdateQuantity =
  (user_id, product_id, special_instruction, quantity, item_code) => async dispatch => {
    try {
      await axios.post(
        `http://${IP_ADDRESS}:3007/v1/api/tastie/tastie/update-quantity-and-note-into-cart`,
        {
          user_id,
          product_id,
          special_instruction,
          quantity,
          item_code,
        },
      );
      dispatch({
        type: UPDATE_QUANTITY,
        payload: {
          item_code,
          quantity,
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

export const IncreaseQuantity = cart => dispatch => {
  dispatch({
    type: INCREASE_QUANTITY,
    payload: {
      cart,
    },
  });
};

export const DecreaseQuantity = cart => dispatch => {
  dispatch({
    type: DECREASE_QUANTITY,
    payload: {
      cart,
    },
  });
};

export const SubmitOrder = () => dispatch => {
  dispatch({
    type: ORDER_CONFIRMED,
    payload: {
      orderStatus: 'order_confirmed',
    },
  });
};

export const OrderCompleted = () => dispatch => {
  dispatch({
    type: ORDER_COMPLETED,
    payload: {
      // orderStatus: 'order_completed'
    },
  });
};

export const SaveToHistoryCart = cart => async dispatch => {
  // When the order is completed, save this to history then clear the userCart
  // use AsyncStorage to store the history (call API when DB is ready)
  // let _orderHistory = await AsyncStorage.getItem('@orderHistory');
  // if (_orderHistory) {
  //   _orderHistory.push(cart)
  // }
  dispatch({
    type: SAVE_TO_HISTORY_CART,
    payload: {
      cart,
    },
  });
};
