/**
 * Created by wanpeng on 2017/12/27.
 */
import React from 'react'
import {connect} from 'react-redux'
import {Link, Route, withRouter, Switch} from 'react-router-dom'
import styles from './award.module.scss'
import {Button, WingBlank, List, InputItem, TextareaItem, Toast} from 'antd-mobile'
import {publishAction, publishSelector} from './redux'
import {VOTE_STATUS} from '../Vote'
import ImageSelector from '../../components/ImageSelector'

class Award extends React.Component {
  constructor(props) {
    document.title = "奖项设置"
    super(props)
    this.state = {
      awards: [
        {
          awardPhoto: undefined,
          awardName: undefined,
          winnerNum: undefined,
          description: undefined,
        }
      ],
    }
  }

  componentWillMount() {
    const {publishVote} = this.props
    if(publishVote && publishVote.awards) {
      this.setState({
        awards: publishVote.awards
      })
    }
  }

  onBack = () => {
    const {history, createOrUpdatePublishingVoteAction, publishVote} = this.props
    let {awards} = this.state
    awards = awards.filter(value => value.awardPhoto)
    if(awards.length > 0) {
      createOrUpdatePublishingVoteAction({
        ...publishVote,
        awards: awards,
      })
    }
    history.goBack()
  }

  onNext = () => {
    const {history, createOrUpdatePublishingVoteAction, publishVote} = this.props
    let {awards} = this.state
    awards = awards.filter(value => value.awardPhoto)
    if(awards.length > 0) {
      createOrUpdatePublishingVoteAction({
        ...publishVote,
        awards: awards,
      })
    }

    history.push('/publish/gifts')
  }

  onSubmit = () => {
    Toast.loading("正在提交")
    const {history, createOrUpdatePublishingVoteAction, clearPublishingVoteAction, publishVote} = this.props
    let {awards} = this.state
    awards = awards.filter(value => value.awardPhoto)
    createOrUpdatePublishingVoteAction({
      ...publishVote,
      awards: awards,
      status: VOTE_STATUS.WAITING,
      success: () => {
        Toast.hide()
        Toast.success('提交成功')
        history.replace('/')
        clearPublishingVoteAction()
      },
      error: () => {
        Toast.hide()
        Toast.fail("提交失败")
      }
    })
  }

  preview = () => {
    Toast.loading("正在转到预览")
    const {history, createOrUpdatePublishingVoteAction, publishVote} = this.props
    let {awards} = this.state
    awards = awards.filter(value => value.awardPhoto)
    createOrUpdatePublishingVoteAction({
      ...publishVote,
      awards: awards,
      status: VOTE_STATUS.WAITING,
      success: () => {
        Toast.hide()
        history.push('/vote/' + this.props.publishVote.id + '&&showType=preview')
      },
      error: () => {
        Toast.hide()
        Toast.fail("预览失败")
      }
    })
  }

  addAward = () => {
    let {awards} = this.state
    let award = {
      awardPhoto: undefined,
      awardName: undefined,
      winnerNum: undefined,
      description: undefined,
    }
    awards.push(award)
    this.setState({awards})
  }

  onAwardNameChange(value, index) {
    let {awards} = this.state
    awards[index].awardName = value
    this.setState({awards})
  }

  onWinnerNumChange(value, index) {
    let {awards} = this.state
    awards[index].winnerNum = Number(value)
    this.setState({awards})
  }

  onDescChange(value, index) {
    let {awards} = this.state
    awards[index].description = value
    this.setState({awards})
  }
  onPhotoChange(value, index) {
    let {awards} = this.state
    awards[index].awardPhoto = value
    this.setState({awards})
  }

  deleteAward(index) {
    let {awards} = this.state
    awards.splice(index, 1)
    this.setState({awards})
  }

  renderAwards() {
    const {awards} = this.state
    return(
      <div>
        {
          awards.map((award, index) => (
            <div key={index} className={styles.awardItem}>
              <ImageSelector trip="添加奖项图片" value={award.awardPhoto && [award.awardPhoto]} count={1}
                             onChange={(values) => this.onPhotoChange(values[0], index)} />
              <List>
                <InputItem value={award.awardName}
                           placeholder="请输入奖项名称(选填)"
                           onChange={value => this.onAwardNameChange(value, index)}>奖项名称</InputItem>
                <InputItem value={award.winnerNum && Number(award.winnerNum)}
                           type="number"
                           placeholder="请输入中奖人数(选填)"
                           onChange={value => this.onWinnerNumChange(value, index)}>获奖人数</InputItem>
                <TextareaItem value={award.description}
                              title="奖项说明"
                              placeholder="编辑奖项说明(选填)"
                              rows={3}
                              onChange={value => this.onDescChange(value, index)}/>
              </List>
              <div className={styles.delBtn}>
                <Button type="ghost"
                        inline
                        style={{backgroundColor: 'red', color: '#fff'}}
                        size="small" onClick={() => this.deleteAward(index)}>
                  删除
                </Button>
              </div>
            </div>
          ))
        }
      </div>
    )
  }

  render() {
    const {publishVote} = this.props
    return (
      <div className={styles.container}>
        {this.renderAwards()}
        <div className={styles.addView} onClick={this.addAward}>
          <img className={styles.img} src={require('../../asset/images/add.png')} alt=""/>
          <text className={styles.text}>添加奖项</text>
        </div>
        <WingBlank style={{marginTop: '100px', paddingBottom: '30px', textAlign: 'right'}}>
          <Button type="primary" style={{marginRight: '10px'}} inline size="small" onClick={this.onBack}>上一步</Button>
          {publishVote.type === 1?:<Button type="primary" inline size="small" onClick={this.preview}>预览</Button>:null}
          <Button type="primary" inline size="small" onClick={publishVote.type === 1? this.onNext : this.onSubmit}>{publishVote.type === 1? "下一步" : "完成"}</Button>
        </WingBlank>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    publishVote: publishSelector.selectPublishVote(state)
  }
}

const mapDispatchToProps = {
  ...publishAction
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Award))
