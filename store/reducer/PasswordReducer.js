import {RESET_PASSWORD} from '../action/types';
import axios from 'axios';

const initialState = {
  password: null,
};

export const PasswordReducer = (state = initialState, action) => {
  const {type, payload} = action;
  switch (type) {
    case RESET_PASSWORD: {
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
