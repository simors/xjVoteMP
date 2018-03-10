/**
 * Created by yangyang on 2017/9/19.
 */

export default class DateTime {
  /**
   *
   * @param timestamp
   * @returns {string}
   */
  static getConversationTime(timestamp) {
    let timeDiffInMS = 0
    if (timestamp) {
      timeDiffInMS = Date.now() - timestamp
    }
    let labelText = "刚刚"
    const timeDiffInSec = Math.floor(timeDiffInMS / 1000.0)
    if (timeDiffInSec > 0) {
      //labelText = timeDiffInSec + "秒前"
      const timeDiffInMin = Math.floor(timeDiffInSec / 60.0)
      if (timeDiffInMin > 0) {
        labelText = timeDiffInMin + "分钟前"
        const timeDiffInHour = Math.floor(timeDiffInMin / 60.0)
        if (timeDiffInHour > 0) {
          labelText = timeDiffInHour + "小时前"
          const timeDiffInDay = Math.floor(timeDiffInHour / 24.0)
          if (timeDiffInDay > 0) {
            labelText = timeDiffInDay + "天前"
            const timeDiffInWeek = Math.floor(timeDiffInDay / 7.0)
            if (timeDiffInWeek > 0) {
              labelText = timeDiffInWeek + "周前"
              const timeDiffInMon = Math.floor(timeDiffInDay / 30.0)
              if (timeDiffInMon > 0) {
                labelText = timeDiffInMon + "月前"
                const timeDiffInYear = Math.floor(timeDiffInDay / 365.0)
                if (timeDiffInYear > 0) {
                  labelText = timeDiffInYear + "年前"
                }
              }
            }
          }
        }
      }
    }
    return labelText
  }

  /**
   * 时间格式化，YYYY-MM-DD
   * @param dtStr
   * @returns {string}
   */
  static format(dtStr) {
    let givenDate = new Date(Date.parse(dtStr))
    let Y = givenDate.getFullYear() + '-'
    let M = (givenDate.getMonth()+1 < 10 ? '0'+(givenDate.getMonth()+1) : givenDate.getMonth()+1) + '-'
    let D = givenDate.getDate()<10 ? '0'+givenDate.getDate() : givenDate.getDate()
    return Y+M+D
  }
  
  static formatDate(date) {
    /* eslint no-confusing-arrow: 0 */
    const pad = n => n < 10 ? `0${n}` : n;
    const dateStr = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
    const timeStr = `${pad(date.getHours())}:${pad(date.getMinutes())}`;
    return `${dateStr} ${timeStr}`;
  }

  /**
   * 根据当前时间计算增加天数后的时间格式，YYYY-MM-DD
   * @param days
   * @returns {string}
   */
  static addDate(days) {
    let nowDate = (new Date()).toLocaleDateString()
    let aDate = (new Date(Date.parse(nowDate) + days * 24 * 3600 * 1000)).toLocaleDateString()
    return DateTime.format(aDate)
  }

  /**
   * 返回给定起始时间增加天数后的时间格式，为YYYY-MM-DD
   * @param beginDate     起始时间字符串，格式为YYYY-MM-DD
   * @param days          增加的天数
   * @returns {*}
   */
  static addDateWithBegin(beginDate, days) {
    let nowDate = (new Date(beginDate)).toLocaleDateString()
    let aDate = (new Date(Date.parse(nowDate) + days * 24 * 3600 * 1000)).toLocaleDateString()
    return DateTime.format(aDate)
  }

  /**
   * 计算给定时间与当前时间的差值，返回单位为秒
   * @param endDate     最后的时间，格式为YYYY-MM-DD
   * @returns {Number}
   */
  static minusDateTime(endDate) {
    let nowtime = (new Date()).getTime()
    let endtime = (new Date(endDate)).getTime() + (new Date()).getTimezoneOffset() * 60000
    return parseInt((endtime - nowtime) / 1000)
  }
}
