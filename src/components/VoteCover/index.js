/**
 * Created by yangyang on 2018/3/14.
 */
import React from 'react'
import {Carousel} from 'antd-mobile'
import styles from './votecover.module.scss'


export default class VoteCover extends React.PureComponent {
  constructor(props) {
    super(props)
  }
  
  render() {
    const {voteInfo} = this.props
    if (voteInfo.cover) {
      return (
        <div className={styles.cover}>
          <img className={styles.img} src={voteInfo.cover} alt=""/>
        </div>
      )
    } else if (voteInfo.coverSet) {
      return (
        <div>
          <Carousel autoplay infinite selectedIndex={0}>
            {
              voteInfo.coverSet.map((value, index) => (
                <div key={index} className={styles.cover}>
                  <img className={styles.img} src={value} alt=""/>
                </div>
              ))
            }
          </Carousel>
        </div>
      )
    }
  }
}