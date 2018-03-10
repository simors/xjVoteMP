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
        <div style={{textAlign: 'center'}}>
          <img className={styles.tipImg} src="http://lc-l3cae9l7.cn-n1.lcfile.com/7f80988f3f44c9a587d3.png"/>
        </div>
      </div>
    )
  }
}