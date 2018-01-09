/**
 * Created by wanpeng on 2017/12/27.
 */
import React from 'react'
import {connect} from 'react-redux'
import styles from './imageselector.module.scss'
import wx from 'tencent-wx-jssdk'
import {appStateAction, appStateSelector} from '../../utils/appstate'
import {WhiteSpace, Toast} from 'antd-mobile'
import {getMobileOperatingSystem} from '../../utils/OS'
import {getLocalImgDataAsync, uploadImageAsync} from '../../utils/wechatUtil'

class ImageSelector extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      localIds: [],
      localDataList: [],    //适配iOS WKWebview
      serverIds: [],
    }
  }

  componentWillMount() {
    const {getJsApiConfig, entryURL} = this.props
    const OS = getMobileOperatingSystem()
    let jssdkURL = window.location.href
    if(OS === 'iOS') {
      //微信JS-SDK Bug: SPA(单页应用)ios系统必须使用首次加载的url初始化jssdk
      jssdkURL = entryURL
    }
    getJsApiConfig({
      debug: __DEV__? true: false,
      jsApiList: ['chooseImage', 'previewImage', 'getLocalImgData', 'uploadImage'],
      url: jssdkURL,
      success: this.getJsApiConfigSuccess,
      error: (error) => {console.log(error)}
    })
  }

  getJsApiConfigSuccess = (configInfo) => {
    wx.config(configInfo)
  }

  async getLocalImgData(localIds) {
    if(window.__wxjs_is_wkwebview) {
      let localDataList = this.state.localDataList
      for (let i = 0; i < localIds.length; i++) {
        try {
          let localData =  await getLocalImgDataAsync(wx, localIds[i])
          localDataList.push(localData)
        } catch (e) {
          console.error(e)
          throw e
        }
      }
      this.setState({localDataList: localDataList})
    }
  }

  async uploadImage(localIds) {
    let serverIds = []
    for(let i = 0; i < localIds.length; i++) {
      try {
        let serverId = await uploadImageAsync(wx, localIds[i])
        serverIds.push(serverId)
      } catch (e) {
        console.error(e)
        throw e
      }
    }
    return serverIds
  }

  onSelectImage = () => {
    let that = this
    const {count, onChange} = this.props

    wx.ready(function () {
      wx.chooseImage({
        "count": count,
        sizeType: ['compressed'],
        "sourceType": ['album', 'camera'],
        "success": async function (res) {
          that.setState({localIds: res.localIds})
          try {
            await that.getLocalImgData(res.localIds)
            let serverIds = await that.uploadImage(res.localIds)
            onChange(serverIds)
          } catch (e) {
            console.error(e)
            Toast.fail("图片选择失败")
          }

        }
      })
    })

    wx.error(function (err) {
      alert(err)
    })
  }

  onReplaceImage(index) {

  }

  renderCover() {
    const {localIds, localDataList} = this.state
    let imageSrcList = window.__wxjs_is_wkwebview? localDataList : localIds
    if(imageSrcList.length === 0) {
      return(
        <div className={styles.defaultCover} onClick={this.onSelectImage}>
          <img className={styles.icon} src={require('../../asset/images/photo.png')} alt=""/>
          <div className={styles.desc}>添加封面</div>
        </div>
      )
    } else {
      return(
        <div>
          {
            imageSrcList.map((value, index) => (
              <div key={index} className={styles.cover} onClick={() => this.onReplaceImage(index)}>
                <img className={styles.img} src={value} alt=""/>
              </div>
            ))
          }
        </div>
      )
    }
  }


  render() {
    return(
      <div className={styles.container}>
        {this.renderCover()}
        <WhiteSpace />
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
  ...appStateAction,
}

export default connect(mapStateToProps, mapDispatchToProps)(ImageSelector)
