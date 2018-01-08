/**
 * Created by wanpeng on 2018/1/6.
 */
import React from 'react'
import {connect} from 'react-redux'
import {Link, Route, withRouter, Switch} from 'react-router-dom'
import styles from './withdraw.module.scss'
import {Button, WingBlank} from 'antd-mobile'
import {meActions} from './redux'

class Withdraw extends React.PureComponent {
  constructor(props) {
    document.title = "收益提现"
    super(props)
  }

  render() {
    return(
      <div className={styles.container}>
        <div className={styles.withdrawView}>
        </div>
        <WingBlank>
          <Button type="primary">确认提现</Button>
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
  ...meActions,
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Withdraw))
