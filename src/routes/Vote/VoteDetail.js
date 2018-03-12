/**
 * Created by wanpeng on 2017/12/26.
 */
import React from 'react'
import {connect} from 'react-redux'
import {Link, Route, withRouter, Switch} from 'react-router-dom'
import Countdown from '../../components/Countdown'
import {voteSelector, VOTE_STATUS} from './redux'
import {NoticeBar, WhiteSpace, WingBlank, Button, Carousel, Toast} from 'antd-mobile'
import styles from './votedetail.module.scss'
import VoteStat from '../../components/VoteStat'
import VotePlayers from './VotePlayers'
import OrganizerView from '../../components/OrganizerView'
import ManagerBtn from './ManagerBtn'
import {authSelector} from '../../utils/auth'
import ShareGuider from '../../components/ShareGuider'
import {getMobileOperatingSystem} from '../../utils/OS'
import {appStateAction, appStateSelector} from '../../utils/appstate'
import wx from 'tencent-wx-jssdk'
import appConfig from '../../utils/appConfig'

class VoteDetail extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      showShareGuider: false,
      searchKey: ''
    }
  }
  
  componentDidMount() {
    const {getJsApiConfig, entryURL} = this.props
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
  }
  
  getJsApiConfigSuccess = (configInfo) => {
    wx.config(configInfo)
    
    const {voteId, voteInfo} = this.props
    const title = voteInfo.title
    const url = appConfig.CLIENT_DOMAIN + '/#/vote/'+ voteId
    wx.ready(function () {
      wx.onMenuShareTimeline({
        title: title,
        link: url,
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
          Toast.success('complete:' + res.errMsg)
        }
      })
      
      wx.onMenuShareAppMessage({
        title: title,
        link: url,
        imgUrl: voteInfo.cover? voteInfo.cover : voteInfo.coverSet[0],
        desc: '',
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
          Toast.success('complete:' + res.errMsg)
        }
      })
    })
  }

  renderApplyBtn() {
    const {voteInfo, onSwitchTab} = this.props
    if(voteInfo.status === VOTE_STATUS.STARTING) {
      return (
        <WingBlank>
          <Button type="primary" onClick={() => onSwitchTab('applyTab')}>我要报名</Button>
        </WingBlank>
      )
    } else {
      return(null)
    }
  }

  renderSearchBar() {
    return (
      <div className={styles.searchView}>
        <input placeholder="输入选手编号或姓名搜索" className={styles.searchInput} onChange={(e) => this.setState({searchKey: e.target.value})}/>
        <div className={styles.searchBtnView} onClick={this.onSearch}>
          <div className={styles.searchBtnText}>搜索</div>
        </div>
      </div>
    )
  }

  onSearch = () => {
    let searchKey = this.state.searchKey
    const {history, voteId} = this.props
    history.push('/searchPlayer/' + voteId + "/" + searchKey)
  }
  
  onCloseShareGuider = () => {
    this.setState({showShareGuider: false})
  }
  
  renderCoverImg() {
    const {voteInfo} = this.props
    if (voteInfo.cover) {
      return (
        <div className={styles.cover}>
          <img className={styles.img} src={voteInfo.cover} alt=""/>
        </div>
      )
    } else if (voteInfo.coverSet) {
      return (
        <div>
          <Carousel autoplay infinite selectedIndex={0}>
            {
              voteInfo.coverSet.map((value, index) => (
                <div key={index} className={styles.cover}>
                  <img className={styles.img} src={value} alt=""/>
                </div>
              ))
            }
          </Carousel>
        </div>
      )
    }
  }

  render() {
    const {voteInfo, history, activeUserId} = this.props
    document.title = voteInfo.title
    return (
      <div className={styles.page}>
        <NoticeBar marqueeProps={{ loop: true, style: { padding: '0 7.5px' } }}>
          {voteInfo.notice}
        </NoticeBar>
        {this.renderCoverImg()}
        <div className={styles.titleView}>
          <div className={styles.titleText}>{voteInfo.title}</div>
          <div className={styles.titleShareView} onClick={() => this.setState({showShareGuider: true})}>
            <div className={styles.titleShareArraw}></div>
            <div className={styles.titleBtnView} >
              <img className={styles.shareLogo} src={require('../../asset/images/share.png')} />
            </div>
          </div>
        </div>
        <WhiteSpace />
        <VoteStat applyNum={voteInfo.applyNum} voteNum={voteInfo.voteNum} pv={voteInfo.pv} />
        <Countdown counter={voteInfo.counter} />
        <WhiteSpace />
        {this.renderSearchBar()}
        {this.renderApplyBtn()}
        <WhiteSpace />
        <VotePlayers voteId={voteInfo.id} history={history} />
        <OrganizerView organizer={voteInfo.organizer} />
        <ManagerBtn voteId={voteInfo.id} show={voteInfo.creatorId === activeUserId} status={voteInfo.status} history={history} />
        <div className={styles.foot}>
          <div className={styles.logoView}>
            <img className={styles.img} src={require('../../asset/images/logo.png')} alt=""/>
            <div className={styles.xiaojee}>小吉互动</div>
          </div>
          <div className={styles.trip}>本活动由小吉互动提供技术支持</div>
        </div>
  
        <ShareGuider visible={this.state.showShareGuider}
                     onClose={this.onCloseShareGuider}
        />
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const voteId = ownProps.voteId
  return {
    activeUserId: authSelector.activeUserId(state),
    voteId,
    voteInfo: voteSelector.selectVote(state, voteId),
    entryURL: appStateSelector.selectEntryURL(state)
  }
}

const mapDispatchToProps = {
  ...appStateAction
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(VoteDetail))
