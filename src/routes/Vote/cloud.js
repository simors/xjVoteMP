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
  return await AV.Cloud.run('voteCreatePlayerApply', payload)
}
