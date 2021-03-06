/**
 * Created by wanpeng on 2017/12/25.
 */
import AV from 'leancloud-storage'

export async function fetchVotesApi(payload) {
  return await AV.Cloud.run('voteFetchSet', payload)
}

export async function fetchVoteInfoById(payload) {
  let params = {
    voteId: payload.voteId,
      updateStatus: payload.updateStatus
  }
  return await AV.Cloud.run('voteFetchById', params)
}

export async function incVotePv(payload) {
  let params = {
    voteId: payload.voteId
  }
  return await AV.Cloud.run('voteIncVotePv', params)
}

export async function fetchVotePlayers(payload) {
  return await AV.Cloud.run('voteFetchVotePlayers', payload)
}

export async function fetchPlayerById(payload) {
  let params = {
    playerId: payload.playerId
  }
  return await AV.Cloud.run('voteFetchPlayerById', params)
}

export async function incPlayerPv(payload) {
  let params = {
    playerId: payload.playerId
  }
  return await AV.Cloud.run('voteIncPlayerPv', params)
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

export async function fetchCreateVotePwd() {
  return await AV.Cloud.run('voteGetCreatePwd')
}

export async function setVoteDisable(payload) {
  return await AV.Cloud.run('voteSetVoteDisable', payload)
}

export async function enablePlayerApply(payload) {
  return await AV.Cloud.run('voteEnablePlayerApply', payload)
}

export async function disablePlayer(payload) {
  return await AV.Cloud.run('voteSetPlayerDisable', payload)
}

export async function fetchGifts(payload) {
  return await AV.Cloud.run('voteFetchGifts', payload)
}

export async function isVoteAllowed(payload) {
  let params = {
    voteId: payload.voteId
  }
  return await AV.Cloud.run('voteIsVoteAllowed', params)
}