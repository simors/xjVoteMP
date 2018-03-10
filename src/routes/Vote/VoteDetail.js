/**
 * Created by wanpeng on 2017/12/26.
 */
import React from 'react'
import {connect} from 'react-redux'
import {Link, Route, withRouter, Switch} from 'react-router-dom'
import Countdown from '../../components/Countdown'
import {voteSelector, VOTE_STATUS} from './redux'
import {NoticeBar, WhiteSpace, WingBlank, SearchBar, Button, Carousel} from 'antd-mobile'
import styles from './votedetail.module.scss'
import VoteStat from '../../components/VoteStat'
import VotePlayers from './VotePlayers'
import OrganizerView from '../../components/OrganizerView'
import ManagerBtn from './ManagerBtn'
import {authSelector} from '../../utils/auth'

class VoteDetail extends React.PureComponent {
  constructor(props) {
    super(props)
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
    const {voteInfo} = this.props
    if(voteInfo.applyNum === 0) {
      return(null)
    }
    return(
      <WingBlank>
        <SearchBar
          placeholder="选手编号或姓名"
          onSubmit={this.onSearch}
          maxLength={10}
        />
      </WingBlank>
    )
  }

  onSearch = (searchKey) => {
    const {history, voteId} = this.props
    history.push('/searchPlayer/' + voteId + "/" + searchKey)
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
    return (
      <div className={styles.page}>
        <NoticeBar marqueeProps={{ loop: true, style: { padding: '0 7.5px' } }}>
          {voteInfo.notice}
        </NoticeBar>
        {this.renderCoverImg()}
        <div className={styles.title}>{voteInfo.title}</div>
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
    voteInfo: voteSelector.selectVote(state, voteId),
  }
}

const mapDispatchToProps = {

}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(VoteDetail))
