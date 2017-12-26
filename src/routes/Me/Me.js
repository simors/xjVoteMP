/**
 * Created by wanpeng on 2017/12/25.
 */
import React from 'react'
import {connect} from 'react-redux'
import styles from './me.module.scss'
import {authSelector} from '../../utils/auth'
import {WingBlank, WhiteSpace, List} from 'antd-mobile'

const Item = List.Item

class Me extends React.PureComponent {
  constructor(props) {
    super(props)
  }

  render() {
    const {activeUser, history} = this.props
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <img className={styles.avatar} src={activeUser.avatar} alt=""/>
          <div className={styles.nickname}>{activeUser.nickname}</div>
        </div>
        <WhiteSpace />
        <List>
          <Item thumb={require('../../asset/images/vote.png')} arrow="horizontal"
                onClick={() => {history.push('/myVote')}}>
            我的投票
          </Item>
          <Item thumb={require('../../asset/images/wallet.png')} arrow="horizontal"
                onClick={() => {history.push('/wallet')}}>
            我的钱包
          </Item>
          <Item thumb={require('../../asset/images/promotion.png')} arrow="horizontal"
                onClick={() => {history.push('/bePromoter')}}>
            我要代理
          </Item>
        </List>
        <WhiteSpace size="xl" />
        <WingBlank>
          <div className={styles.trip}>
            小吉互动是一款专业的互联网投票软件，用户可自主创建投票活动，自主运营，并且运营过程中产生的收益可以直接提现到微信钱包！
          </div>
        </WingBlank>
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
