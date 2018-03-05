/**
 * Created by wanpeng on 2018/1/3.
 */
import React from 'react'
import {connect} from 'react-redux'
import {Link, Route, withRouter, Switch} from 'react-router-dom'
import {TabBar, Button, WhiteSpace, WingBlank, Toast, ActionSheet} from 'antd-mobile'
import styles from './player.module.scss'
import {voteSelector, voteActions} from './redux'
import PlayerStat from '../../components/PlayerStat'
import * as errno from '../../utils/errno'
import GitfTrip from '../../components/GiftTrip'
import wx from 'tencent-wx-jssdk'
import {appStateAction, appStateSelector} from '../../utils/appstate'
import {getMobileOperatingSystem} from '../../utils/OS'
import appConfig from '../../utils/appConfig'


const Item = TabBar.Item

class Player extends React.PureComponent {
  constructor(props) {
    super(props)
    document.title = '投票'
    this.state = {
      selectedTab: 'detailTab',
      showGitfTrip: false,
      tripMsg: '',
      hasMore: false,
    }
  }

  componentWillMount() {
    let that = this
    const {playerId, fetchPlayerRecvGiftsAction, getJsApiConfig, entryURL} = this.props
    fetchPlayerRecvGiftsAction({
      playerId: playerId,
      limit: 10,
      success: (total) => {
        if(total === 10) {
          that.setState({hasMore: true})
        }
      },
    })
    const OS = getMobileOperatingSystem()
    let jssdkURL = window.location.href
    if(OS === 'iOS') {
      //微信JS-SDK Bug: SPA(单页应用)ios系统必须使用首次加载的url初始化jssdk
      jssdkURL = entryURL
    }
    getJsApiConfig({
      debug: __DEV__? true: true,
      jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'scanQRCode'].toString(),
      url: jssdkURL.split('#')[0],
      success: this.getJsApiConfigSuccess,
      error: (error) => {console.log(error)}
    })
  }

  getJsApiConfigSuccess = (configInfo) => {
    wx.config(configInfo)
  }

  wxShare(type) {
    const {playerInfo} = this.props
    // const title = playerInfo.number + '号 ' + playerInfo.name + '，邀请您参与投票'
    const title = '分享测试'
    // const url = appConfig.CLIENT_DOMAIN + '/vote/player/' + playerInfo.id
    const url = 'https://vote.xiaojee.cn/'
    if(type === 'timeline') {
      wx.ready(function () {
        wx.onMenuShareTimeline({
          title: title,
          link: url,
          // imgUrl: playerInfo.album[0],
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
    } else if(type === 'appMessage') {
      wx.ready(function () {
        wx.onMenuShareAppMessage({
          title: title,
          link: url,
          // imgUrl: playerInfo.album[0],
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
    } else if(type === 'scan') {
      wx.ready(function () {
        wx.scanQRCode({
          needResult: 0,
          scanType: ["qrCode","barCode"],
          success: function (res) {
          }
        })
      })
    } else if (type === 'QQ') {
      wx.ready(function () {
        wx.onMenuShareQQ({
          title: "分享",
          desc: "QQ分享测试",
          link: url,
          // imgUrl: playerInfo.album[0],
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
    }else {
      Toast.fail("无效到分享类型")
    }
  }

  dataList = [
    { url: 'cTTayShKtEIdQVEMuiWt', title: '朋友圈', type: 'timeline'},
    { url: 'umnHwvEgSyQtXlZjNJTt', title: '微信好友', type: 'appMessage'},
    { url: 'SxpunpETIwdxNjcJamwB', title: '扫一扫', type: 'scan' },
    { url: 'SxpunpETIwdxNjcJamwB', title: 'QQ', type: 'QQ' }
  ].map(obj => ({
    icon: <img src={`https://gw.alipayobjects.com/zos/rmsportal/${obj.url}.png`} alt={obj.title} style={{ width: 36 }}
               onClick={() => this.wxShare(obj.type)} />,
    title: obj.title,
  }));

  showShareActionSheet = () => {
    ActionSheet.showShareActionSheetWithOptions({
        options: this.dataList,
      },
      (buttonIndex) => {
        this.setState({ clicked1: buttonIndex > -1 ? this.dataList[buttonIndex].title : 'cancel' });
        // also support Promise
        return new Promise((resolve) => {
          setTimeout(resolve, 100);
        });
      });
  }

  onLoadMoreRecvGifts = () => {
    let that = this
    const {fetchPlayerRecvGiftsAction, playerId, playerGiftList} = this.props
    const lastTime = playerGiftList[playerGiftList.length - 1].createdAt
    fetchPlayerRecvGiftsAction({
      playerId: playerId,
      limit: 10,
      lastTime: lastTime,
      success: (total) => {
        if(total === 0) {
          that.setState({hasMore: false})
        }
      },
    })
  }

  renderLoadMoreBtn = () => {
    const {hasMore} = this.state
    if(hasMore) {
      return(
        <div className={styles.loadmoreBtn}>
          <Button type="ghost" size="small" onClick={this.onLoadMoreRecvGifts}>加载更多</Button>
        </div>
      )
    }
  }

  renderRecvGifts() {
    const {playerGiftList} = this.props
    return(
      <div>
        {
          playerGiftList.map((value, index) => (
            <WingBlank className={styles.recvItem} key={index}>
              <img className={styles.avatar} src={value.user.avatar} alt=""/>
              <div className={styles.itemBody}>
                <div>{value.user.nickname}送了{value.giftNum}个{value.gift.name}</div>
                <div className={styles.createdAt}>{value.createdAt}</div>
              </div>
            </WingBlank>
          ))
        }
        {
          this.renderLoadMoreBtn()
        }
      </div>
    )
  }

  renderContent() {
    const {playerInfo} = this.props
    return(
      <div>
        {
          playerInfo.album.map((value, index) => (
            <div key={index} className={styles.imageView}>
              <img className={styles.img} src={value} alt=""/>
            </div>
          ))
        }
        <div className={styles.headView}>
          <img className={styles.avatar} src={playerInfo.album[0]} alt=""/>
          <div>{playerInfo.name}</div>
        </div>
        <div className={styles.declaration}>
          {playerInfo.declaration}
        </div>
        <WhiteSpace />
        <PlayerStat number={playerInfo.number} voteNum={playerInfo.voteNum} giftNum={playerInfo.giftNum} pv={playerInfo.pv} />
        {this.renderRecvGifts()}
        <div style={{width: '100%', height: '50px'}}></div>
      </div>
    )
  }

  onCloseGitfTrip = () => {
    this.setState({showGitfTrip: false})
  }

  voteForPlayerActionSuccess = () => {
    let that = this
    Toast.success('投票成功', 2)
    setTimeout(function () {
      that.setState({
        showGitfTrip: true,
        tripMsg: '投票成功！每天可以投一票，明天继续参与哦！',
      })
    }, 2000)
  }

  voteForPlayerActionError = (error) => {
    if(error.code === errno.ERROR_VOTE_USE_UP) {
      Toast.fail('今日已投票', 2)
      let that = this
      setTimeout(function () {
        that.setState({
          showGitfTrip: true,
          tripMsg: '今天的选票已经用完啦！分享给其他小伙伴来支持我吧！',
        })
      }, 2000)
    } else if(error.code === errno.ERROR_VOTE_WAS_DONE) {
      Toast.fail('活动已结束')
    }
  }

  gotoPresent = () => {
    const {history, playerId, voteId} = this.props
    history.push({
      pathname: '/present',
      query: {
        voteId: voteId,
        playerId: playerId
      }
    })
  }



  render() {
    const {playerId, voteForPlayerAction} = this.props
    return (
      <div className={styles.page}>
        <TabBar>
          <Item
            title="详情"
            key="detail"
            icon={<div className={styles.homeIcon} />}
            selectedIcon={<div className={styles.homeIconFill}/>}
            selected={this.state.selectedTab === 'detailTab'}
            onPress={() => {
              this.setState({
                selectedTab: 'detailTab',
              })
            }}
          >
            {this.renderContent()}
          </Item>
          <Item
            title="投票"
            key="vote"
            icon={<div className={styles.voteIcon} />}
            selectedIcon={<div className={styles.voteIcon}/>}
            selected={this.state.selectedTab === 'voteTab'}
            onPress={() => {
              voteForPlayerAction({
                playerId: playerId,
                success: this.voteForPlayerActionSuccess,
                error: this.voteForPlayerActionError,
              })
            }}
          >
          </Item>
          <Item
            title="礼物"
            key="gift"
            icon={<div className={styles.giftIcon} />}
            selectedIcon={<div className={styles.giftIcon}/>}
            selected={this.state.selectedTab === 'giftTab'}
            onPress={this.gotoPresent}
          >
          </Item>
        </TabBar>
        <GitfTrip visible={this.state.showGitfTrip}
                  message={this.state.tripMsg}
                  onClose={this.onCloseGitfTrip}
                  onShare={this.showShareActionSheet}
        />
      </div>

    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const {match} = ownProps
  const {playerId, voteId} = match.params
  let playerInfo = voteSelector.selectPlayer(state, playerId)
  return {
    voteId,
    playerId,
    playerInfo,
    entryURL: appStateSelector.selectEntryURL(state),
    playerGiftList: voteSelector.selectPlayerRecvGiftList(state, playerId)
  }
}

const mapDispatchToProps = {
  ...voteActions,
  ...appStateAction,
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Player))

