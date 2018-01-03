/**
 * Created by wanpeng on 2017/12/29.
 */
import React from 'react'
import {connect} from 'react-redux'
import moment from 'moment'
import styles from './countdown.module.scss'

export default class Countdown extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0
    }
  }

  componentWillMount() {
    const {time} = this.props
    let that = this
    this.interval = setInterval(function () {
      let eventTime = moment(time).unix()
      let currentTime = moment().unix()
      let diffTime = eventTime - currentTime
      let duration = moment.duration(diffTime * 1000, 'milliseconds')
      duration = moment.duration(duration.asMilliseconds() - 1000, 'milliseconds')
      that.setState({
        days: moment.duration(duration).days(),
        hours: moment.duration(duration).hours(),
        minutes: moment.duration(duration).minutes(),
        seconds: moment.duration(duration).seconds()
      })
    }, 1000)
  }

  componentWillUnmount() {
    if(this.interval) {
      clearInterval(this.interval)
    }
  }

  render() {
    const {days, hours, minutes, seconds} = this.state
    const {counter} = this.props
    if(counter > 0) {
      return(
        <div className={styles.container}>
          <div className={styles.title}>活动结束倒计时</div>
          <div className={styles.count}>
            <div className={styles.num}>
              {days < 10? '0' + days : days}
            </div>
            <div className={styles.text}>天</div>
            <div className={styles.num}>
              {hours < 10? '0' + hours : hours}
            </div>
            <div className={styles.text}>时</div>
            <div className={styles.num}>
              {minutes < 10? '0' + minutes : minutes}
            </div>
            <div className={styles.text}>分</div>
            <div className={styles.num}>
              {seconds < 10? '0' + seconds : seconds}
            </div>
            <div className={styles.text}>秒</div>
          </div>
        </div>
      )
    } else {
      return(
        <div className={styles.container}>
          <div className={styles.endTrip}>活动已结束</div>
        </div>
      )
    }
  }
}
