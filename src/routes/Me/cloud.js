/**
 * Created by wanpeng on 2017/12/25.
 */
import AV from 'leancloud-storage'

export async function fetchUserDealRecords(payload) {
  return await AV.Cloud.run('payFetchUserDealRecords', payload)
}

export async function fetchWallet() {
  return await AV.Cloud.run('payGetWalletInfo')
}

export async function reqWithdrawApply(payload) {
  return await AV.Cloud.run('payCreateWithdrawApply', payload)
}

export async function getLastWithdrawApply(payload) {
  return await AV.Cloud.run('payFetchUserLastWithdrawApply', {})
}
