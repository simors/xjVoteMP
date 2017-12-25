/**
 * Created by wanpeng on 2017/12/23.
 */
import React from 'react'
import {connect} from 'react-redux'
import {withRouter, Redirect} from 'react-router-dom'
import {Result, Icon} from 'antd-mobile'
import styles from './error.module.scss'

class ErrorPage extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className={styles.page}>
        <Result
          img={<Icon type="cross-circle-o" className={styles.icon}/>}
          title="操作失败"
          message="错误提示信息"
        />
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ErrorPage));
