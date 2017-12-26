/**
 * Created by wanpeng on 2017/12/25.
 */
import {Map, List, Record} from 'immutable'
import {createAction} from 'redux-actions'
import {REHYDRATE} from 'redux-persist/constants'
import {call, put, takeEvery, takeLatest, select} from 'redux-saga/effects'
import * as voteCloud from './cloud'
import {authAction, authSelector} from '../../utils/auth'

/****  Model  ****/
const VoteRecord =  Record({
  id: undefined,
  createdAt: undefined,
  updatedAt: undefined,
  creatorId: undefined,
  enable: undefined,
  voteNum: undefined,
  profit: undefined,
  startDate: undefined,
  cover: undefined,
  expire: undefined,
  title: undefined,
  gifts: undefined,
  status: undefined,
  pv: undefined,
  notice: undefined,
  applyNum: undefined,
  awards: undefined,
  organizer: undefined,
}, 'VoteRecord')

class Vote extends VoteRecord {
  static fromJson(lcObj) {
    try {
      let vote = new VoteRecord()
      return vote.withMutations((record) => {
        record.set('id', lcObj.id)
        record.set('createdAt', lcObj.createdAt)
        record.set('updatedAt', lcObj.updatedAt)
        record.set('creatorId', lcObj.creatorId)
        record.set('enable', lcObj.enable)
        record.set('voteNum', lcObj.voteNum)
        record.set('profit', lcObj.profit)
        record.set('startDate', lcObj.startDate)
        record.set('cover', lcObj.cover)
        record.set('expire', lcObj.expire)
        record.set('title', lcObj.title)
        record.set('gifts', lcObj.gifts)
        record.set('status', lcObj.status)
        record.set('pv', lcObj.pv)
        record.set('notice', lcObj.notice)
        record.set('applyNum', lcObj.applyNum)
        record.set('awards', lcObj.awards)
        record.set('organizer', lcObj.organizer)
      })
    } catch (e) {
      throw e
    }
  }
}

const VoteState = Record({
  allVotes: Map(),        // 全部投票信息：键-id, 值-VoteRecord
  voteList: List(),       // 投票列表
}, 'VoteState')
/**** Constant ****/
const FETCH_VOTES = 'FETCH_VOTES'
const SAVE_VOTE = 'SAVE_VOTE'
const BATCH_SAVE_VOTE = 'BATCH_SAVE_VOTE'
const UPDATE_VOTE_LIST = 'UPDATE_VOTE_LIST'

export const VOTE_STATUS = {
  EDITING:    1,        // 正在编辑
  PAYING:     2,        // 待支付
  WAITING:    3,        // 未开始
  STARTING:   4,        // 正在进行
  DONE:       5,        // 已结束
  ACCOUNTED:  6,        // 已结算
}

export const VOTE_SEARCH_TYPE = {
  ALL:      'all',
  PERSONAL: 'personal',
}

/**** Action ****/
export const voteActions = {
  fetchVotesAction: createAction(FETCH_VOTES),
}
const updateVoteListAction = createAction(UPDATE_VOTE_LIST)

/**** Saga ****/
function* fetchVotes(action) {
  let payload = action.payload
  let apiPayload = {
    searchType: payload.searchType,
    status: payload.status,
    orderedBy: payload.orderedBy,
    lastTime: payload.lastTime,
    limit: payload.limit
  }

  try {
    let votes = yield call(voteCloud.fetchVotesApi, apiPayload)
    yield put(updateVoteListAction({votes: votes, isRefresh: apiPayload.lastTime? false : true}))
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

export const voteSaga = [
  takeLatest(FETCH_VOTES, fetchVotes),
]

/**** Reducer ****/
const initialState = VoteState()

export function voteReducer(state = initialState, action) {
  switch (action.type) {
    case SAVE_VOTE:
      return handleSaveVote(state, action)
    case BATCH_SAVE_VOTE:
      return handleBatchSaveVote(state, action)
    case UPDATE_VOTE_LIST:
      return handleUpdateVoteList(state, action)
    case REHYDRATE:
      return onRehydrate(state, action)
    default:
      return state
  }
}

function handleUpdateVoteList(state, action) {
  let votes = action.payload.votes
  let isRefresh = action.payload.isRefresh
  let voteList = List()
  if(!isRefresh) {
    voteList = state.get('voteList')
  }
  votes.forEach((vote) => {
    let voteRecord = Vote.fromJson(vote)
    state = state.setIn(['allVotes', vote.id], voteRecord)
    voteList = voteList.push(vote.id)
  })
  state = state.set('voteList', voteList)
  return state
}

function handleBatchSaveVote(state, action) {
  return state
}

function handleSaveVote(state, action) {
  return state
}

function onRehydrate(state, action) {
  var incoming = action.payload.VOTE
  if (!incoming) return state

  return state
}

/**** Selector ****/
function selectVote(state, voteId) {
  if(!voteId) {
    return undefined
  }
  let voteRecord = state.VOTE.getIn(['allVotes', voteId])
  return voteRecord? voteRecord.toJS() : undefined
}

function selectVoteList(state) {
  let voteList = state.VOTE.get('voteList')
  let voteInfoList = []
  voteList.toArray().forEach((voteId) => {
    let voteInfo = selectVote(state, voteId)
    voteInfoList.push(voteInfo)
  })
  return voteInfoList
}

export const voteSelector = {
  selectVoteList,
}





