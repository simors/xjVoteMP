/**
 * Created by yangyang on 2018/3/14.
 */
import React from 'react'
import ShareGuider from '../../components/ShareGuider'
import styles from './votetitle.module.scss'

export default class VoteTitle extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      showShareGuider: false
    }
  }
  
  onCloseShareGuider = () => {
    this.setState({showShareGuider: false})
  }
  
  onOpenShareGuider = (e) => {
    e.preventDefault()
    this.setState({showShareGuider: true})
  }
  
  render() {
    let {title} = this.props
    return (
      <div className={styles.titleView}>
        <div className={styles.titleText}>{title}</div>
        <div className={styles.titleShareView} onClick={this.onOpenShareGuider}>
          <div className={styles.titleShareArraw}></div>
          <div className={styles.titleBtnView} >
            <img className={styles.shareLogo} src={require('../../asset/images/share.png')} />
          </div>
        </div>
  
        <ShareGuider visible={this.state.showShareGuider}
                     onClose={this.onCloseShareGuider}
        />
      </div>
    )
  }
}