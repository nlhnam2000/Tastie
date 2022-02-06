import {ADD_TO_CART, REMOVE_CART} from './types';
import {useSelector} from 'react-redux';

export const AddToCart = cartForm => dispatch => {
  // const previousUserCart = useSelector(state => state.UserReducer.userCart);
  dispatch({
    type: ADD_TO_CART,
    payload: {
      userCart: cartForm,
    },
  });
};
