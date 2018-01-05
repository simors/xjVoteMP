/**
 * Created by wanpeng on 2018/1/4.
 */
import React from 'react'
import styles from './gitfttrip.module.scss'

export default class GitfTrip extends React.PureComponent {
  constructor(props) {
    super(props)
  }

  render() {
    const {visible, message, onClose, gotoPresent} = this.props
    if(!visible) {
      return(null)
    }
    return(
      <div className={styles.modalStyle}>
        <div className={styles.trip}>
          <div className={styles.message}>{message}</div>
          <div className={styles.tripMsg}>给选手送礼物可以增加票数噢！</div>
          <div className={styles.presentView} onClick={() => gotoPresent()} >送礼物</div>
        </div>
        <div className={styles.closeView} onClick={() => onClose()}>
          <img className={styles.img} src={require('../../asset/images/close.png')} alt=""/>
        </div>

      </div>
    )
  }
}
