/**
 * Created by wanpeng on 2017/12/25.
 */
import React from 'react'
  import {connect} from 'react-redux'
import {Link, Route, withRouter, Switch} from 'react-router-dom'
import {Button, ActivityIndicator, WhiteSpace, WingBlank} from 'antd-mobile'
import {meActions, meSelector} from './redux'
import DealRecord from './DealRecord'
import styles from './wallet.module.scss'

class Wallet extends React.PureComponent {
  constructor(props) {
    document.title = "钱包"
    super(props)
  }

  componentWillMount() {
    const {fetchWalletInfoAction, fetchDealRecordAction} = this.props
    fetchWalletInfoAction({})
    fetchDealRecordAction({limit: 10})
  }


  render() {
    const {walletInfo, dealList, history} = this.props
    console.log("dealList", dealList)
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
        <DealRecord record={dealList} />
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    walletInfo: meSelector.selectWallet(state),
    dealList: meSelector.selectDealList(state),
  }
}

const mapDispatchToProps = {
    ...meActions,
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Wallet))
