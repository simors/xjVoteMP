/**
 * Created by wanpeng on 2017/12/26.
 */
import React from 'react'
import {connect} from 'react-redux'
import {Link, Route, withRouter, Switch} from 'react-router-dom'
import {Button, WhiteSpace, WingBlank, Toast, InputItem, TextareaItem, List} from 'antd-mobile'
import styles from './apply.module.scss'
import ImageSelector from '../../components/ImageSelector'
import {voteActions} from './redux'
import {appStateAction, appStateSelector} from '../../utils/appstate'

class Apply extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      title: undefined,
      declaration: "",
      imageServerIds: undefined
    }
  }

  selectImage = (imageServerIds) => {
    this.setState({imageServerIds: imageServerIds})
  }

  submitApply = () => {
    const {title, declaration, imageServerIds} = this.state
    const {voteId, joinVoteApplyAction} = this.props
    if(!title || title.length === 0) {
      Toast.fail('请填写姓名', 1)
      return
    }
    if(!declaration || declaration.length === 0) {
      Toast.fail('请填写参赛宣言', 1)
      return
    }
    if(imageServerIds.length === 0) {
      Toast.fail('至少上传一张照片', 1)
      return
    }
    Toast.loading('正在提交', 0)

    joinVoteApplyAction({
      voteId: voteId,
      name: title,
      declaration: declaration,
      imageServerIds: imageServerIds,
      success: this.joinVoteApplySuccess,
      error: this.joinVoteApplyError,
    })
  }

  joinVoteApplySuccess = () => {
    const {onSwitchTab} = this.props
    Toast.hide()
    Toast.success('提交成功', 1)
    setTimeout(function () {
      onSwitchTab('homeTab')
    }, 1000)
  }

  joinVoteApplyError = (error) => {
    Toast.hide()
    Toast.fail('提交失败', 1)
  }

  onChangeTitle = (value) => {
    this.setState({title: value})
  }

  onChangeDeclaration = (value) => {
    this.setState({declaration: value})
  }

  render() {
    const {title} = this.state
    return(
      <div className={styles.container}>
        <InputItem placeholder="姓名" value={title} onChange={this.onChangeTitle} ></InputItem>
        <TextareaItem style={{fontSize: '14px'}} rows={3} placeholder="请输入参赛宣言" onChange={this.onChangeDeclaration} />
        <WhiteSpace />
        <WingBlank>
          <ImageSelector trip="请上传参赛图片" count={3} onChange={this.selectImage} />
        </WingBlank>
        <WhiteSpace />
        <WingBlank>
          <Button type="primary" onClick={this.submitApply}>提交</Button>
        </WingBlank>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    entryURL: appStateSelector.selectEntryURL(state)
  }
}

const mapDispatchToProps = {
  ...voteActions,
  ...appStateAction,
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Apply))
