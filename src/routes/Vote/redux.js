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
  counter: undefined,
  rule: undefined,
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
        record.set('counter', lcObj.counter)
        record.set('rule', lcObj.rule)
      })
    } catch (e) {
      throw e
    }
  }
}

const PlayerRecord = Record({
  id: undefined,
  createdAt: undefined,
  updatedAt: undefined,
  number: undefined,
  name: undefined,
  declaration: undefined,
  album: undefined,
  giftNum: undefined,
  voteNum: undefined,
  pv: undefined,
  enable: undefined,
  creatorId: undefined,
  voteId: undefined,
}, 'PlayerRecord')

class Player extends PlayerRecord {
  static fromJson(lcObj) {
    try {
      let player = new PlayerRecord()
      return player.withMutations((record) => {
        record.set('id', lcObj.id)
        record.set('createdAt', lcObj.createdAt)
        record.set('updatedAt', lcObj.updatedAt)
        record.set('number', lcObj.number)
        record.set('name', lcObj.name)
        record.set('declaration', lcObj.declaration)
        record.set('album', lcObj.album)
        record.set('giftNum', lcObj.giftNum)
        record.set('voteNum', lcObj.voteNum)
        record.set('pv', lcObj.pv)
        record.set('enable', lcObj.enable)
        record.set('creatorId', lcObj.creatorId)
        record.set('voteId', lcObj.voteId)
      })
    } catch (e) {
      throw e
    }
  }
}

const GiftRecord = Record({
  id: undefined,
  createdAt: undefined,
  updatedAt: undefined,
  name: undefined,
  ballot: undefined,
  photo: undefined,
  price: undefined,
  vtag: undefined,
}, 'GiftRecord')

class Gift extends GiftRecord {
  static fromJson(lcObj) {
    try {
      let gift = new GiftRecord()
      return gift.withMutations((record) => {
        record.set('id', lcObj.id)
        record.set('createdAt', lcObj.createdAt)
        record.set('updatedAt', lcObj.updatedAt)
        record.set('name', lcObj.name)
        record.set('ballot', lcObj.ballot)
        record.set('photo', lcObj.photo)
        record.set('price', lcObj.price)
        record.set('vtag', lcObj.vtag)
      })
    } catch (e) {
      throw e
    }
  }
}

const GiftMapRecord = Record({
  id: undefined,
  createdAt: undefined,
  updatedAt: undefined,
  giftNum: undefined,
  price: undefined,
  voteId: undefined,
  giftId: undefined,
  userId: undefined,
  playerId: undefined,
}, 'GiftMap')

class GiftMap extends GiftMapRecord {
  static fromJson(lcObj) {
    try {
      let giftMap = new GiftMapRecord()
      return giftMap.withMutations((record) => {
        record.set('id', lcObj.id)
        record.set('createdAt', lcObj.createdAt)
        record.set('updatedAt', lcObj.updatedAt)
        record.set('giftNum', lcObj.giftNum)
        record.set('price', lcObj.price)
        record.set('voteId', lcObj.voteId)
        record.set('giftId', lcObj.giftId)
        record.set('userId', lcObj.userId)
        record.set('playerId', lcObj.playerId)
      })
    } catch (e) {
      throw e
    }
  }
}

const VoteState = Record({
  allVotes: Map(),        // 全部投票信息：键-voteId, 值-VoteRecord
  voteList: List(),       // 投票列表
  allPlayers: Map(),      // 全部投票选手信息：键-playerId, 值-PlayerRecord
  votePlayerList: Map(),  // 投票选手列表：键-voteId, 值-playerId列表
  voteRankList: Map(),    // 投票榜单列表：键-voteId, 值-playerId列表
  allGifts: Map(),        // 全部礼品信息
  voteGiftList: Map(),    // 投票礼品列表：键-voteId, 值-giftId
  giftMap: Map(),         // 参赛者礼品信息
  playerGiftList: Map(),  // 参赛者接收礼品列表：键-playerId, 值-giftMapId
}, 'VoteState')

