/**
 * Created by wanpeng on 2017/12/29.
 */
import React from 'react'
import {connect} from 'react-redux'
import {Link, Route, withRouter, Switch} from 'react-router-dom'
import styles from './publish.module.scss'
import {Button, WhiteSpace, WingBlank, ImagePicker} from 'antd-mobile'
import ImageSelector from '../../components/ImageSelector'
import {publishAction, publishSelector} from './redux'

class Publish extends React.PureComponent {
  constructor(props) {
    super(props)
  }

  onNext = () => {
    const {history} = this.props
    history.push('/publish/organizer')
  }

  selectCover = () => {

  }

  render() {
    const {history} = this.props
    return (
      <div className={styles.page}>
        <ImageSelector count={2} onChange={this.selectCover} />
        <WingBlank>
          <Button type="primary" onClick={this.onNext}>下一步</Button>
        </WingBlank>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
  }
}

const mapDispatchToProps = {
  ...publishAction,
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Publish))
