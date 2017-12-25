/**
 * Created by yangyang on 2017/9/3.
 */
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link, Route, withRouter, Switch} from 'react-router-dom'
import {Button, TabBar} from 'antd-mobile'
import styles from './home.module.scss'


class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedTab: 'homeTab',
    }
  }

  renderHome() {
    return (
      <div>

      </div>
    )
  }

  renderMine() {

  }


  render() {
    let {match} = this.props
    return (
      <div className={styles.page}>
        <TabBar tintColor="#F6635F"  >
          <TabBar.Item
            title="主页"
            key="Home"
            icon={<div className={styles.homeIcon} />}
            selectedIcon={<div className={styles.homeIconFill}/>}
            selected={this.state.selectedTab === 'mineTab'}
            onPress={() => {
              this.setState({
                selectedTab: 'mineTab',
              });
            }}
            data-seed="logId"
          >
            {this.renderHome()}
          </TabBar.Item>
          <TabBar.Item
            key="Add"
            icon={<div className={styles.plusIcon}/>}
            selectedIcon={<div className={styles.plusIcon}/>}
            selected={this.state.selectedTab === 'mineTab'}
            onPress={() => {}}
            data-seed="logId"
          >
          </TabBar.Item>

          <TabBar.Item
            icon={<div className={styles.mineIcon}/>}
            selectedIcon={<div className={styles.mineIconFill}/>}
            title="我的"
            key="mine"
            badge={'8'}
            selected={this.state.selectedTab === 'homeTab'}
            onPress={() => {
              this.setState({
                selectedTab: 'homeTab',
              });
            }}
            data-seed="logId1"
          >
            {this.renderMine()}
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
