/**
 * Created by wanpeng on 2017/12/25.
 */
import {Map, List, Record} from 'immutable'
import {createAction} from 'redux-actions'
import {REHYDRATE} from 'redux-persist/constants'
import {call, put, takeEvery, takeLatest, select} from 'redux-saga/effects'
import * as meCloud from './cloud'


/****  Model  ****/

const MeState = Record({

}, 'MeState')
/**** Constant ****/
const GET_PAYMENT_INFO = 'GET_PAYMENT_INFO'


/**** Action ****/
export const meActions = {

}

/**** Saga ****/

export const meSaga = {

}

/**** Reducer ****/
const initialState = MeState()

export function meReducer(state = initialState, action) {
  switch (action.type) {
    case GET_PAYMENT_INFO:
      return
    default:
      return state
  }
}

/**** Selector ****/
export const meSelector = {

}





