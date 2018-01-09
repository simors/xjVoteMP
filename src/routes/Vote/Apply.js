/**
 * Created by wanpeng on 2017/12/26.
 */
import React from 'react'
import {connect} from 'react-redux'
import {Link, Route, withRouter, Switch} from 'react-router-dom'
import {Button, WhiteSpace, WingBlank, Toast} from 'antd-mobile'
import styles from './apply.module.scss'
import ImageSelector from '../../components/ImageSelector'
import {voteActions} from './redux'
import {appStateAction, appStateSelector} from '../../utils/appstate'

class Apply extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      title: "报名测试",
      declaration: "不一样的经常",
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
    Toast.hide()
    Toast.success('提交成功', 1)
  }

  joinVoteApplyError = (error) => {
    Toast.hide()
    Toast.fail('提交失败', 1)
  }

  render() {
    return(
      <div className={styles.container}>
        <div className={styles.title}>

        </div>
        <div className={styles.declaration}>

        </div>
        <WhiteSpace />
        <WingBlank>
          <ImageSelector count={3} onChange={this.selectImage} />
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
