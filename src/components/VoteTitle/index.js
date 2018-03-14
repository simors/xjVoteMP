/**
 * Created by yangyang on 2018/3/14.
 */
import React from 'react'
import styles from './votetitle.module.scss'

export default class VoteTitle extends React.PureComponent {
  constructor(props) {
    super(props)
  }
  
  render() {
    let {title, onShare} = this.props
    return (
      <div className={styles.titleView}>
        <div className={styles.titleText}>{title}</div>
        <div className={styles.titleShareView} onClick={onShare}>
          <div className={styles.titleShareArraw}></div>
          <div className={styles.titleBtnView} >
            <img className={styles.shareLogo} src={require('../../asset/images/share.png')} />
          </div>
        </div>
      </div>
    )
  }
}