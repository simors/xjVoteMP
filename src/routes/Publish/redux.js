/**
 * Created by wanpeng on 2017/12/29.
 */
import {Map, List, Record} from 'immutable'
import {createAction} from 'redux-actions'
import {REHYDRATE} from 'redux-persist/constants'
import {call, put, takeEvery, takeLatest, select} from 'redux-saga/effects'
import * as publishCloud from './cloud'

/****  Model  ****/
const PublishVoteRecord = Record({
  id: undefined,
  type: undefined,
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
  endDate: undefined,
  createdAt: undefined,
  updatedAt: undefined,
}, 'PublishVoteRecord')

class PublishVote extends PublishVoteRecord {
  static fromJson(lcObj) {
    try {
      let publishVote = new PublishVoteRecord()
      return publishVote.withMutations((record) => {
        record.set('id', lcObj.objectId)
        record.set('type', lcObj.type)
        record.set('title', lcObj.title)
        record.set('cover', lcObj.cover)
        record.set('notice', lcObj.notice)
        record.set('rule', lcObj.rule)
        record.set('organizer', lcObj.organizer)
        record.set('awards', lcObj.awards)
        record.set('gifts', lcObj.gifts)
        record.set('startDate', lcObj.startDate)
        record.set('expire', lcObj.expire)
        record.set('status', lcObj.status)
        record.set('endDate', lcObj.endDate)
        record.set('createdAt', lcObj.createdAt)
        record.set('updatedAt', lcObj.updatedAt)
      })
    } catch (e) {
      throw e
    }
  }

  static fromVote(vote) {
    try {
      let publishVote = new PublishVoteRecord()
      return publishVote.withMutations((record) => {
        record.set('id', vote.id)
        record.set('type', vote.type)
        record.set('title', vote.title)
        record.set('cover', vote.cover)
        record.set('notice', vote.notice)
        record.set('rule', vote.rule)
        record.set('organizer', vote.organizer)
        record.set('awards', vote.awards)
        record.set('gifts', vote.gifts)
        record.set('startDate', vote.startDate)
        record.set('expire', vote.expire)
        record.set('status', vote.status)
        record.set('endDate', vote.endDate)
        record.set('createdAt', vote.createdAt)
        record.set('updatedAt', vote.updatedAt)
      })
    } catch (e) {
      throw e
    }
  }
}

const PublishVoteState = Record({
  publishingVote: undefined,
}, 'PublishVoteState')

/**** Constant ****/
const CREATE_OR_UPDATE_PUBLISHING_VOTE = 'CREATE_OR_UPDATE_PUBLISHING_VOTE'
const UPDATE_PUBLISHING_VOTE_STATE = 'UPDATE_PUBLISHING_VOTE_STATE'
const CLEAR_PUBLISHING_VOTE_STATE = 'CLEAR_PUBLISHING_VOTE_STATE'
const FETCH_CREATE_VOTE_PWD = 'FETCH_CREATE_VOTE_PWD'
const SAVE_PUBLISHING_VOTE = 'SAVE_PUBLISHING_VOTE'

/**** Action ****/
export const publishAction = {
  createOrUpdatePublishingVoteAction: createAction(CREATE_OR_UPDATE_PUBLISHING_VOTE),
  fetchCreateVotePwdAction: createAction(FETCH_CREATE_VOTE_PWD),
  clearPublishingVoteAction: createAction(CLEAR_PUBLISHING_VOTE_STATE),
  savePublishingVoteAction: createAction(SAVE_PUBLISHING_VOTE),
}

const updatePublishingVoteState = createAction(UPDATE_PUBLISHING_VOTE_STATE)

/**** Saga ****/
function* createOrUpdatePublishingVote(action) {
  let payload = action.payload

  let apiPayload = {
    id: payload.id,
    type: payload.type,
    title: payload.title,
    cover: payload.cover,
    notice: payload.notice,
    rule: payload.rule,
    organizer: payload.organizer,
    awards: payload.awards,
    gifts: payload.gifts,
    startDate: payload.startDate,
    expire: payload.expire,
    status: payload.status,
    endDate: payload.endDate,
  }

  try {
    let publishVote = yield call(publishCloud.createOrUpdateVote, apiPayload)

    yield put(updatePublishingVoteState({publishVote: publishVote}))

    if(payload.success) {
      payload.success()
    }
  } catch (error) {
    console.error(error)
    if(payload.error) {
      payload.error(error)
    }
  }
}

function* fetchCreateVotePwd(action) {
  let payload = action.payload

  try {
    let password = yield call(publishCloud.fetchCreateVotePwd, {})

    if(payload.success) {
      payload.success(password)
    }
  } catch (error) {
    console.error(error)
    if(payload.error) {
      payload.error(error)
    }
  }
}

export const publishSaga = [
  takeLatest(CREATE_OR_UPDATE_PUBLISHING_VOTE, createOrUpdatePublishingVote),
  takeLatest(FETCH_CREATE_VOTE_PWD, fetchCreateVotePwd),
]

/**** Reducer ****/
const initialState = PublishVoteState()
export function publishReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_PUBLISHING_VOTE_STATE:
      return handleUpdatePubVoteState(state, action)
    case CLEAR_PUBLISHING_VOTE_STATE:
      return handleClearPubVoteState(state, action)
    case SAVE_PUBLISHING_VOTE:
      return handleSavePublishingVoteState(state, action)
    case REHYDRATE:
      return onRehydrate(state, action)
    default:
      return state
  }
}

function handleUpdatePubVoteState(state, action) {
  let publishVote = action.payload.publishVote
  let publishVoteRecord = PublishVote.fromJson(publishVote)
  state = state.set('publishingVote', publishVoteRecord)
  return state
}

function handleClearPubVoteState(state, action) {
  state = state.set('publishingVote', undefined)
  return state
}

function handleSavePublishingVoteState(state, action) {
  let vote = action.payload.vote
  let publishVoteRecord = PublishVote.fromVote(vote)
  state = state.set('publishingVote', publishVoteRecord)
  return state
}

function onRehydrate(state, action) {
  var incoming = action.payload.PUBLISH
  if (!incoming) return state

  return state
}

/**** Selector ****/
function selectPublishVote(state) {
  let publishRecord = state.PUBLISH.get('publishingVote')
  return publishRecord? publishRecord.toJS() : undefined
}

export const publishSelector = {
  selectPublishVote,
}

