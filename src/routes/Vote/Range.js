/**
 * Created by wanpeng on 2017/12/26.
 */
import React from 'react'
import {connect} from 'react-redux'
import {Link, Route, withRouter, Switch} from 'react-router-dom'
import {Button, ActivityIndicator, List} from 'antd-mobile'
import {voteActions, voteSelector} from './redux'
import Countdown from '../../components/Countdown'
import moment from 'moment'
import styles from './range.module.scss'

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
    const {voteRankInfoList, voteInfo, history} = this.props
    const endTime = moment(voteInfo.startDate, 'YYYY-MM-DD').add(voteInfo.expire, 'days').format('YYYY-MM-DD')
    if(voteRankInfoList.length === 0) {
      return(
        <ActivityIndicator toast text="正在加载" />
      )
    }
    return (
      <div className={styles.container}>
        <Countdown time={endTime} counter={voteInfo.counter} />
        <List>
          {
            voteRankInfoList.map((value, index) => (
              <Item key={index}
                    thumb={this.renderThumb(value.album[0])}
                    extra={"第 " + (index + 1) + " 名"}
                    align="top"
                    onClick={() => {history.push('/vote/player/' + value.id)}}
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
    voteInfo,
    voteRankInfoList,
  }
}

const mapDispatchToProps = {
  ...voteActions
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Range))
