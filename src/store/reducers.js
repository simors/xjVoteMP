import { combineReducers } from 'redux'
import { routerReducer} from 'react-router-redux'
import {authReducer} from '../utils/auth'
import {appStateReducer} from '../utils/appstate'

export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    AUTH: authReducer,
    router: routerReducer,
    APPSTATE: appStateReducer,
    ...asyncReducers
  })
}

export const injectReducer = (store, { key, reducer }) => {
  if (Object.hasOwnProperty.call(store.asyncReducers, key)) return

  store.asyncReducers[key] = reducer
  store.replaceReducer(makeRootReducer(store.asyncReducers))
}

export default makeRootReducer