/**** Constant ****/
const FETCH_VOTES = 'FETCH_VOTES'
const SAVE_VOTE = 'SAVE_VOTE'
const BATCH_SAVE_VOTE = 'BATCH_SAVE_VOTE'
const UPDATE_VOTE_LIST = 'UPDATE_VOTE_LIST'
const FETCH_VOTE_PLAYERS = 'FETCH_VOTE_PLAYERS'
const UPDATE_VOTE_PLAYER_LIST = 'UPDATE_VOTE_PLAYER_LIST'
const FETCH_VOTE_RANK = 'FETCH_VOTE_RANK'
const UPDATE_VOTE_RANK_LIST = 'UPDATE_VOTE_RANK_LIST'
const VOTE_FOR_PLAYER = 'VOTE_FOR_PLAYER'
const SAVE_PLAYER = 'SAVE_PLAYER'
const BATCH_SAVE_PLAYER = 'BATCH_SAVE_PLAYER'
const JOIN_VOTE_APPLY = 'JOIN_VOTE_APPLY'
const FETCH_VOTE_GITFS = 'FETCH_VOTE_GITFS'
const UPDATE_VOTE_GIFT_LIST = 'UPDATE_VOTE_GIFT_LIST'
const CREATE_PAYMENT_REQUEST = 'CREATE_PAYMENT_REQUEST'
const FETCH_PLAYER_RECV_GIFTS = 'FETCH_PLAYER_RECV_GIFTS'
const UPDATE_PLAYER_GIFTS_LIST = 'UPDATE_PLAYER_GIFTS_LIST'
const BATCH_SAVE_GIFT = 'BATCH_SAVE_GIFT'

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
  fetchVotePlayersAction: createAction(FETCH_VOTE_PLAYERS),
  voteForPlayerAction: createAction(VOTE_FOR_PLAYER),
  fetchVoteRankAction: createAction(FETCH_VOTE_RANK),
  savePlayerInfoAction: createAction(SAVE_PLAYER),
  batchSavePlayerInfoAction: createAction(BATCH_SAVE_PLAYER),
  joinVoteApplyAction: createAction(JOIN_VOTE_APPLY),
  fetchVoteGiftsAction: createAction(FETCH_VOTE_GITFS),
  createPaymentRequestAction: createAction(CREATE_PAYMENT_REQUEST),
  fetchPlayerRecvGiftsAction: createAction(FETCH_PLAYER_RECV_GIFTS),
  batchSaveVoteAction: createAction(BATCH_SAVE_VOTE),
  batchSaveGiftAction: createAction(BATCH_SAVE_GIFT),
}
const updateVoteListAction = createAction(UPDATE_VOTE_LIST)
const updateVotePlayerListAction = createAction(UPDATE_VOTE_PLAYER_LIST)
const updateVoteRankListAction = createAction(UPDATE_VOTE_RANK_LIST)
const updateVoteGiftListAction = createAction(UPDATE_VOTE_GIFT_LIST)
const updatePlayerGiftListAction = createAction(UPDATE_PLAYER_GIFTS_LIST)

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

function* fetchVotePlayers(action) {
  let payload = action.payload
  let apiPayload = {
    voteId: payload.voteId,
    lastNumber: payload.lastNumber,
    limit: payload.limit
  }

  try {
    let players = yield call(voteCloud.fetchVotePlayers, apiPayload)
    yield put(updateVotePlayerListAction({voteId: apiPayload.voteId, players: players, isRefresh: apiPayload.lastNumber? false : true}))

    if(payload.success) {
      payload.success(players.length)
    }
  } catch (error) {
    console.error(error)
    if(payload.error) {
      payload.error(error)
    }
  }
}

