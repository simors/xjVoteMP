/**
 * Created by wanpeng on 2018/1/6.
 */
import React from 'react'
import {connect} from 'react-redux'
import {Link, Route, withRouter, Switch} from 'react-router-dom'
import styles from './withdraw.module.scss'
import {Button, WingBlank, WhiteSpace, Steps, Toast} from 'antd-mobile'
import {meActions, meSelector} from './redux'
import DateTime from '../../utils/datetime'
import * as erron from '../../utils/errno'

const Step = Steps.Step;

class Withdraw extends React.PureComponent {
  constructor(props) {
    document.title = "收益提现"
    super(props)
    this.state = {
      lastWithdraw: undefined,
      amount: undefined,
      disabled: false,
    }
  }

  componentWillMount() {
    let that = this
    const {fetchLastWithdrawApplyAction} = this.props
    fetchLastWithdrawApplyAction({
      success: (lastWithdraw) => {
        that.setState({lastWithdraw: lastWithdraw})
      }
    })
  }

  renderLastWithdraw() {
    const {lastWithdraw} = this.state
    if(lastWithdraw) {
      let applyDate = DateTime.format(lastWithdraw.applyDate)
      return(
      <WingBlank>
        <div>已提交申请</div>
        <WhiteSpace />
        <Steps size="small" current={1}>
          <Step title={'请求提现' + lastWithdraw.amount + '元'} description={applyDate}/>
          <Step title='平台收到提现请求' description={applyDate}/>
          <Step title='等待平台处理'/>
        </Steps>
      </WingBlank>
      )
    }
  }

  onChangeAmount(value) {
    this.setState({amount: value})
  }

  onWithdraw = () => {
    const {requestWithdrawApplyAction, walletInfo, history} = this.props
    const {amount, lastWithdraw} = this.state
    if(amount <= 0) {
      Toast.fail('提现金额有误')
      return
    }
    if(walletInfo.balance < amount) {
      Toast.fail('账户余额不足')
      return
    }
    this.setState({disabled: true})
    requestWithdrawApplyAction({
      amount: amount,
      success: () => {
        Toast.success('提现申请成功', 1, () => {
          history.goBack()
        })
      },
      error: (error) => {
        this.setState({disabled: false})
        switch (error.code) {
          case erron.ERROR_NO_WECHAT:
            Toast.fail("没有微信授权")
            break
          case erron.ERROR_NOT_ENOUGH_MONEY:
            Toast.fail("余额不足")
            break
          case erron.ERROR_IN_WITHDRAW_PROCESS:
            Toast.fail("已存在提现申请")
            break
          default:
            Toast.fail("提现申请失败")
            break
        }
      }
    })

  }

  render() {
    const {lastWithdraw, disabled} = this.state
    return(
      <div className={styles.container}>
        <div className={styles.withdrawView}>
          <div className={styles.title}>取现金额</div>
          <div className={styles.inputView}>
            <text className={styles.cny}>¥</text>
            <input className={styles.input} type="number" placeholder="请输入提现金额" onChange={(value) => this.onChangeAmount(value)}/>
          </div>
          <div className={styles.trip}>申请取现后，将在3个工作日内打入您的微信钱包</div>
        </div>
        <WingBlank className={styles.btn}>
          <Button disabled={!!lastWithdraw || disabled} style={{backgroundColor: '#1AAD19', color: '#fff'}} onClick={this.onWithdraw}>确认提现</Button>
        </WingBlank>
        {this.renderLastWithdraw()}
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    walletInfo: meSelector.selectWallet(state),
  }
}

const mapDispatchToProps = {
  ...meActions,
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Withdraw))
