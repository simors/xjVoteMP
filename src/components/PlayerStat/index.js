/**
 * Created by wanpeng on 2018/1/3.
 */
import React from 'react'
import styles from './playerstat.module.scss'

export default class PlayerStat extends React.PureComponent {
  constructor(props) {
    super(props)
  }

  render() {
    const {number, voteNum, giftNum, pv} = this.props
    return (
      <div className={styles.container}>
        <div className={styles.item}>
          <div className={styles.trip}>
            <img className={styles.img} src={require('../../asset/images/hot.png')} alt=""/>
            <div className={styles.text}>编号</div>
          </div>
          <div className={styles.num}>{number}</div>
        </div>
        <div className={styles.item}>
          <div className={styles.trip}>
            <img className={styles.img} src={require('../../asset/images/hot.png')} alt=""/>
            <div className={styles.text}>票数</div>
          </div>
          <div className={styles.num}>{voteNum}</div>
        </div>
        <div className={styles.item}>
          <div className={styles.trip}>
            <img className={styles.img} src={require('../../asset/images/hot.png')} alt=""/>
            <div className={styles.text}>礼物</div>
          </div>
          <div className={styles.num}>{giftNum}</div>
        </div>
        <div className={styles.item}>
          <div className={styles.trip}>
            <img className={styles.img} src={require('../../asset/images/hot.png')} alt=""/>
            <div className={styles.text}>热度</div>
          </div>
          <div className={styles.num}>{pv}</div>
        </div>
      </div>
    )
  }
}
