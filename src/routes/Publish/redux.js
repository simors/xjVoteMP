/**
 * Created by wanpeng on 2017/12/29.
 */
import {Map, List, Record} from 'immutable'
import {createAction} from 'redux-actions'
import {REHYDRATE} from 'redux-persist/constants'
import {call, put, takeEvery, takeLatest, select} from 'redux-saga/effects'

/****  Model  ****/
const PublishVoteRecord = Record({
  id: undefined,
  title: undefined,
  cover: undefined,
  notice:  undefined,
  rule: undefined,
  organizer: undefined,
  awards: undefined,
  gifts: undefined,
  startDate: undefined,
  expire: undefined,
  status: undefined,
}, 'PublishVoteRecord')

// class PublishVote extends PublishVoteRecord {
//   static fromJson(lcObj) {
//     try {
//       let publishVote = new PublishVoteRecord()
//       return publishVote.withMutations((record) => {
//         record.set('id', lcObj.id)
//         record.set('title', lcObj.title)
//         record.set('title', lcObj.title)
//       })
//     } catch (e) {
//       throw e
//     }
//   }
// }

const PublishVoteState = Record({
  publishingVote: PublishVoteRecord(),
}, 'PublishVoteState')
/**** Constant ****/
const UPDATE_PUBLISHING_VOTE = 'UPDATE_PUBLISHING_VOTE'
const UPDATE_PUBLISHING_VOTE_STATE = 'UPDATE_PUBLISHING_VOTE_STATE'
const CREATE_VOTE = 'CREATE_VOTE'
const CLEAR_PUBLISHING_VOTE_STATE = 'CLEAR_PUBLISHING_VOTE_STATE'

/**** Action ****/
export const publishAction = {
  updatePublishingVoteAction: createAction(UPDATE_PUBLISHING_VOTE),
  createVoteAction: createAction(CREATE_VOTE),
}

/**** Saga ****/
function* updatePublishingVote(action) {

}

export const publishSaga = [
  takeLatest(UPDATE_PUBLISHING_VOTE, updatePublishingVote),
]

/**** Reducer ****/
const initialState = PublishVoteState()
export function publishReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_PUBLISHING_VOTE_STATE:
      return handleUpdatePubVoteState(state, action)
    case CLEAR_PUBLISHING_VOTE_STATE:
      return handleClearPubVoteState(state, action)
    case REHYDRATE:
      return onRehydrate(state, action)
    default:
      return state
  }
}

function handleUpdatePubVoteState(state, action) {
  return state
}

function handleClearPubVoteState(state, action) {
  return state
}

function onRehydrate(state, action) {
  var incoming = action.payload.PUBLISH
  if (!incoming) return state

  return state
}

/**** Selector ****/

export const publishSelector = {

}

