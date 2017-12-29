/**
 * Created by wanpeng on 2017/12/29.
 */
import AV from 'leancloud-storage'

export async function createOrUpdateVote(payload) {
  return await AV.Cloud.run('voteCreateOrUpdateVote', payload)
}
