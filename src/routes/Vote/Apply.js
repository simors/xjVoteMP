/**
 * Created by wanpeng on 2017/12/26.
 */
import React from 'react'
import {connect} from 'react-redux'
import {Link, Route, withRouter, Switch} from 'react-router-dom'
import {Button, WhiteSpace, WingBlank, Toast} from 'antd-mobile'
import styles from './apply.module.scss'
import ImageSelector from '../../components/ImageSelector'
import {voteActions} from './redux'
import wx from 'tencent-wx-jssdk'
import {appStateAction, appStateSelector} from '../../utils/appstate'
import {getMobileOperatingSystem} from '../../utils/OS'

class Apply extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      title: undefined,
      declaration: undefined,
      album: [],
      localIds: undefined
    }
  }

  componentWillMount() {
    const {getJsApiConfig, entryURL} = this.props
    const OS = getMobileOperatingSystem()
    let jssdkURL = window.location.href
    if(OS === 'iOS') {
      //微信JS-SDK Bug: SPA(单页应用)ios系统必须使用首次加载的url初始化jssdk
      jssdkURL = entryURL
    }
    console.log("jssdkURL", jssdkURL)
    console.log("entryURL", entryURL)
    getJsApiConfig({
      debug: __DEV__? true: false,
      jsApiList: ['chooseImage', 'previewImage', 'getLocalImgData', 'uploadImage'],
      url: jssdkURL,
      success: this.getJsApiConfigSuccess,
      error: (error) => {console.log(error)}
    })
  }

  getJsApiConfigSuccess = (configInfo) => {
    wx.config(configInfo)
    console.log("wxjs_is_wkwebview:", window.__wxjs_is_wkwebview)
  }


  selectImage = (localIds) => {
    this.setState({localIds: localIds})
  }

  submitApply = () => {
    const {title, declaration, album, localIds} = this.state
    const {voteId, joinVoteApplyAction} = this.props
    if(!title || title.length === 0) {
      Toast.fail('请填写姓名', 1)
      return
    }
    if(!declaration || declaration.length === 0) {
      Toast.fail('请填写参赛宣言', 1)
      return
    }
    if(localIds.length === 0) {
      Toast.fail('至少上传一张照片', 1)
      return
    }
    Toast.loading('正在提交', 0)
    wx.ready(function () {
      localIds.forEach((localId) => {

      })
    })
    joinVoteApplyAction({
      voteId: voteId,
      name: title,
      declaration: declaration,
      album: album,
      success: this.joinVoteApplySuccess,
      error: this.joinVoteApplyError,
    })
  }

  joinVoteApplySuccess = () => {
    Toast.hide()
    Toast.success('提交成功', 1)
  }

  joinVoteApplyError = (error) => {
    Toast.hide()
    Toast.fail('提交失败', 1)
  }

  render() {
    return(
      <div className={styles.container}>
        <div className={styles.title}>

        </div>
        <div className={styles.declaration}>

        </div>
        <ImageSelector count={3} onChange={this.selectImage} />
        <WingBlank>
          <Button type="primary" onClick={this.submitApply}>提交</Button>
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
  ...voteActions,
  ...appStateAction,
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Apply))
