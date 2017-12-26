/**
 * Created by wanpeng on 2017/12/25.
 */
import AV from 'leancloud-storage'

export async function fetchVotesApi(payload) {
  return await AV.Cloud.run('voteFetchSet', payload)
}
