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
    const {visible, message, onClose, onShare} = this.props
    if(!visible) {
      return(null)
    }
    return(
      <div className={styles.modalStyle}>
        <div className={styles.trip}>
          <div className={styles.message}>{message}</div>
          <div className={styles.tripMsg}>一次可以转发9个群哦！</div>
          <div className={styles.presentView} onClick={() => {onClose();onShare()}} >为我拉票</div>
          <div className={styles.closeView} onClick={() => onClose()}>
            <img className={styles.img} src={require('../../asset/images/close.png')} alt=""/>
          </div>
          <div>
            <img style={{width: '100%', position: 'absolute', top: 0, left: 0}} src={require('../../asset/images/popup_help.png')} alt=""/>
          </div>
        </div>
      </div>
    )
  }
}
