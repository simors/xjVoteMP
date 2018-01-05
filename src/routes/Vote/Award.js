/**
 * Created by wanpeng on 2017/12/26.
 */
import React from 'react'
import {connect} from 'react-redux'
import {Link, Route, withRouter, Switch} from 'react-router-dom'
import {Button, WhiteSpace, WingBlank} from 'antd-mobile'
import {voteSelector} from './redux'
import styles from './award.module.scss'

class Award extends React.PureComponent {
  constructor(props) {
    super(props)
  }

  render() {
    const {voteInfo} = this.props
    return (
      <div className={styles.container}>
        <div>
          {
            voteInfo.awards.map((value, index) => (
              <div key={index} className={styles.itemView}>
                <div className={styles.name}>
                  {value.awardName}
                </div>
                <div className={styles.photoView}>
                  <img className={styles.img} src={value.awardPhoto} alt=""/>
                </div>
                <div className={styles.winnerNum}>
                  <span >中奖人数</span>
                  <span className={styles.num}>{value.winnerNum}</span>
                  <span>人</span>
                </div>
                <div className={styles.description}>
                  {value.description}
                </div>
              </div>
            ))
          }
        </div>
        <div className={styles.rule}>
          <div className={styles.ruleTitle}>活动须知：</div>
          <WhiteSpace size="md" />
          <div className={styles.content}>{voteInfo.rule}</div>
        </div>
        <WhiteSpace />
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const voteId = ownProps.voteId
  let voteInfo = voteSelector.selectVote(state, voteId)
  return {
    voteInfo,
  }
}

const mapDispatchToProps = {

}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Award))
