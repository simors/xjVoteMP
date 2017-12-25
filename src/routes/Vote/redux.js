/**
 * Created by wanpeng on 2017/12/25.
 */
import {Map, List, Record} from 'immutable'
import {createAction} from 'redux-actions'
import {REHYDRATE} from 'redux-persist/constants'
import {call, put, takeEvery, takeLatest, select} from 'redux-saga/effects'
import * as voteCloud from './cloud'


/****  Model  ****/

const VoteState = Record({

}, 'VoteState')
/**** Constant ****/
const GET_VOTE_LIST = 'GET_VOTE_LIST'


/**** Action ****/
export const voteActions = {

}

/**** Saga ****/

export const voteSaga = {

}

/**** Reducer ****/
const initialState = VoteState()

export function voteReducer(state = initialState, action) {
  switch (action.type) {
    case GET_VOTE_LIST:
      return
    default:
      return state
  }
}

/**** Selector ****/
export const voteSelector = {

}





