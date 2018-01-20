/**
 * Created by wanpeng on 2018/1/19.
 */
import React from 'react'
import styles from './managerBtn.module.scss'
import {connect} from 'react-redux'
import {voteActions, VOTE_STATUS} from './redux'
import {Toast} from 'antd-mobile'

class ManagerBtn extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      showMenu: false,

    }
  }

  toggleMenu() {
    this.setState({showMenu: !this.state.showMenu})
  }

  enableApply() {
    const { status, enablePlayerApplyAction, voteId} = this.props
    if(status === VOTE_STATUS.WAITING) {
      enablePlayerApplyAction({
        voteId: voteId,
        enable: false,
        success: () => {
          Toast.success("关闭报名成功")
        }
      })
    } else if(status === VOTE_STATUS.STARTING) {
      enablePlayerApplyAction({
        voteId: voteId,
        enable: true,
        success: () => {
          Toast.success("开启报名成功")
        }
      })
    }
  }

  gotoManagerPlayers = () => {
    const {history, voteId} = this.props
    history.push('/manPlayers/' + voteId)
  }

  renderApplyBtn() {
    const { status } = this.props
    if(status === 3 || status === 4) {
      return(
        <div className={styles.menuItem} onClick={() => {this.enableApply()}}>
          <text style={{fontSize: '16px', color: '#fff'}}>{status === 3 ? '关闭报名' : '开启报名'}</text>
        </div>
      )
    }
  }

  render() {
    const {show} = this.props
    const {showMenu} = this.state
    return(
      <div className={styles.container}>
        <div className={show? (showMenu? styles.dlgBtnView : styles.btnView) : styles.hideBtn} onClick={() => this.toggleMenu()}>
          <text style={{fontSize: '14px', color: '#fff'}}>{showMenu ? 'M' : '管理'}</text>
        </div>
        <div className={showMenu? styles.manMenu : styles.hideMenu}>
          <div className={styles.menuItem} onClick={this.gotoManagerPlayers}>
            <text style={{fontSize: '16px', color: '#fff'}}>选手管理</text>
          </div>
          {this.renderApplyBtn()}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (appState, ownProps) => {
  return {
  }
}

const mapDispatchToProps = {
  ...voteActions,
}

export default connect(mapStateToProps, mapDispatchToProps)(ManagerBtn)
