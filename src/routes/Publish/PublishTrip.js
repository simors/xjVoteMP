/**
 * Created by wanpeng on 2018/1/28.
 */
import React from 'react'
import {connect} from 'react-redux'
import styles from './publishtrip.module.scss'
import {List, InputItem, Toast} from 'antd-mobile'
import {publishAction} from './redux'


class PublishTrip extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      password: undefined,
    }
  }

  fetchVotePwdSuccess = (psw) => {
    const {onSubmit} = this.props
    const {password} = this.state

    if(psw === password) {
      onSubmit()
    } else {
      Toast.fail("口令错误")
    }
  }

  onNoAgentSubmit = () => {
    const { fetchCreateVotePwdAction } = this.props
    const {password} = this.state
    if(!password || password.length === 0) {
      Toast.fail("请输入口令")
      return
    }
    fetchCreateVotePwdAction({
      success: this.fetchVotePwdSuccess,
      error: (error) => {
        Toast.fail("获取口令失败")
      }
    })
  }

  render() {
    const {visible, onClose} = this.props
    if(!visible) {
      return(null)
    }
    return(
      <div className={styles.container}>
        <div className={styles.trip}>
          <div className={styles.content}>
            <div style={{marginBottom: '10px'}}>
              <text style={{fontSize: '14px'}}>您当前还没有开通代理权限！扫描下方二维码或搜索小吉互动微信公众号了解详情！</text>
            </div>
            <div className={styles.mpView}>
              <img className={styles.img} src="http://ac-l3cae9l7.clouddn.com/b17d267c395e5453ecb4.jpeg" alt=""/>
            </div>
          </div>
          <List>
            <InputItem placeholder="请输入口令" onChange={(value) => this.setState({password: value})}>口令</InputItem>
          </List>
          <div className={styles.notice}>
            <text className={styles.text}>口令可以向代理获取或关注上方公众号获取</text>
          </div>
          <div className={styles.btn}>
            <div className={styles.cancel} onClick={() => onClose()}>取消</div>
            <div className={styles.confirm} onClick={this.onNoAgentSubmit}>继续</div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
  }
}

const mapDispatchToProps = {
  ...publishAction,
}

export default connect(mapStateToProps, mapDispatchToProps)(PublishTrip)
