/**
 * Created by wanpeng on 2018/1/18.
 */
import React from 'react'
import {connect} from 'react-redux'
import {Link, Route, withRouter, Switch} from 'react-router-dom'
import {Button, WingBlank} from 'antd-mobile'
import wx from 'tencent-wx-jssdk'
import styles from './invite.module.scss'
import {appStateAction, appStateSelector} from '../../utils/appstate'
import {getMobileOperatingSystem} from '../../utils/OS'

class Invite extends React.PureComponent {
  constructor(props) {
    document.title = "邀请代理"
    super(props)
  }

  componentWillMount() {
    const {getJsApiConfig, entryURL} = this.props
    const OS = getMobileOperatingSystem()
    let jssdkURL = window.location.href
    if(OS === 'iOS') {
      //微信JS-SDK Bug: SPA(单页应用)ios系统必须使用首次加载的url初始化jssdk
      jssdkURL = entryURL
    }
    getJsApiConfig({
      debug: __DEV__? true: true,
      jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage'].toString(),
      url: jssdkURL,
      success: this.getJsApiConfigSuccess,
      error: (error) => {console.log(error)}
    })
  }

  getJsApiConfigSuccess = (configInfo) => {
    wx.config(configInfo)
  }

  onShare = () => {
    wx.ready(function () {
      wx.onMenuShareTimeline({
        title: '小吉互动',
        link: 'https://vote.xiaojee.cn',
        imgUrl: 'http://ac-l3cae9l7.clouddn.com/9b8514cffb7b4d9e2395.png',
        success: function (res) {

        },
        cancel: function (res) {

        }
      })
    })

    wx.error(function (err) {
      alert(JSON.stringify(err))
    })
  }

  render() {
    return(
      <div className={styles.container}>
        <div className={styles.imageView}>
          <img className={styles.img} src="http://ac-l3cae9l7.clouddn.com/9b8514cffb7b4d9e2395.png" alt=""/>
        </div>
        <WingBlank style={{marginTop: '50px'}}>
          <Button type="primary" onClick={this.onShare}>分享给好友</Button>
        </WingBlank>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    entryURL: appStateSelector.selectEntryURL(state)
  }
}

const mapDispatchToProps = {
  ...appStateAction,
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Invite))


