import {ADD_TO_CART, REMOVE_CART} from './types';

export const AddToCart = cartForm => dispatch => {
  // const previousUserCart = useSelector(state => state.UserReducer.userCart);
  dispatch({
    type: ADD_TO_CART,
    payload: {
      userCart: cartForm,
    },
  });
};

export const RemoveCart = cartRemoved => dispatch => {
  dispatch({
    type: REMOVE_CART,
    payload: {
      cartRemoved,
    },
  });
};
