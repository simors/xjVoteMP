/**
 * Created by yangyang on 2017/6/28.
 */
import {persistStore} from 'redux-persist'
import createFilter from 'redux-persist-transform-filter'
import immutableTransform from 'redux-persist-transform-immutable'
import createStore from './createStore'
import {authSelector} from '../utils/auth'
import {rehydrateDone} from '../utils/rehydrateRedux'
import {appStateAction} from '../utils/appstate'

const configFilter = createFilter('CONFIG', [])

export default function persist(store) {
  return persistStore(store, {
    whitelist: ['APPSTATE', 'AUTH', 'ME', 'VOTE', 'PUBLISH'],
    // transforms: [configFilter]
  }, () => {
    // TODO: add function after rehydration is finished
    let state = store.getState()
    let token = authSelector.selectToken(state)
    if(token) {
      store.dispatch(rehydrateDone({token, rehydrated: true}))
    } else {
      store.dispatch(appStateAction.updateRehydrate({rehydrated: true}))
    }
  })
}

export const store = createStore(window.__INITIAL_STATE__)
export const persistor = persist(store)
