/**
 * Created by wanpeng on 2017/12/26.
 */
import React from 'react'
import {connect} from 'react-redux'
import {Link, Route, withRouter, Switch} from 'react-router-dom'
import {WhiteSpace, ActivityIndicator, List} from 'antd-mobile'
import {voteActions, voteSelector} from './redux'
import Countdown from '../../components/Countdown'
import styles from './range.module.scss'
import VoteCover from '../../components/VoteCover'
import VoteTitle from '../../components/VoteTitle'
import VoteStat from '../../components/VoteStat'

const Item = List.Item
const Brief = List.Item.Brief

class Range extends React.PureComponent {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    const {voteId, fetchVoteRankAction} = this.props
    fetchVoteRankAction({
      voteId: voteId,
    })
  }

  renderThumb(url) {
    return (
      <div className={styles.thumb}>
        <img className={styles.img} src={url} alt=""/>
      </div>
    )
  }

  render() {
    const {voteRankInfoList, voteInfo, history, voteId, onShare} = this.props
    if(!voteRankInfoList) {
      return(
        <ActivityIndicator toast text="正在加载" />
      )
    }
    return (
      <div className={styles.container}>
        <VoteCover voteInfo={voteInfo}/>
        <VoteTitle title={voteInfo.title} onShare={onShare}/>
        <WhiteSpace />
        <VoteStat applyNum={voteInfo.applyNum} voteNum={voteInfo.voteNum} pv={voteInfo.pv} />
        <WhiteSpace />
        <Countdown counter={voteInfo.counter} />
        <List>
          {
            voteRankInfoList.map((value, index) => (
              <Item key={index}
                    thumb={this.renderThumb(value.album[0])}
                    extra={"第 " + (index + 1) + " 名"}
                    align="top"
                    onClick={() => {history.push('/player/'+ voteId + '/' + value.id)}}
                    multipleLine
              >
                {value.number + '号 ' + value.name}
                <Brief>{value.declaration}</Brief>
                <Brief style={{color: 'red'}}>{'票数：' + value.voteNum}</Brief>
              </Item>
            ))
          }
        </List>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const voteId = ownProps.voteId
  let voteRankInfoList = voteSelector.selectVoteRankInfo(state, voteId)
  let voteInfo = voteSelector.selectVote(state, voteId)
  return {
    voteId,
    voteInfo,
    voteRankInfoList,
  }
}

const mapDispatchToProps = {
  ...voteActions
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Range))
