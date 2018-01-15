/**
 * Created by wanpeng on 2017/12/26.
 */
import React from 'react'
import {connect} from 'react-redux'
import {Link, Route, withRouter, Switch} from 'react-router-dom'
import Countdown from '../../components/Countdown'
import {voteSelector} from './redux'
import {NoticeBar, WhiteSpace, WingBlank, SearchBar, Button} from 'antd-mobile'
import styles from './votedetail.module.scss'
import VoteStat from '../../components/VoteStat'
import moment from 'moment'
import VotePlayers from './VotePlayers'
import OrganizerView from '../../components/OrganizerView'

class VoteDetail extends React.PureComponent {
  constructor(props) {
    super(props)
  }

  renderApplyBtn() {
    const {voteInfo, onSwitchTab} = this.props
    if(voteInfo.status) {
      return (
        <WingBlank>
          <Button type="primary" onClick={() => onSwitchTab('applyTab')}>我要报名</Button>
        </WingBlank>
      )
    } else {
      return(null)
    }
  }

  onSearch = () => {

  }

  render() {
    const {voteInfo, history} = this.props
    const endTime = moment(voteInfo.startDate, 'YYYY-MM-DD').add(voteInfo.expire, 'days').format('YYYY-MM-DD')
    return (
      <div className={styles.page}>
        <NoticeBar marqueeProps={{ loop: true, style: { padding: '0 7.5px' } }}>
          {voteInfo.notice}
        </NoticeBar>
        <div className={styles.cover}>
          <img className={styles.img} src={voteInfo.cover} alt=""/>
        </div>
        <div className={styles.title}>{voteInfo.title}</div>
        <WhiteSpace />
        <VoteStat applyNum={voteInfo.applyNum} voteNum={voteInfo.voteNum} pv={voteInfo.pv} />
        <Countdown time={endTime} counter={voteInfo.counter} />
        <WhiteSpace />
        <WingBlank>
          <SearchBar
            placeholder="选手编号或姓名"
            onSubmit={this.onSearch}
            maxLength={10}
          />
        </WingBlank>
        <WhiteSpace />
        {this.renderApplyBtn()}
        <WhiteSpace />
        <VotePlayers voteId={voteInfo.id} history={history} />
        <OrganizerView organizer={voteInfo.organizer} />
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
    voteInfo: voteSelector.selectVote(state, voteId)
  }
}

const mapDispatchToProps = {

}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(VoteDetail))