/**
 * Created by wanpeng on 2018/1/22.
 */
import React from 'react'
import {Button, Radio, WingBlank} from 'antd-mobile'
import styles from './publishtype.module.scss'

export default class PublishType extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      selectedType: 'gift',
    }
  }

  onSelect(type) {
    this.setState({selectedType: type})
  }

  gotoPublish(type) {
    const {history} = this.props
    history.push({
      pathname: '/publish',
      query: {
        type: type === 'gift'? 1 : 2,
      }
    })
  }

  render() {
    return(
      <div className={styles.container}>
        <div className={styles.imageView}>
          <img className={styles.img} src={require('../../asset/images/select_vote.png')} alt=""/>
        </div>
        <div className={styles.typeView}>
          <text className={styles.title}>选择投票类型</text>
          <div className={styles.tripItem} onClick={() => this.onSelect('gift')}>
            <Radio.RadioItem className={styles.radio} key='gift'
                             checked={this.state.selectedType === 'gift'}>有礼品投票</Radio.RadioItem>
          </div>
          <div className={styles.tripItem} onClick={() => this.onSelect('noGift')}>
            <Radio.RadioItem className={styles.radio} key='noGift'
                             checked={this.state.selectedType === 'noGift'}>无礼品投票</Radio.RadioItem>
          </div>
        </div>
        <WingBlank className={styles.btnView}>
          <Button type="primary" onClick={() => this.gotoPublish('gift')}>下一步</Button>
        </WingBlank>
        <div className={styles.tripView}>
          <text className={styles.trip}>提示：有礼品投票需要通过授权才能开通，详情请咨询客服；无礼品投票可免费创建。所有投票活动都必须保证真实合法！两种模式都全程提供免费人工协助！</text>
        </div>

      </div>
    )
  }
}