function* voteForPlayer(action) {
  let payload = action.payload

  try {
    yield call(voteCloud.voteForPlayer, {playerId: payload.playerId})

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

function* fetchVoteRank(action) {
  let payload = action.payload

  try {
    let rank =  yield call(voteCloud.fetchVoteRank, {voteId: payload.voteId})
    yield put(updateVoteRankListAction({voteId: payload.voteId, rank: rank}))
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

function* joinVoteApply(action) {
  let payload = action.payload

  let apiPayload = {
    voteId: payload.voteId,
    name: payload.name,
    declaration: payload.declaration,
    imageServerIds: payload.imageServerIds
  }
  try {
    let result = yield call(voteCloud.joinVoteApply, apiPayload)
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

function* fetchVoteGifts(action) {
  let payload = action.payload

  try {
    let gifts = yield call(voteCloud.fetchGiftsByVote, {voteId: payload.voteId})
    yield put(updateVoteGiftListAction({gifts: gifts, voteId: payload.voteId}))
    if(payload.success) {
      payload.success(gifts.length)
    }
  } catch (error) {
    console.error(error)
    if(payload.error) {
      payload.error(error)
    }
  }
}

function* createPayment(action) {
  let payload = action.payload

  let apiPayload = {
    amount: payload.amount,
    channel: 'wx_pub',
    metadata: payload.metadata || {},
    openid: payload.openid,
    subject: payload.subject
  }

  try {
    let charge = yield call(voteCloud.createPaymentRequest, apiPayload)
    if(charge && payload.success){
      payload.success(charge)
    }
  } catch (error) {
    console.error(error)
    if(payload.error) {
      payload.error(error)
    }
  }
}

function* fetchPlayerRecvGifts(action) {
  let payload = action.payload

  let apiPayload = {
    playerId: payload.playerId,
    lastTime: payload.lastTime,
    limit: payload.limit
  }
  try {
    let giftMaps = yield call(voteCloud.fetchPlayerRecvGifts, apiPayload)
    let voteSet = new Set()
    let giftSet = new Set()
    let userSet = new Set()
    let playerSet = new Set()
    giftMaps.forEach((giftMap) => {
      let vote = giftMap.vote
      let gift = giftMap.gift
      let user = giftMap.user
      let player = giftMap.player
      vote && voteSet.add(vote)
      gift && giftSet.add(gift)
      user && userSet.add(user)
      player && playerSet.add(player)
    })

    if(voteSet.size > 0) {
      yield put(voteActions.batchSaveVoteAction({votes: voteSet}))
    }
    if(giftSet.size > 0) {
      yield put(voteActions.batchSaveGiftAction({gifts: giftSet}))
    }
    if(userSet.size > 0) {
      yield put(authAction.addUserBatchProfile({userProfiles: userSet}))
    }
    if(playerSet.size > 0) {
      yield put(voteActions.batchSavePlayerInfoAction({players: playerSet}))
    }

    yield put(updatePlayerGiftListAction({giftMaps: giftMaps, playerId: apiPayload.playerId, lastTime: apiPayload.lastTime}))

    if(payload.success) {
      payload.success(giftMaps.length)
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
  takeLatest(FETCH_VOTE_PLAYERS, fetchVotePlayers),
  takeLatest(VOTE_FOR_PLAYER, voteForPlayer),
  takeLatest(FETCH_VOTE_RANK, fetchVoteRank),
  takeLatest(JOIN_VOTE_APPLY, joinVoteApply),
  takeLatest(FETCH_VOTE_GITFS, fetchVoteGifts),
  takeLatest(CREATE_PAYMENT_REQUEST, createPayment),
  takeLatest(FETCH_PLAYER_RECV_GIFTS, fetchPlayerRecvGifts),
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
    case UPDATE_VOTE_PLAYER_LIST:
      return handleUpdateVotePlayerList(state, action)
    case UPDATE_VOTE_RANK_LIST:
      return handleUpdateVoteRankList(state, action)
    case SAVE_PLAYER:
      return handleSavePlayer(state, action)
    case BATCH_SAVE_PLAYER:
      return handleBatchSavePlayer(state, action)
    case UPDATE_VOTE_GIFT_LIST:
      return handleUpdateVoteGiftList(state, action)
    case UPDATE_PLAYER_GIFTS_LIST:
      return handleUpdatePlayerGiftList(state, action)
    case BATCH_SAVE_GIFT:
      return handleBatchSaveGift(state, action)
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

function handleUpdateVotePlayerList(state, action) {
  let voteId = action.payload.voteId
  let players = action.payload.players
  let isRefresh = action.payload.isRefresh
  let playerList = List()
  if(!isRefresh) {
    playerList = state.getIn(['votePlayerList', voteId])
  }
  players.forEach((player) => {
    let playerRecord = Player.fromJson(player)
    state = state.setIn(['allPlayers', player.id], playerRecord)
    playerList = playerList.push(player.id)
  })
  state = state.setIn(['votePlayerList', voteId], playerList)
  return state
}

function handleUpdateVoteRankList(state, action) {
  let voteId = action.payload.voteId
  let rank = action.payload.rank
  let rankList = List()
  rank.forEach((playerInfo) => {
    let playerRecord = Player.fromJson(playerInfo)
    state = state.setIn(['allPlayers', playerInfo.id], playerRecord)
    rankList = rankList.push(playerInfo.id)
  })
  state = state.setIn(['voteRankList', voteId], rankList)
  return state
}

function handleUpdateVoteGiftList(state, action) {
  let voteId = action.payload.voteId
  let gifts = action.payload.gifts

  let giftList = List()
  gifts.forEach((giftInfo) => {
    let giftRecord = Gift.fromJson(giftInfo)
    state = state.setIn(['allGifts', giftInfo.id], giftRecord)
    giftList = giftList.push(giftInfo.id)
  })
  state = state.setIn(['voteGiftList', voteId], giftList)
  return state
}

function handleUpdatePlayerGiftList(state, action) {
  let playerId = action.payload.playerId
  let giftMaps = action.payload.giftMaps
  let lastTime = action.payload.lastTime

  let giftList = List()

  if(lastTime) {
    giftList = state.getIn(['playerGiftList', playerId])
  }

  giftMaps.forEach((giftMapInfo) => {
    let giftMapRecord = GiftMap.fromJson(giftMapInfo)
    state = state.setIn(['giftMap', giftMapInfo.id], giftMapRecord)
    giftList = giftList.push(giftMapInfo.id)
  })
  state = state.setIn(['playerGiftList', playerId], giftList)
  return state
}

function handleBatchSaveVote(state, action) {
  let votes = action.payload.votes
  votes.forEach((vote) => {
    let voteRecord = Vote.fromJson(vote)
    state = state.setIn(['allVotes', vote.id], voteRecord)
  })
  return state
}

function handleSaveVote(state, action) {
  return state
}

function handleSavePlayer(state, action) {
  return  state
}

function handleBatchSavePlayer(state, action) {
  let players = action.payload.players
  players.forEach((player) => {
    let playerRecord = Player.fromJson(player)
    state = state.setIn(['allPlayers', player.id], playerRecord)
  })
  return state
}

function handleBatchSaveGift(state, action) {
  let gifts = action.payload.gifts

  gifts.forEach((gift) => {
    let giftRecord = Gift.fromJson(gift)
    state = state.setIn(['allGifts', gift.id], giftRecord)
  })
  return state
}

function onRehydrate(state, action) {
  var incoming = action.payload.VOTE
  if (!incoming) return state
  let allVotesMap = new Map(incoming.allVotes)
  try {
    for(let [voteId, voteInfo] of allVotesMap) {
      if(voteId, voteInfo) {
        let voteRecord = new VoteRecord({...voteInfo})
        state = state.setIn(['allVotes', voteId], voteRecord)
      }
    }
  } catch (e) {
    allVotesMap.clear()
  }

  let voteList = incoming.voteList
  if(voteList) {
    state = state.set('voteList', List(voteList))
  }

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

function selectPlayer(state, playerId) {
  if(!playerId) {
    return undefined
  }
  let playerRecord = state.VOTE.getIn(['allPlayers', playerId])
  return playerRecord? playerRecord.toJS() : undefined
}

function selectVotePlayerList(state, voteId) {
  if(!voteId) {
    return undefined
  }
  let votePlayerInfoList = []
  let votePlayerList = state.VOTE.getIn(['votePlayerList', voteId])
  if(!votePlayerList) {
    return votePlayerInfoList
  }
  votePlayerList.toArray().forEach((playerId) => {
    let playerInfo = selectPlayer(state, playerId)
    votePlayerInfoList.push(playerInfo)
  })
  return votePlayerInfoList
}

function selectVoteRankInfo(state, voteId) {
  if(!voteId) {
    return undefined
  }
  let voteRankInfoList = []
  let voteRankList = state.VOTE.getIn(['voteRankList', voteId])
  if(!voteRankList) {
    return voteRankInfoList
  }
  voteRankList.toArray().forEach((playerId) => {
    let playerInfo = selectPlayer(state, playerId)
    voteRankInfoList.push(playerInfo)
  })
  return voteRankInfoList
}

function selectGift(state, giftId) {
  if(!giftId) {
    return undefined
  }
  let giftRecord = state.VOTE.getIn(['allGifts', giftId])
  return giftRecord? giftRecord.toJS() : undefined
}

function selectVoteGiftList(state, voteId) {
  if(!voteId) {
    return undefined
  }
  let voteGiftListInfo = []
  let voteGiftList = state.VOTE.getIn(['voteGiftList', voteId])
  if(!voteGiftList) {
    return voteGiftListInfo
  }
  voteGiftList.toArray().forEach((giftId) => {
    let giftInfo = selectGift(state, giftId)
    voteGiftListInfo.push(giftInfo)
  })
  return voteGiftListInfo
}

function selectGiftMap(state, giftMapId) {
  if(!giftMapId) {
    return undefined
  }
  let giftMapRecord = state.VOTE.getIn(['giftMap', giftMapId])
  return giftMapRecord? giftMapRecord.toJS() : undefined
}

function selectPlayerRecvGiftList(state, playerId) {
  if(!playerId) {
    return undefined
  }
  let giftMapListInfo = []
  let playerGiftList = state.VOTE.getIn(['playerGiftList', playerId])
  if(!playerGiftList) {
    return giftMapListInfo
  }
  playerGiftList.toArray().forEach((giftMapId) => {
    let giftMapInfo = selectGiftMap(state, giftMapId)
    giftMapInfo && (giftMapInfo.user = authSelector.userInfoById(state, giftMapInfo.userId))
    giftMapInfo && (giftMapInfo.gift = selectGift(state, giftMapInfo.giftId))
    giftMapListInfo.push(giftMapInfo)
  })
  return giftMapListInfo
}

export const voteSelector = {
  selectVoteList,
  selectVote,
  selectPlayer,
  selectVotePlayerList,
  selectVoteRankInfo,
  selectGift,
  selectVoteGiftList,
  selectPlayerRecvGiftList,
}





