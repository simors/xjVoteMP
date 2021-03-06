/**
 * Created by wanpeng on 2017/12/26.
 */
import React from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import {Toast, TabBar, Modal} from 'antd-mobile'
import Loading from '../Loading'
import styles from './vote.module.scss'
import VoteDetail from './VoteDetail'
import Apply from './Apply'
import Award from './Award'
import Range from './Range'
import {voteActions, voteSelector, VOTE_STATUS} from './redux'
import wx from 'tencent-wx-jssdk'
import appConfig from '../../utils/appConfig'
import {getMobileOperatingSystem} from '../../utils/OS'
import {appStateAction, appStateSelector} from '../../utils/appstate'
import ShareGuider from '../../components/ShareGuider'
const queryString = require('query-string');

const Item = TabBar.Item

class Vote extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      selectedTab: 'homeTab',
      showShareGuider: false,
      previewModalVisible: false,
    }
  }
  
  componentDidMount() {
    const {getJsApiConfig, entryURL, match, fetchVoteByIdAction, incVotePvAction, showType} = this.props
    const OS = getMobileOperatingSystem()
    let jssdkURL = window.location.href
    if(OS === 'iOS') {
      //微信JS-SDK Bug: SPA(单页应用)ios系统必须使用首次加载的url初始化jssdk
      jssdkURL = entryURL
    }
    getJsApiConfig({
      debug: __DEV__? false: false,
      jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage'].toString(),
      url: jssdkURL.split('#')[0],
      success: this.getJsApiConfigSuccess,
      error: (error) => {console.log(error)}
    })
  
    const {voteId} = match.params
    if (voteId) {
      fetchVoteByIdAction({
        voteId,
        updateStatus: true,
        success:()=>{
          if(showType=='preview'){
            Toast.success('此为临时链接，仅用于活动预览，将在短期内失效')
          }
        }
      })
      incVotePvAction({voteId})
    }
  }
  
  getJsApiConfigSuccess = (configInfo) => {
    wx.config(configInfo)
    
    const {voteId, voteInfo} = this.props
    const title = voteInfo.title
    let url = undefined
    if(this.props.showType=='preview'){
      url = appConfig.CLIENT_DOMAIN + '/#/vote/'+ voteId + '?showType=preview'
    }else{
      url = appConfig.CLIENT_DOMAIN + '/#/vote/'+ voteId
    }

    wx.ready(function () {
      wx.onMenuShareTimeline({
        title: title,
        link: url,
        desc: '邀请您投票',
        imgUrl: voteInfo.cover ? voteInfo.cover : voteInfo.coverSet[0],
        success: function () {
          Toast.success("分享成功")
        },
        cancel: function () {
          Toast.fail('取消分享')
        },
        fail: function (res) {
          Toast.fail('fail:' + res.errMsg)
        },
        complete: function (res) {
          // Toast.success('complete:' + res.errMsg)
        }
      })
      
      wx.onMenuShareAppMessage({
        title: title,
        link: url,
        imgUrl: voteInfo.cover? voteInfo.cover : voteInfo.coverSet[0],
        desc: '邀请您投票',
        success: function () {
          Toast.success("分享成功")
        },
        cancel: function () {
          Toast.fail('取消分享')
        },
        fail: function (res) {
          Toast.fail('fail:' + res.errMsg)
        },
        complete: function (res) {
          // Toast.success('complete:' + res.errMsg)
        }
      })
    })
  }

  onSwitchTab = (tab) => {
    this.setState({selectedTab: tab})
  }
  
  onCloseShareGuider = () => {
    this.setState({showShareGuider: false})
  }
  
  onOpenShareGuider = (e) => {
    e.preventDefault()
    this.setState({showShareGuider: true})
  }

  closePreviewModal = () => {
    this.setState({previewModalVisible: false})
  }

  render() {
    const {voteId, history, voteInfo} = this.props
    if(voteInfo!=undefined){
      if(voteInfo.status === VOTE_STATUS.STARTING || voteInfo.status === VOTE_STATUS.DONE || voteInfo.status === VOTE_STATUS.ACCOUNTED){
        return(
          <div className={styles.page}>
            {this.state.previewModalVisible?<Modal
              visible={true}
              transparent
              maskClosable={false}
              onClose={this.closePreviewModal}
              title="Title"
              footer={[{ text: '确认', onPress: this.closePreviewModal }]}
            >

            </Modal>:null}
            <TabBar tintColor="#F6635F">
              <Item
                title="活动主页"
                key="Home"
                icon={<div className={styles.homeIcon} />}
                selectedIcon={<div className={styles.homeIconFill}/>}
                selected={this.state.selectedTab === 'homeTab'}
                onPress={() => {
                  this.setState({
                    selectedTab: 'homeTab',
                  })
                  document.title = "活动主页"
                }}
              >
                <VoteDetail voteId={voteId} onSwitchTab={this.onSwitchTab} history={history} onShare={this.onOpenShareGuider}/>
              </Item>
              <Item
                title="奖品"
                key="prize"
                icon={<div className={styles.prizeIcon} />}
                selectedIcon={<div className={styles.prizeIconFill}/>}
                selected={this.state.selectedTab === 'prizeTab'}
                onPress={() => {
                  this.setState({
                    selectedTab: 'prizeTab',
                  })
                  document.title = "奖品详情"
                }}
              >
                <Award voteId={voteId} onShare={this.onOpenShareGuider}/>
              </Item>
              <Item
                title="榜单"
                key="range"
                icon={<div className={styles.rangeIcon} />}
                selectedIcon={<div className={styles.rangeIconFill}/>}
                selected={this.state.selectedTab === 'rangeTab'}
                onPress={() => {
                  this.setState({
                    selectedTab: 'rangeTab',
                  })
                  document.title = "榜单"
                }}
              >
                <Range voteId={voteId} history={history} onShare={this.onOpenShareGuider}/>
              </Item>
            </TabBar>
            <ShareGuider visible={this.state.showShareGuider}
                         onClose={this.onCloseShareGuider}
            />
          </div>
        )
      }
      return (
        <div className={styles.page}>
          <TabBar tintColor="#F6635F">
            <Item
              title="活动主页"
              key="Home"
              icon={<div className={styles.homeIcon} />}
              selectedIcon={<div className={styles.homeIconFill}/>}
              selected={this.state.selectedTab === 'homeTab'}
              onPress={() => {
                this.setState({
                  selectedTab: 'homeTab',
                })
                document.title = "活动主页"
              }}
            >
              <VoteDetail voteId={voteId} onSwitchTab={this.onSwitchTab} history={history} onShare={this.onOpenShareGuider}/>
            </Item>
            <Item
              title="报名"
              key="apply"
              icon={<div className={styles.applyIcon} />}
              selectedIcon={<div className={styles.applyIconFill}/>}
              selected={this.state.selectedTab === 'applyTab'}
              onPress={() => {
                this.setState({
                  selectedTab: 'applyTab',
                })
                document.title = "我要报名"
              }}
            >
              <Apply voteId={voteId} onSwitchTab={this.onSwitchTab} />
            </Item>
            <Item
              title="奖品"
              key="prize"
              icon={<div className={styles.prizeIcon} />}
              selectedIcon={<div className={styles.prizeIconFill}/>}
              selected={this.state.selectedTab === 'prizeTab'}
              onPress={() => {
                this.setState({
                  selectedTab: 'prizeTab',
                })
                document.title = "奖品详情"
              }}
            >
              <Award voteId={voteId} onShare={this.onOpenShareGuider}/>
            </Item>
            <Item
              title="榜单"
              key="range"
              icon={<div className={styles.rangeIcon} />}
              selectedIcon={<div className={styles.rangeIconFill}/>}
              selected={this.state.selectedTab === 'rangeTab'}
              onPress={() => {
                this.setState({
                  selectedTab: 'rangeTab',
                })
                document.title = "榜单"
              }}
            >
              <Range voteId={voteId} history={history} onShare={this.onOpenShareGuider}/>
            </Item>
          </TabBar>
          <ShareGuider visible={this.state.showShareGuider}
                       onClose={this.onCloseShareGuider}
          />
        </div>
      )
    }else{
      return null
    }

  }
}

const mapStateToProps = (state, ownProps) => {
  const {match,history} = ownProps
  const {voteId} = match.params
  let {showType} = queryString.parse(history.location.search)
  console.log('showType====>',showType)
  return {
    voteId,
    showType,
    voteInfo: voteSelector.selectVote(state, voteId),
    entryURL: appStateSelector.selectEntryURL(state)
  }
}

const mapDispatchToProps = {
  ...appStateAction,
  ...voteActions
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Vote))
