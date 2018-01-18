/**
 * Created by wanpeng on 2017/12/29.
 */
import React from 'react'
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
    let {counter} = this.props
    let that = this
    if(counter > 0) {
      this.interval = setInterval(function () {
        counter--
        let time = that.calCounter(counter)
        that.setState({
          days: time.days,
          hours: time.hours,
          minutes: time.mins,
          seconds: time.secs,
        })
      }, 1000)
    }
  }

  calCounter(count) {
    const oneday = 24 * 60 * 60
    const onehour = 60 * 60
    const onemin = 60
    let days = parseInt(count / oneday)
    if (days < 10) {
      days = '0' + days
    }
    let hours = parseInt((count - days * oneday) / onehour)
    if (hours < 10) {
      hours = '0' + hours
    }
    let mins = parseInt((count - days * oneday - hours * onehour) / onemin)
    if (mins < 10) {
      mins = '0' + mins
    }
    let secs = count - days * oneday - hours * onehour - mins * 60
    if (secs < 10) {
      secs = '0' + secs
    }
    return {
      days,
      hours,
      mins,
      secs
    }
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
        <div className={styles.countView}>
          <div className={styles.title}>距投票活动结束剩</div>
          <div className={styles.count}>
            <view className={styles.num}>
              {days}
            </view>
            <text className={styles.text}>天</text>
            <view className={styles.num}>
              {hours}
            </view>
            <text className={styles.text}>时</text>
            <view className={styles.num}>
              {minutes}
            </view>
            <text className={styles.text}>分</text>
            <view className={styles.num}>
              {seconds}
            </view>
            <text className={styles.text}>秒</text>
          </div>
        </div>
      )
    } else {
      return(
        <div className={styles.countView}>
          <div className={styles.endTrip}>活动已结束</div>
        </div>
      )
    }
  }
}
