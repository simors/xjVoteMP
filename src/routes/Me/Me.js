/**
 * Created by wanpeng on 2017/12/25.
 */
import React from 'react'
import {connect} from 'react-redux'
import styles from './me.module.scss'
import {authSelector} from '../../utils/auth'

class Me extends React.PureComponent {
  constructor(props) {
    super(props)
  }

  render() {
    const {activeUser} = this.props
    console.log("activeUser::", activeUser)
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <img className={styles.avatar} src={activeUser.avatar} alt=""/>
          <div className={styles.nickname}>{activeUser.nickname}</div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    activeUser: authSelector.activeUserInfo(state)
  }
}

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(Me)
