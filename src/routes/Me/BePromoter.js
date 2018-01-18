/**
 * Created by wanpeng on 2017/12/25.
 */
import React from 'react'
import {connect} from 'react-redux'
import {Link, Route, withRouter, Switch} from 'react-router-dom'
import {Button, WingBlank, Toast} from 'antd-mobile'
import styles from './bepromoter.module.scss'
import pingpp from 'pingpp-js'
import {voteActions, voteSelector} from '../Vote/index'
import {authSelector} from '../../utils/auth'
import {DEAL_TYPE, meActions} from './redux'

class BePromoter extends React.PureComponent {
  constructor(props) {
    document.title = "我要代理"
    super(props)
    this.state = {
      price: undefined,
      payDisabled: false,
    }
  }

  componentWillMount() {
    let that = this
    const {fetchAgentPriceAction} = this.props
    fetchAgentPriceAction({
      success: (price) => {
        that.setState({price: price})
      }
    })
  }

  onPayment = () => {
    this.setState({payDisabled: true})
    const {createPaymentRequestAction, currentUser, inviterId} = this.props
    const openid = currentUser.authData.weixin.openid
    if(this.state.price > 0) {
      createPaymentRequestAction({
        amount: this.state.price,
        metadata: {
          'fromUser': currentUser.id,
          'toUser': 'platform',
          'dealType': DEAL_TYPE.AGENT_PAY,
          'inviter': inviterId,
        },
        openid: openid,
        subject: '创建投票活动',
        success: this.createPaymentRequestSuccess,
        error: this.createPaymentRequestError,
      })
    }
  }

  createPaymentRequestSuccess = (charge) => {
    let that = this
    const {history} = this.props
    pingpp.createPayment(charge, function (result, err) {
      that.setState({payDisabled: false})
      if (result == "success") {
        Toast.success("支付成功", 1)
        history.goBack()
      } else if (result == "fail") {
        Toast.fail("支付失败", 2)
      } else if (result == "cancel") {
        Toast.info("取消支付", 1)
      }
    })
  }

  createPaymentRequestError = (error) => {
    this.setState({payDisabled: false})
    Toast.fail("创建支付请求失败")
  }


  render() {
    return (
      <div className={styles.container}>
        <div className={styles.imageView}>
          <img className={styles.img} src='http://ac-l3cae9l7.clouddn.com/df6b6d06d3055ae0a58b.png' alt=""/>
        </div>
        <div className={styles.tripView}>
          成为代理可以获得投票收益哦！扫描二维码或搜索小吉互动公众号关注了解详情
        </div>
        <div className={styles.mpView}>
          <img className={styles.img} src="http://ac-l3cae9l7.clouddn.com/b17d267c395e5453ecb4.jpeg" alt=""/>
        </div>
        <WingBlank>
          <Button disabled={this.state.payDisabled} type="primary" onClick={this.onPayment}>
            开通代理
          </Button>
        </WingBlank>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    currentUser: authSelector.activeUserInfo(state),
  }
}

const mapDispatchToProps = {
  ...voteActions,
  ...meActions,
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BePromoter))
