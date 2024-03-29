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
  RE_ORDER,
} from './types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {IP_ADDRESS} from '../../global';

export const RetrieveCart = user_id => async dispatch => {
  try {
    let res = await axios.get(`https://${IP_ADDRESS}/v1/api/tastie/tastie/get_cart/${user_id}`);
    if (res.data.response) {
      dispatch({
        type: RETRIEVE_CART,
        payload: {
          userCart: res.data.response,
        },
      });
      // console.log(res.data.response);
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
            location: {},
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
      `https://${IP_ADDRESS}/v1/api/tastie/tastie/clear-cart/${user_id}`,
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
    await axios.post(`https://${IP_ADDRESS}/v1/api/tastie/tastie/insert_product-into-cart`, {
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
    await axios.post(`https://${IP_ADDRESS}/v1/api/tastie/tastie/delete_cart`, {
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
        `https://${IP_ADDRESS}/v1/api/tastie/tastie/update-quantity-and-note-into-cart`,
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

export const SubmitOrder = order_code => dispatch => {
  dispatch({
    type: ORDER_CONFIRMED,
    payload: {
      orderStatus: 'order_confirmed',
      room: order_code,
    },
  });
};

export const OrderCompleted = order_code => dispatch => {
  dispatch({
    type: ORDER_COMPLETED,
    payload: {
      // orderStatus: 'order_completed'
      room: order_code,
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

export const ReOrder = (order_code, user_id) => async dispatch => {
  try {
    let fecthProductsFromOder = await axios.get(
      `https://${IP_ADDRESS}/v1/api/tastie/order/get-all-products-from-order/${order_code}`,
    );

    if (fecthProductsFromOder.data.status) {
      const insertProductToCart = async product => {
        const res = await axios.post(
          `https://${IP_ADDRESS}/v1/api/tastie/tastie/insert_product-into-cart`,
          {
            user_id: user_id,
            product_id: product.product_id,
            quantity: product.quantity,
            special_instruction: product.special_instruction,
            additional_option: [],
          },
        );

        return res.data;
      };
      const queryList = [];
      fecthProductsFromOder.response.items.forEach(item => {
        queryList.push(insertProductToCart(item));
      });

      Promise.all(queryList)
        .then(values => {
          console.log(values);
          dispatch({
            type: RE_ORDER,
          });
        })
        .catch(error => console.log(error));
    }
  } catch (error) {
    console.error('cannot re-order', error);
  }
};
