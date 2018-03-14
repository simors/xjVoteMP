/**
 * Created by wanpeng on 2017/12/26.
 */
import React from 'react'
import {connect} from 'react-redux'
import {Link, Route, withRouter, Switch} from 'react-router-dom'
import Countdown from '../../components/Countdown'
import {voteSelector, VOTE_STATUS} from './redux'
import {NoticeBar, WhiteSpace, WingBlank, Button, Toast} from 'antd-mobile'
import styles from './votedetail.module.scss'
import VoteStat from '../../components/VoteStat'
import VotePlayers from './VotePlayers'
import OrganizerView from '../../components/OrganizerView'
import ManagerBtn from './ManagerBtn'
import {authSelector} from '../../utils/auth'
import VoteCover from '../../components/VoteCover'
import VoteTitle from '../../components/VoteTitle'

class VoteDetail extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      searchKey: ''
    }
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

  render() {
    const {voteInfo, history, activeUserId} = this.props
    document.title = voteInfo.title
    return (
      <div className={styles.page}>
        <NoticeBar marqueeProps={{ loop: true, style: { padding: '0 7.5px' } }}>
          {voteInfo.notice}
        </NoticeBar>
        <VoteCover voteInfo={voteInfo}/>
        <VoteTitle title={voteInfo.title}/>
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
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const voteId = ownProps.voteId
  return {
    activeUserId: authSelector.activeUserId(state),
    voteId,
    voteInfo: voteSelector.selectVote(state, voteId)
  }
}

const mapDispatchToProps = {
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(VoteDetail))
