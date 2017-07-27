//import { combineReducers } from 'redux'
//import { routerReducer as routing } from 'react-router-redux'
import Immutable from 'immutable'
import { combineReducers } from 'redux-immutablejs';
import routing from './reducers/router';

const reducers = combineReducers({
  routing
})

export default reducers
