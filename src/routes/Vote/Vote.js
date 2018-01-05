/**
 * Created by wanpeng on 2017/12/26.
 */
import React from 'react'
import {connect} from 'react-redux'
import {Link, Route, withRouter, Switch} from 'react-router-dom'
import {Button, TabBar} from 'antd-mobile'
import styles from './vote.module.scss'
import VoteDetail from './VoteDetail'
import Apply from './Apply'
import Award from './Award'
import Range from './Range'
import {voteSelector} from './redux'

const Item = TabBar.Item

class Vote extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      selectedTab: 'homeTab',
    }
  }

  render() {
    const {voteId, history} = this.props
    return (
      <div className={styles.page}>
        <TabBar tintColor="#F6635F">
          <Item
            title="活动主页"
            key="Home"
            icon={<div className={styles.homeIcon} />}
            selectedIcon={<div className={styles.homeIconFill}/>}
            selected={this.state.selectedTab === 'homeTab'}
            onPress={() => {
              this.setState({
                selectedTab: 'homeTab',
              })
            }}
          >
            <VoteDetail id={voteId} history={history} />
          </Item>
          <Item
            title="报名"
            key="apply"
            icon={<div className={styles.applyIcon} />}
            selectedIcon={<div className={styles.applyIconFill}/>}
            selected={this.state.selectedTab === 'applyTab'}
            onPress={() => {
              this.setState({
                selectedTab: 'applyTab',
              })
            }}
          >
            <Apply />
          </Item>
          <Item
            title="奖品"
            key="prize"
            icon={<div className={styles.prizeIcon} />}
            selectedIcon={<div className={styles.prizeIconFill}/>}
            selected={this.state.selectedTab === 'prizeTab'}
            onPress={() => {
              this.setState({
                selectedTab: 'prizeTab',
              })
            }}
          >
            <Award voteId={voteId} />
          </Item>
          <Item
            title="榜单"
            key="range"
            icon={<div className={styles.rangeIcon} />}
            selectedIcon={<div className={styles.rangeIconFill}/>}
            selected={this.state.selectedTab === 'rangeTab'}
            onPress={() => {
              this.setState({
                selectedTab: 'rangeTab',
              })
            }}
          >
            <Range />
          </Item>
        </TabBar>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const {match} = ownProps
  const {voteId} = match.params
  return {
    voteId,
  }
}

const mapDispatchToProps = {

}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Vote))
