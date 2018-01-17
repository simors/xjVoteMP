/**
 * Created by wanpeng on 2017/12/25.
 */
import AV from 'leancloud-storage'

export async function fetchVotesApi(payload) {
  return await AV.Cloud.run('voteFetchSet', payload)
}

export async function fetchVotePlayers(payload) {
  return await AV.Cloud.run('voteFetchVotePlayers', payload)
}

export async function voteForPlayer(payload) {
  return await AV.Cloud.run('voteVoteForPlayer', payload)
}

export async  function fetchVoteRank(payload) {
  return await AV.Cloud.run('voteFetchRank', payload)
}

export async function joinVoteApply(payload) {
  return await AV.Cloud.run('voteCreatePlayerApplyMP', payload)
}

export async function fetchGiftsByVote(payload) {
  return await AV.Cloud.run('voteFetchGiftsByVote', payload)
}

export async function createPaymentRequest(payload) {
  console.log("payCreatePaymentRequest:", payload)
  return await AV.Cloud.run('payCreatePaymentRequest', payload)
}

export async function fetchPlayerRecvGifts(payload) {
  return await AV.Cloud.run('voteListPlayerGifts', payload)
}

export async function searchPlayer(payload) {
  return await AV.Cloud.run('voteSearchPlayer', payload)
}
