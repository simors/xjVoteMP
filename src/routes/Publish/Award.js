/**
 * Created by wanpeng on 2017/12/27.
 */
import React from 'react'
import {connect} from 'react-redux'
import {Link, Route, withRouter, Switch} from 'react-router-dom'
import styles from './organizer.module.scss'
import {Button} from 'antd-mobile'

class Award extends React.PureComponent {
  constructor(props) {
    super(props)
  }

  onBack = () => {
    const {history} = this.props
    history.goBack()
  }

  onNext = () => {
    const {history} = this.props
    history.push('/publish/gifts')
  }

  render() {
    const {onBack, onNext} = this.props
    return (
      <div>
        <Button>Award</Button>
        <Button onClick={this.onBack}>上一步</Button>
        <Button onClick={this.onNext}>下一步</Button>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
  }
}

const mapDispatchToProps = {

}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Award))
