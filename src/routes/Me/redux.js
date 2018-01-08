/**
 * Created by wanpeng on 2017/12/25.
 */
import {Map, List, Record} from 'immutable'
import {createAction} from 'redux-actions'
import {REHYDRATE} from 'redux-persist/constants'
import {call, put, takeEvery, takeLatest, select} from 'redux-saga/effects'
import * as meCloud from './cloud'

/****  Model  ****/
const WalletRecord = Record({
  userId: undefined,
  balance: undefined,
  openid: undefined,
  user_name: undefined,
  process: undefined,
}, 'WalletRecord')

const DealRecord = Record({
  id: undefined,
  from: undefined,
  to: undefined,
  cost: undefined,
  chargeId:  undefined,
  orderNo: undefined,
  channel:  undefined,
  transactionNo: undefined,
  dealTime: undefined,
  dealType: undefined,
  fee: undefined,
  promotionId: undefined,
}, 'DealRecord')

class Wallet extends WalletRecord {
  static fromJson(lcObj) {
    try {
      let wallet = new WalletRecord()
      return wallet.withMutations((record) => {
        record.set('userId', lcObj.userId)
        record.set('balance', lcObj.balance)
        record.set('openid', lcObj.openid)
        record.set('user_name', lcObj.user_name)
        record.set('process', lcObj.process)
      })
    } catch (e) {
      throw e
    }
  }
}

class Deal extends DealRecord {
  static fromJson(lcObj) {
    try {
      let deal = new DealRecord()
      return deal.withMutations((record) => {
        record.set('id', lcObj.id)
        record.set('from', lcObj.from)
        record.set('to', lcObj.to)
        record.set('cost', lcObj.cost)
        record.set('chargeId', lcObj.chargeId)
        record.set('orderNo', lcObj.orderNo)
        record.set('channel', lcObj.channel)
        record.set('transactionNo', lcObj.transactionNo)
        record.set('dealTime', lcObj.dealTime)
        record.set('dealType', lcObj.dealType)
        record.set('fee', lcObj.fee)
        record.set('promotionId', lcObj.promotionId)
      })
    } catch (e) {
      throw e
    }
  }
}

const MeState = Record({
  wallet: undefined,
  allDeal: Map(),     // 全部交易信息：键-dealId, 值-DealRecord
  dealList: List()
}, 'MeState')
/**** Constant ****/
const FETCH_WALLET_INFO = 'FETCH_WALLET_INFO'
const SAVE_WALLET_INFO = 'SAVE_WALLET_INFO'
const FETCH_DEAL_RECORD = 'FETCH_DEAL_RECORD'
const UPDATE_DEAL_LIST = 'UPDATE_DEAL_LIST'
const REQUEST_WITHDRAW_APPLY = 'REQUEST_WITHDRAW_APPLY'

export const DEAL_TYPE = {
  VOTE_PAY: 1,      // 活动支付
  RECHARGE: 2,      // 用户充值
  WITHDRAW: 3,      // 提现
  BUY_GIFT: 4,      // 购买礼品
  VOTE_PROFIT: 5,   // 活动收益
  AGENT_PAY: 6,     // 成为代理
  INVITE_AGENT: 7,  // 邀请代理收益
}

export const WALLET_PROCESS_TYPE = {
  NORMAL_PROCESS: 0,      // 正常状态
  WITHDRAW_PROCESS: 1,    // 正在提现
}

export const WITHDRAW_STATUS = {
  APPLYING: 1,      // 提交申请
  DONE: 2,          // 处理完成
}

export const WITHDRAW_APPLY_TYPE = {
  PROFIT: 1,        // 服务单位和投资人申请收益取现
}

/**** Action ****/
export const meActions = {
  fetchWalletInfoAction: createAction(FETCH_WALLET_INFO),
  fetchDealRecordAction: createAction(FETCH_DEAL_RECORD),
  requestWithdrawApplyAction: createAction(REQUEST_WITHDRAW_APPLY),
}
const saveWalletInfoAction = createAction(SAVE_WALLET_INFO)
const updateDealListAction = createAction(UPDATE_DEAL_LIST)
/**** Saga ****/
function* fetchWalletInfo(action) {
  let payload = action.payload

  try {
    let wallet = yield call(meCloud.fetchWallet, {})
    yield put(saveWalletInfoAction({wallet: wallet}))

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

function* fetchDealRecord(action) {
  let payload = action.payload

  try {
    let deals = yield call(meCloud.fetchUserDealRecords, {limit: payload.limit, lastTime: payload.lastTime})
    yield put(updateDealListAction({isRefresh: payload.lastTime? false : true, deals: deals}))

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

function* requestWithdrawApply(action) {
  let payload = action.payload

  let apiPayload = {
    amount: payload.amount,
    channel: 'wx_pub',
    applyType: WITHDRAW_APPLY_TYPE.PROFIT
  }
  try {
    yield call(meCloud.reqWithdrawApply, apiPayload)

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

export const meSaga = [
  takeLatest(FETCH_WALLET_INFO, fetchWalletInfo),
  takeLatest(FETCH_DEAL_RECORD, fetchDealRecord),
  takeLatest(REQUEST_WITHDRAW_APPLY, requestWithdrawApply)
]



/**** Reducer ****/
const initialState = MeState()

export function meReducer(state = initialState, action) {
  switch (action.type) {
    case SAVE_WALLET_INFO:
      return handleSaveWalletInfo(state, action)
    case UPDATE_DEAL_LIST:
      return handleUpdateDealList(state, action)
    case REHYDRATE:
      return state
    default:
      return state
  }
}

function handleSaveWalletInfo(state, action) {
  let wallet = action.payload.wallet
  let walletRecord = Wallet.fromJson(wallet)
  state = state.set('wallet', walletRecord)
  return state
}

function handleUpdateDealList(state, action) {
  let isRefresh = action.payload.isRefresh
  let deals = action.payload.deals

  let dealList = List()
  if(!isRefresh) {
    dealList = state.get('dealList')
  }
  deals.forEach((deal) => {
    let dealRecord = Deal.fromJson(deal)
    state = state.setIn(['allDeal', deal.id], dealRecord)
    dealList = dealList.push(deal.id)
  })
  state = state.set('dealList', dealList)
  return state
}

/**** Selector ****/
function selectWallet(state) {
  let walletRecord = state.ME.get('wallet')
  return walletRecord? walletRecord.toJS() : undefined
}

function selectDeal(state, dealId) {
  if(!dealId) {
    return undefined
  }
  let dealRecord = state.ME.getIn(['allDeal', dealId])
  return dealRecord? dealRecord.toJS() : undefined
}

function selectDealList(state) {
  let dealList = state.ME.get('dealList')
  let dealListInfo = []
  dealList.toArray().forEach((dealId) => {
    let dealInfo = selectDeal(state, dealId)
    dealListInfo.push(dealInfo)
  })
  return dealListInfo
}

export const meSelector = {
  selectWallet,
  selectDeal,
  selectDealList,
}





