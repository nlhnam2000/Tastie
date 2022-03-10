import {
  ADD_TO_CART,
  REMOVE_CART,
  INCREASE_QUANTITY,
  DECREASE_QUANTITY,
  UPDATE_CART,
  ORDER_CONFIRMED,
} from './types';

export const AddToCart = cartForm => dispatch => {
  dispatch({
    type: ADD_TO_CART,
    payload: {
      userCart: cartForm,
    },
  });
};

export const RemoveCart = cartRemoved => dispatch => {
  // console.log('cartRemoved', cartRemoved.card.additionalOptions);
  dispatch({
    type: REMOVE_CART,
    payload: {
      cartRemoved,
    },
  });
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
