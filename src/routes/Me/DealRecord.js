/**
 * Created by wanpeng on 2018/1/6.
 */
import React from 'react'
import {connect} from 'react-redux'
import styles from './dealrecord.module.scss'
import {meActions, meSelector} from './redux'
import {Button} from 'antd-mobile'


class DealRecord extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      hasMore: false,
    }
  }

  componentWillMount() {
    let that = this
    const {fetchDealRecordAction} = this.props
    fetchDealRecordAction({
      limit: 10,
      success: (total) => {
        if(total === 10) {
          that.setState({hasMore: true})
        }
      }
    })
  }

  renderLoadMoreBtn = () => {
    const {hasMore} = this.state
    if(hasMore) {
      return(
        <div className={styles.loadmoreBtn}>
          <Button type="ghost" size="small" onClick={this.onLoadMoreRecord()}>加载更多</Button>
        </div>
      )
    }
  }

  onLoadMoreRecord = () => {
    let that = this
    const {fetchDealRecordAction, dealList} = this.props
    const lastTime = dealList[dealList.length - 1].createdAt
    fetchDealRecordAction({
      limit: 10,
      lastTime: lastTime,
      success: (total) => {
        if(total === 0) {
          that.setState({hasMore: false})
        }
      }
    })
  }

  renderDealType(dealType) {
    switch (dealType) {
      case 1:
        return "创建投票"
      case 2:
        return "余额充值"
      case 3:
        return "收益提现"
      case 4:
        return "购买礼品"
      case 5:
        return "活动收益"
      case 6:
        return "购买代理"
      case 7:
        return "邀请代理"
      default:
        return ""
    }
  }

  renderCost(value) {
    switch (value.dealType) {
      case 1:
        return(<div className={styles.content} style={{fontSize: '18px', fontWeight: 'bold', color: 'green'}}>¥{value.cost}</div>)
      case 2:
        return(<div className={styles.content} style={{fontSize: '18px', fontWeight: 'bold', color: 'red'}}>¥{value.cost}</div>)
      case 3:
        return(<div className={styles.content} style={{fontSize: '18px', fontWeight: 'bold', color: 'green'}}>¥{value.cost}</div>)
      case 4:
        return(<div className={styles.content} style={{fontSize: '18px', fontWeight: 'bold', color: 'green'}}>¥{value.cost}</div>)
      case 5:
        return(<div className={styles.content} style={{fontSize: '18px', fontWeight: 'bold', color: 'red'}}>¥{value.cost}</div>)
      case 6:
        return(<div className={styles.content} style={{fontSize: '18px', fontWeight: 'bold', color: 'green'}}>¥{value.cost}</div>)
      case 7:
        return(<div className={styles.content} style={{fontSize: '18px', fontWeight: 'bold', color: 'red'}}>¥{value.cost}</div>)
      default:
        return ""
    }
  }

  render() {
    const {dealList} = this.props
    return(
      <div className={styles.container}>
        {
          dealList.map((value, index) => (
            <div className={styles.recordItem} key={index}>
              <div className={styles.content}>
                <div className={styles.time}>{value.dealTime}</div>
                <div className={styles.title}>
                  {this.renderDealType(value.dealType)}
                </div>
              </div>
              {this.renderCost(value)}
            </div>
          ))
        }
        {this.renderLoadMoreBtn()}
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    dealList: meSelector.selectDealList(state),
  }
}

const mapDispatchToProps = {
  ...meActions,
}

export default connect(mapStateToProps, mapDispatchToProps)(DealRecord)

