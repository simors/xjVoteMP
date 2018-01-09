/**
 * Created by yangyang on 2017/9/19.
 */
import React from 'react'
import {Redirect} from 'react-router-dom'
import querystring from 'querystring'
import URL from  'url'
import appConfig from './appConfig'
import {authAction, authSelector} from '../utils/auth'
import {store} from '../store/persistStore'
import {appStateSelector, appStateAction} from '../utils/appstate'

function getAuthorizeURL(redirect, state, scope) {
  let url = 'https://open.weixin.qq.com/connect/oauth2/authorize';
  let info = {
    appid: appConfig.WECHAT_MP_APPID,
    redirect_uri: redirect,
    response_type: 'code',
    scope: scope || 'snsapi_base',
    state: state || ''
  };
  return url + '?' + querystring.stringify(info) + '#wechat_redirect';
}


export function wechatOauth(nextPath) {
  let state = store.getState()
  let appState = appStateSelector.selectAppState(state)
  let isRehydrated = undefined
  if (appState) {
    isRehydrated = appState.isRehydrated
  }
  if (!isRehydrated) {
    return (
      <Redirect to={{
        pathname: '/loading',
        state: {from: nextPath}
      }}/>
    )
  }
  let activeUser = authSelector.activeUserId(state)
  if (activeUser) {
    store.dispatch(appStateAction.updateEntryURLAction({url: document.location.href}))
    return null
  }
  let redirectUri = appConfig.WECHAT_OAUTH_DOMAIN
  let urlObj = URL.parse(document.location.href)
  let {openid, access_token, expires_at} = querystring.parse(urlObj.query)
  let authData = undefined
  if (openid && access_token && expires_at) {
    authData = {
      openid,
      access_token,
      expires_at,
    }
  }
  if(!authData) {
    let nextPathname = nextPath.pathname
    let redirectUrl = getAuthorizeURL(redirectUri, nextPathname, 'snsapi_userinfo')
    document.location = redirectUrl
  } else {
    store.dispatch(authAction.loginWithAuthData(authData))
  }
  return null
}

export function getLocalImgDataAsync(wx, localId) {
  if(!wx || !localId) {
    return undefined
  }
  return new Promise(function (resolve, reject) {
    wx.getLocalImgData({
      localId: localId,
      success: function (res) {
        if(res.localData) {
          resolve(res.localData)
        } else {
          reject()
        }
      }
    })
  })
}

export function uploadImageAsync(wx, localId) {
  if(!wx || !localId) {
    return undefined
  }
  return new Promise(function (resolve, reject) {
    wx.uploadImage({
      localId: localId,
      isShowProgressTips: 1,
      success: function (res) {
        if(res.serverId) {
          resolve(res.serverId)
        } else {
          reject()
        }
      }
    })
  })
}
