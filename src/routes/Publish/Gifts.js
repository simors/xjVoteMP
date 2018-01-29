/**
 * Created by wanpeng on 2017/12/27.
 */
import React from 'react'
import {connect} from 'react-redux'
import {Link, Route, withRouter, Switch} from 'react-router-dom'
import styles from './gifts.module.scss'
import {Button, Grid, WhiteSpace, WingBlank, Radio, Toast} from 'antd-mobile'
import {voteActions, voteSelector, VOTE_STATUS} from '../Vote'
import {publishAction, publishSelector} from './redux'
import PublishTrip from './PublishTrip'
import {authSelector} from '../../utils/auth'

class Gifts extends React.Component {
  constructor(props) {
    document.title = "礼品及期限"
    super(props)
    this.state = {
      showPublishTrip: false,
      selectGifts: [],
    }
  }

  componentWillMount() {
    const {fetchGiftsAction} = this.props
    fetchGiftsAction({
      success: () => {},
      error: (error) => {}
    })
  }

  onBack = () => {
    const {history, createOrUpdatePublishingVoteAction, publishVote} = this.props
    let {selectGifts} = this.state
    createOrUpdatePublishingVoteAction({
      ...publishVote,
      gifts: selectGifts,
    })
    history.goBack()
  }

  onComplete = () => {
    const {showPublishTrip, selectGifts} = this.state
    const {activeUser} = this.props
    if(selectGifts.length === 0) {
      Toast.fail("没有选择礼品")
      return
    }
    if(activeUser.agentLevel === 1) {
      this.setState({showPublishTrip: !showPublishTrip})
    } else {
      this.onSubmit()
    }
  }

  onSubmit = () => {
    Toast.loading("正在提交")
    const {history, createOrUpdatePublishingVoteAction, clearPublishingVoteAction, publishVote} = this.props
    let {selectGifts} = this.state
    createOrUpdatePublishingVoteAction({
      ...publishVote,
      gifts: selectGifts,
      status: VOTE_STATUS.WAITING,
      success: () => {
        Toast.hide()
        Toast.success('提交成功')
        history.replace('/')
        clearPublishingVoteAction()
      },
      error: () => {
        Toast.hide()
        Toast.fail("提交失败")
      }
    })
  }

  onClickRadio(giftId) {
    let selectGifts = this.state.selectGifts
    if(selectGifts.length === 6) {
      Toast.fail("最多6个礼品")
      return
    }
    if(selectGifts.includes(giftId)) {
      this.setState({selectGifts: selectGifts.filter(value => value != giftId)})
    } else {
      selectGifts.push(giftId)
      this.setState({selectGifts: selectGifts})
    }
  }

  renderItem = (dataItem) => {
    return(
      <div className={styles.giftItem}>
        <img className={styles.img} src={dataItem.photo} alt=""/>
        <div className={styles.name}>{dataItem.name}</div>
        <div className={styles.price}>{dataItem.price}点</div>
        <Radio className={styles.radio}
               checked={this.state.selectGifts.includes(dataItem.id)}
               onChange={() => this.onClickRadio(dataItem.id)} />
      </div>
    )
  }

  render() {
    const {gifts} = this.props
    return (
      <div className={styles.container}>
        <div className={styles.trip}>
          <text className={styles.tripText}>提示：选择下方礼品，最多选择6个！</text>
        </div>
        <WingBlank>
          <WhiteSpace />
          <Grid
            activeStyle={false}
            data={gifts}
            renderItem={this.renderItem}
            columnNum={3}
            hasLine={false}
            square={false}
          />
        </WingBlank>
        <WingBlank style={{marginTop: '20px', paddingBottom: '30px', textAlign: 'right'}}>
          <Button type="primary" style={{marginRight: '10px'}} inline size="small" onClick={this.onBack}>上一步</Button>
          <Button type="primary" inline size="small" onClick={this.onComplete}>完成</Button>
        </WingBlank>
        <PublishTrip visible={this.state.showPublishTrip}
                     onClose={() => this.setState({showPublishTrip: false})} onSubmit={this.onSubmit}/>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    activeUser: authSelector.activeUserInfo(state),
    gifts: voteSelector.selectTotalGift(state),
    publishVote: publishSelector.selectPublishVote(state)
  }
}

const mapDispatchToProps = {
  ...voteActions,
  ...publishAction,
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Gifts))
