/**
 * Created by wanpeng on 2018/1/18.
 */
import React from 'react'
import {connect} from 'react-redux'
import {Link, Route, withRouter, Switch} from 'react-router-dom'
import {Button, WingBlank, Toast} from 'antd-mobile'
import styles from './invite.module.scss'

class Invite extends React.PureComponent {
  constructor(props) {
    document.title = "邀请代理"
    super(props)
  }

  render() {
    return(
      <div className={styles.container}>
        <div className={styles.imageView}>
          <img className={styles.img} src="http://ac-l3cae9l7.clouddn.com/9b8514cffb7b4d9e2395.png" alt=""/>
        </div>
        <WingBlank style={{marginTop: '50px'}}>
          <Button type="primary">分享给好友</Button>
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
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Invite))


