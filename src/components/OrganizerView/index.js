/**
 * Created by wanpeng on 2018/1/3.
 */
import React from 'react'
import styles from './organizerview.module.scss'
import {WingBlank, WhiteSpace} from 'antd-mobile'


export default class OrganizerView extends React.PureComponent {
  constructor(props) {
    super(props)
  }

  renderContent() {
    const {organizer} = this.props
    return(
      <WingBlank>
        {
          organizer.map((value, index) => {
            if(value.type === 'text') {
              return(
                <div key={index} className={styles.textView}>{value.content}</div>
              )
            } else if(value.type === 'image') {
              return(
                <div key={index} className={styles.imageView}>
                  <img className={styles.img} src={value.url} alt=""/>
                </div>
              )
            }
          })
        }
      </WingBlank>
    )
  }

  render() {
    return(
      <div className={styles.container}>
        <div className={styles.title}>
          <div className={styles.text}>主办方介绍</div>
        </div>
        <WhiteSpace />
        {this.renderContent()}
      </div>
    )
  }
}
