/**
 * Created by wanpeng on 2018/1/3.
 */
import React from 'react'
import {connect} from 'react-redux'
import {Link, Route, withRouter, Switch} from 'react-router-dom'
import styles from './present.module.scss'
import {voteSelector, voteActions} from './redux'
import {ActivityIndicator, Button, WhiteSpace, WingBlank, Toast, Grid, Radio, Stepper} from 'antd-mobile'
import pingpp from 'pingpp-js'
import {DEAL_TYPE} from '../Me'
import {authSelector} from '../../utils/auth'
import PlayerStat from '../../components/PlayerStat'

class Present extends React.PureComponent {
  constructor(props) {
    super(props)
    document.title = '送礼物'
    this.state = {
      payDisabled: false,
      giftId: undefined,
      giftNum: 1,
      checkedGift: undefined,
    }
  }

  componentWillMount() {
    const {voteId, playerId, fetchVoteGiftsAction} = this.props
    fetchVoteGiftsAction({
      voteId: voteId,
    })
  }

  onPayment = () => {
    this.setState({payDisabled: true})
    const {createPaymentRequestAction, playerId, currentUser, voteId} = this.props
    const {giftId, giftNum, checkedGift} = this.state
    const openid = currentUser.authData.weixin.openid
    if(!checkedGift) {
      Toast.fail("请选择礼品")
      this.setState({payDisabled: false})
      return
    }
    createPaymentRequestAction({
      amount: giftNum * checkedGift.price,
      metadata: {
        'fromUser': currentUser.id,
        'toUser': 'platform',
        'dealType': DEAL_TYPE.BUY_GIFT,
        'voteId': voteId,
        'playerId': playerId,
        'giftId': giftId,
        'giftNum': giftNum,
        'ballot': giftNum * checkedGift.ballot,
      },
      openid: openid,
      subject: '赠送礼品',
      success: this.createPaymentRequestSuccess,
      error: this.createPaymentRequestError,
    })
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

  renderItem = (dataItem) => {
    return(
      <div className={styles.giftItem}>
        <img className={styles.img} src={dataItem.photo} alt=""/>
        <div className={styles.name}>{dataItem.name}</div>
        <div className={styles.price}>{dataItem.price}点</div>
        <Radio className={styles.radio} checked={this.state.giftId === dataItem.id}
               onChange={() => this.onChangeGift(dataItem)} />
      </div>
    )
  }

  renderTrip() {
    const {checkedGift} = this.state
    if(checkedGift) {
      return(
        <div className={styles.trip}>
          <div className={styles.selected}>已选择{checkedGift.name}，单价{checkedGift.price}元可抵{checkedGift.ballot}票</div>
        </div>
      )
    } else {
      return(
        <div className={styles.trip}>
          <div className={styles.unSelected}>未选择礼物</div>
        </div>
      )
    }
  }

  onChangeGift(dataItem) {
    this.setState({giftId: dataItem.id, checkedGift: dataItem})
  }

  render() {
    const {giftList, playerInfo} = this.props
    const {payDisabled, giftNum} = this.state
    if(!giftList || giftList.length === 0) {
      return(<ActivityIndicator toast text="正在加载"/>)
    }
    return(
      <div className={styles.container}>
        <div className={styles.header}>
          <img className={styles.img} src={playerInfo.album[0]} alt=""/>
          <div className={styles.name}>{playerInfo.name}</div>
        </div>
        <WhiteSpace />
        <PlayerStat number={playerInfo.number} voteNum={playerInfo.voteNum} giftNum={playerInfo.giftNum} pv={playerInfo.pv} />
        <WingBlank>
          <WhiteSpace />
          <div className={styles.giftTitle}>「礼品列表」</div>
          <Grid
            activeStyle={false}
            data={giftList}
            renderItem={this.renderItem}
            columnNum={3}
            hasLine={false}
            square={false}
          />
          {this.renderTrip()}
        </WingBlank>
        <div className={styles.giftNum}>
          <div className={styles.title}>购买数量：</div>
          <Stepper
            showNumber
            max={1000}
            min={1}
            defaultValue={giftNum}
            onChange={(value) => this.setState({giftNum: value})}
          />
          <WhiteSpace />
        </div>
        <WingBlank>
          <Button disabled={payDisabled} type="primary" onClick={this.onPayment}>微信支付</Button>
        </WingBlank>
        <WhiteSpace />
      </div>
    )
  }
}


const mapStateToProps = (state, ownProps) => {
  const {location} = ownProps
  const {playerId, voteId} = location.query
  let playerInfo = voteSelector.selectPlayer(state, playerId)
  let giftList = voteSelector.selectVoteGiftList(state, voteId)
  return {
    currentUser: authSelector.activeUserInfo(state),
    voteId,
    playerId,
    playerInfo,
    giftList,
  }
}

const mapDispatchToProps = {
  ...voteActions,
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Present))

