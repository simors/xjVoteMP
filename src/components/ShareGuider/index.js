/**
 * Created by yangyang on 2018/3/9.
 */
import React from 'react'
import styles from './shareguider.module.scss'

export default class ShareGuider extends React.PureComponent {
  constructor(props) {
    super(props)
  }
  
  render() {
    const {visible, onClose} = this.props
    if(!visible) {
      return null
    }
    
    return (
      <div className={styles.shareGuiderPage} onClick={() => onClose()}>
        <div>一次可以转发9个群哦！</div>
      </div>
    )
  }
}