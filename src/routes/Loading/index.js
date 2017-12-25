/**
 * Created by wanpeng on 2017/12/22.
 */
import React from 'react'
import {connect} from 'react-redux'
import {withRouter, Redirect} from 'react-router-dom'
import styles from './loading.module.scss'
import {ActivityIndicator} from 'antd-mobile'
import {appStateSelector, appStateAction} from '../../utils/appstate'

class LoadingPage extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { from } = this.props.location.state || { from: { pathname: '/' } }
    if (this.props.isRehydrated) {
      return (
        <Redirect to={from}/>
      )
    }
    return (
      <div className={styles.page}>
        <ActivityIndicator toast text="正在加载" />
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let appState = appStateSelector.selectAppState(state)
  let isRehydrated = undefined
  if (appState) {
    isRehydrated = appState.isRehydrated
  }
  return {
    isRehydrated,
  }
}

const mapDispatchToProps = {
  ...appStateAction,
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LoadingPage));
