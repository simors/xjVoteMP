/**
 * Created by yangyang on 2017/9/3.
 */
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link, Route, withRouter, Switch} from 'react-router-dom'
import {Button, TabBar} from 'antd-mobile'
import styles from './home.module.scss'
import Me from '../Me'
import VoteListPage from '../Vote'


class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedTab: 'homeTab',
      hidden: false,
      fullScreen: true,
    }
  }

  render() {
    const {history} = this.props
    return (
      <div className={styles.page}>
        <TabBar tintColor="#F6635F" hidden={this.state.hidden}  >
          <TabBar.Item
            title="主页"
            key="Home"
            icon={<div className={styles.homeIcon} />}
            selectedIcon={<div className={styles.homeIconFill}/>}
            selected={this.state.selectedTab === 'homeTab'}
            onPress={() => {
              this.setState({
                selectedTab: 'homeTab',
              })
            }}
            data-seed="logId"
          >
            <VoteListPage history={history}/>
          </TabBar.Item>
          <TabBar.Item
            key="Add"
            icon={<div className={styles.plusIcon}/>}
            selectedIcon={<div className={styles.plusIcon}/>}
            selected={this.state.selectedTab === 'plusTab'}
            onPress={() => {
              history.push('/publish/type')
            }}
            data-seed="logId0"
          >
          </TabBar.Item>
          <TabBar.Item
            icon={<div className={styles.mineIcon}/>}
            selectedIcon={<div className={styles.mineIconFill}/>}
            title="我的"
            key="me"
            selected={this.state.selectedTab === 'mineTab'}
            onPress={() => {
              this.setState({
                selectedTab: 'mineTab',
              })
            }}
            data-seed="logId1"
          >
            <Me history={history} />
          </TabBar.Item>
        </TabBar>
      </div>
    )
  }
}

const mapStateToProps = (appState, ownProps) => {
  return {
  }
}

const mapDispatchToProps = {
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Home))
