import {createStore, combineReducers, applyMiddleware} from 'redux';
import {UserReducer} from './reducer/UserReducer';
import {NavigationReducer} from './reducer/NavigationReducer';
import {composeWithDevTools} from 'redux-devtools-extension';
import thunk from 'redux-thunk';

const rootReducer = combineReducers({UserReducer});
const composedEnhancer = composeWithDevTools(applyMiddleware(thunk));
export const store = createStore(rootReducer, {}, composedEnhancer);
