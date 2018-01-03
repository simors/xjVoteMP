/**
 * Created by wanpeng on 2017/12/30.
 */
import React from 'react'
import styles from './votestat.module.scss'


export default class VoteStat extends React.PureComponent {
  constructor(props) {
    super(props)
  }

  render() {
    const {applyNum, voteNum, pv} = this.props
    return (
      <div className={styles.container}>
        <div className={styles.item}>
          <div className={styles.trip}>
            <img className={styles.img} src={require('../../asset/images/hot.png')} alt=""/>
            <div className={styles.text}>选手</div>
          </div>
          <div className={styles.num}>{applyNum}</div>
        </div>
        <div className={styles.item}>
          <div className={styles.trip}>
            <img className={styles.img} src={require('../../asset/images/hot.png')} alt=""/>
            <div className={styles.text}>累计投票</div>
          </div>
          <div className={styles.num}>{voteNum}</div>
        </div>
        <div className={styles.item} style={{borderRight: '0px'}}>
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

