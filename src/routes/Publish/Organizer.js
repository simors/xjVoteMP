/**
 * Created by wanpeng on 2017/12/27.
 */
import React from 'react'
import {connect} from 'react-redux'
import {Link, Route, withRouter, Switch} from 'react-router-dom'
import styles from './organizer.module.scss'
import {Button, WingBlank, WhiteSpace, TextareaItem, Toast} from 'antd-mobile'
import ImageSelector from '../../components/ImageSelector'
import {publishAction, publishSelector} from './redux'


class Organizer extends React.Component {
  constructor(props) {
    document.title = "主办方介绍"
    super(props)
    this.state = {
      organizer: [
        {
          type: 'text',
          content: undefined
        }
      ],
    }
  }

  componentWillMount() {
    const {publishVote} = this.props
    if(publishVote && publishVote.organizer) {
      this.setState({
        organizer: publishVote.organizer
      })
    }
  }

  onBack = () => {
    const {history, createOrUpdatePublishingVoteAction, publishVote} = this.props
    let {organizer} = this.state
    organizer = organizer.filter(value => value.content || value.url)
    if(organizer.length > 0) {
      createOrUpdatePublishingVoteAction({
        ...publishVote,
        organizer: organizer,
      })
    }
    history.goBack()
  }

  onNext = () => {
    const {history, createOrUpdatePublishingVoteAction, publishVote} = this.props
    let {organizer} = this.state
    organizer = organizer.filter(value => value.content || value.url)
    if(organizer.length === 0) {
      Toast.fail("请输入介绍内容")
      return
    }
    createOrUpdatePublishingVoteAction({
      ...publishVote,
      organizer: organizer,
    })
    history.push('/publish/award')
  }

  addImageInput = () => {
    let {organizer} = this.state
    let imgObj = {
      type: 'image',
      url: undefined
    }
    organizer.push(imgObj)
    this.setState({organizer})
  }

  addTextInput = () => {
    let {organizer} = this.state

    let textObj = {
      type: 'text',
      url: undefined
    }
    organizer.push(textObj)
    this.setState({organizer})
  }

  deleteContent(index) {
    let {organizer} = this.state
    organizer.splice(index, 1)
    this.setState({organizer})
  }

  onTextChange(value, index) {
    let {organizer} = this.state
    organizer[index].content = value
    this.setState({organizer})
  }

  onImageChange(values, index) {
    let {organizer} = this.state
    if(values.length === 0) {
      return
    }
    organizer.splice(index, 1, {
      type: 'image',
      url: values[0]
    })
    this.setState({organizer})
  }

  renderOrganizer() {
    const {organizer} = this.state
    return(
      <div>
        {
          organizer.map((value, index) => {
            if(value.type === 'text') {
              return(
                <WingBlank key={index} style={{textAlign: 'right'}} >
                  <TextareaItem placeholder="输入正文"
                                autoHeight
                                value={value.content}
                                onChange={(value) => this.onTextChange(value, index)} />
                  <Button type="ghost"
                          inline
                          style={{backgroundColor: 'red', color: '#fff'}}
                          size="small" onClick={() => this.deleteContent(index)}>
                    删除
                  </Button>
                </WingBlank>
              )
            } else if(value.type === 'image' && value.url) {
              return(
                <div key={index}>
                  <ImageSelector value={[value.url]} count={1} onChange={(values) => {value.url = values[0]}} />
                </div>
              )
            } else if(value.type === 'image' && !value.url) {
              return(
                <div key={index}>
                  <ImageSelector count={1} trip="请插入图片" onChange={(values) => this.onImageChange(values, index)} />
                </div>
              )
            }else {
              return(null)
            }
          })
        }
      </div>
    )
  }

  render() {
    return (
      <div className={styles.container}>
        {this.renderOrganizer()}
        <WingBlank>
          <WhiteSpace />
          <Button inline
                  style={{backgroundColor: '#1AAD19', color: '#fff', marginRight: '10px'}}
                  size="small"  onClick={this.addImageInput}>
            + 图片
          </Button>
          <Button inline
                  style={{backgroundColor: '#1AAD19', color: '#fff'}}
                  size="small" onClick={this.addTextInput}>
            + 文字
          </Button>
        </WingBlank>
        <WingBlank style={{marginTop: '100px', textAlign: 'right'}}>
          <Button type="primary" style={{marginRight: '10px'}} inline size="small" onClick={this.onBack}>上一步</Button>
          <Button type="primary" inline size="small" onClick={this.onNext}>下一步</Button>
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
  ...publishAction,
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Organizer))
