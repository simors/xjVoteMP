/**
 * Created by wanpeng on 2017/12/29.
 */
import React from 'react'
import {connect} from 'react-redux'
import {Link, Route, withRouter, Switch} from 'react-router-dom'
import styles from './publish.module.scss'
import {Button, WhiteSpace, WingBlank, List, InputItem, TextareaItem, DatePicker, Toast} from 'antd-mobile'
import ImageCarouselSelector from '../../components/ImageCarouselSelector'
import {publishAction, publishSelector} from './redux'
import DateTime from '../../utils/datetime'

class Publish extends React.PureComponent {
  constructor(props) {
    super(props)
    document.title = "创建活动"
    this.state = {
      cover: [],
      title: undefined,
      endDate: DateTime.format(new Date()),
      noticeContent: undefined,
      ruleContent: undefined,
    }
  }

  componentWillMount() {
    const {publishVote} = this.props
    if(publishVote) {
      this.setState({
        cover: publishVote.coverSet,
        title: publishVote.title,
        noticeContent: publishVote.notice,
        ruleContent: publishVote.rule,
        endDate: publishVote.endDate
      })
    }
  }

  onNext = () => {
    const {history, createOrUpdatePublishingVoteAction, publishVote, type} = this.props
    const {cover, title, endDate, noticeContent, ruleContent} = this.state
    if(cover.length == 0) {
      Toast.fail("未上传封面")
      return
    }
    if(!title) {
      Toast.fail("未输入活动名称")
      return
    }
    if(!endDate) {
      Toast.fail("未设置结束日期")
      return
    }
    if(!noticeContent) {
      Toast.fail("未输入公告")
      return
    }
    if(!ruleContent) {
      Toast.fail("未输入活动规则")
      return
    }
    createOrUpdatePublishingVoteAction({
      ...publishVote,
      type: type || publishVote.type,
      coverSet: cover,
      title: title,
      endDate: endDate,
      notice: noticeContent,
      rule: ruleContent,
    })
    history.push('/publish/organizer')
  }

  selectCover = (cover) => {
    this.setState({cover})
  }

  render() {
    const {cover, title, endDate, noticeContent, ruleContent} = this.state
    return (
      <div className={styles.page}>
        <ImageCarouselSelector value={cover} trip="添加封面，最多3张" count={3} onChange={this.selectCover} />
        <List>
          <InputItem value={title}
                     placeholder="请输入活动的名称"
                     onChange={value => this.setState({title: value})}>活动名称</InputItem>
          <DatePicker value={new Date(endDate)}
                      mode="date"
                      minDate={new Date()}
                      maxDate={new Date(DateTime.addDate(60))}
                      format={val => DateTime.format(val)}
                      onChange={date => this.setState({endDate: DateTime.format(date)})}>
            <List.Item arrow="horizontal">结束日期</List.Item>
          </DatePicker>
          <TextareaItem value={noticeContent}
                        title="活动公告"
                        placeholder="输入滚动公告栏的内容"
                        rows={3}
                        onChange={value => this.setState({noticeContent: value})}/>
          <TextareaItem value={ruleContent}
                        title="活动规则"
                        placeholder="编辑活动规则"
                        rows={3}
                        onChange={value => this.setState({ruleContent: value})}/>
        </List>
        <WingBlank>
          <WhiteSpace />
          <Button type="primary" onClick={this.onNext}>下一步</Button>
        </WingBlank>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let location = ownProps.location
  let type = location.query? location.query.type : undefined
  console.log('Publish type', type)
  return {
    type: type,
    publishVote: publishSelector.selectPublishVote(state)
  }
}

const mapDispatchToProps = {
  ...publishAction,
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Publish))
