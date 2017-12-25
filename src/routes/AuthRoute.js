/**
 * Created by wanpeng on 2017/12/22.
 */
import React from 'react'
import {Route} from 'react-router-dom'
import {wechatOauth} from '../utils/wechatUtil'

const AuthRoute = ({ component: Component, ...rest }) => {
  let {location} = rest
  let comp = wechatOauth(location)
  if (!comp) {
    return (
      <Route {...rest} render={props => (
        <Component {...props}/>
      )}/>
    )
  }
  return comp
}

export default AuthRoute

