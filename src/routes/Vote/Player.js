/**
 * Created by wanpeng on 2018/1/3.
 */
import React from 'react'
import {connect} from 'react-redux'
import {Link, Route, withRouter, Switch} from 'react-router-dom'
import {TabBar, Button, WhiteSpace, WingBlank, Toast} from 'antd-mobile'
import styles from './player.module.scss'
import {voteSelector, voteActions} from './redux'
import PlayerStat from '../../components/PlayerStat'
import * as errno from '../../utils/errno'
import GitfTrip from '../../components/GiftTrip'
import wx from 'tencent-wx-jssdk'
import {appStateAction} from '../../utils/appstate'

const Item = TabBar.Item

class Player extends React.PureComponent {
  constructor(props) {
    super(props)
    document.title = '投票'
    this.state = {
      selectedTab: 'detailTab',
      showGitfTrip: false,
      tripMsg: '',
    }
  }

  componentWillMount() {
    const {getJsApiConfig} = this.props
    getJsApiConfig({
      debug: __DEV__? true: false,
      jsApiList: ['chooseImage', 'previewImage', 'getLocalImgData'],
      url: window.location.href,
      success: this.getJsApiConfigSuccess,
      error: (error) => {console.log(error)}
    })
  }

  getJsApiConfigSuccess = (configInfo) => {
    wx.config(configInfo)
    console.log("wxjs_is_wkwebview:", window.__wxjs_is_wkwebview)
  }

  gotoShare = () => {
    const {playerInfo} = this.props
    const title = playerInfo.number + '号 ' + playerInfo.name + '，邀请您参与投票'
    const url =
    wx.ready(function () {
      wx.onMenuShareTimeline({
        title: title,
        link: 'http://www.baidu.com',
        imgUrl: playerInfo.album[0],
        success: function () {

        },
        cancel: function () {

        }
      })
    })
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
        <WingBlank className={styles.share}>
          <Button type="primary" onClick={this.gotoShare}>为TA拉票</Button>
        </WingBlank>
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
          tripMsg: '今天的选票已经用完啦！尝试送个礼物吧！',
        })
      }, 2000)
    } else if(error.code === errno.ERROR_VOTE_WAS_DONE) {
      Toast.fail('活动已结束')
    }
  }

  gotoPresent = () => {
    const {history, playerId} = this.props
    history.push('/vote/player/present/' + playerId)
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
                  gotoPresent={this.gotoPresent}
        />
      </div>

    )
  }

}

const mapStateToProps = (state, ownProps) => {
  const {match} = ownProps
  const {playerId} = match.params
  let playerInfo = voteSelector.selectPlayer(state, playerId)
  return {
    playerId,
    playerInfo,
  }
}

const mapDispatchToProps = {
  ...voteActions,
  ...appStateAction,
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Player))

