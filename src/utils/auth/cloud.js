/**
 * Created by yangyang on 2017/9/20.
 */
import AV from 'leancloud-storage'

/**
 * 使用authData完成登录，目前只支持微信登录
 * authData的格式如下：
 *
 * authData = {
 *  "openid": openid,
 *  "access_token": accessToken,
 *  "expires_at": Date.parse(expires_in),
 *}
 *
 * @param payload
 * @returns {Promise.<TResult>}
 */
export function loginAuthData(payload) {
  let authData = payload
  let platform = 'weixin'

  return AV.User.signUpOrlogInWithAuthData(authData, platform).then((leanUser) => {
    let token = leanUser.getSessionToken()
    console.log('token:', token)
    return({
      userInfo: leanUser,
      token: token,
    })
  }).catch((error) => {
    console.log("login error", error)
    throw error
  })
}

export function become(payload) {
  return AV.User.become(payload.token).then((leanUser) => {
    let token = leanUser.getSessionToken()
    return ({
      token: token,
      userInfo: leanUser,
    })
  }, (err) => {
    throw err
  })
}