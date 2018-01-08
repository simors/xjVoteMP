/**
 * Created by wanpeng on 2017/12/25.
 */
import React from 'react'
import {connect} from 'react-redux'
import {Link, Route, withRouter, Switch} from 'react-router-dom'
import {Button, ActivityIndicator, WhiteSpace, WingBlank} from 'antd-mobile'
import {meActions, meSelector} from './redux'
import DealRecord from '../../components/DealRecord'
import styles from './wallet.module.scss'

class Wallet extends React.PureComponent {
  constructor(props) {
    document.title = "钱包"
    super(props)
  }

  componentWillMount() {
    const {fetchWalletInfoAction} = this.props
    fetchWalletInfoAction()
  }


  render() {
    const {walletInfo, history} = this.props
    if(!walletInfo) {
      return(<ActivityIndicator toast text="正在加载" />)
    }
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.trip}>余额</div>
          <div className={styles.balance}>{'¥ ' + walletInfo.balance + '元'}</div>
        </div>
        <WhiteSpace />
        <WingBlank>
          <Button type="primary" onClick={() => history.push('/withdraw')}>提现到微信</Button>
        </WingBlank>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    walletInfo: meSelector.selectWallet(state)
  }
}

const mapDispatchToProps = {
    ...meActions,
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Wallet))
