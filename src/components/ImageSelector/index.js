/**
 * Created by wanpeng on 2017/12/27.
 */
import React from 'react'
import {connect} from 'react-redux'
import styles from './imageselector.module.scss'
import wx from 'tencent-wx-jssdk'
import {appStateAction, appStateSelector} from '../../utils/appstate'
import {WhiteSpace, Toast,} from 'antd-mobile'
import {getMobileOperatingSystem} from '../../utils/OS'
import {getLocalImgDataAsync, uploadImageAsync, chooseImageAsync} from '../../utils/wechatUtil'

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
      jsApiList: ['chooseImage', 'previewImage', 'getLocalImgData', 'uploadImage', 'onMenuShareAppMessage', 'onMenuShareAppMessage'],
      url: jssdkURL,
      success: this.getJsApiConfigSuccess,
      error: (error) => {console.log(error)}
    })
  }

  getJsApiConfigSuccess = (configInfo) => {
    wx.config(configInfo)
  }

  async getLocalImgDataList(localIds) {
    if(!localIds || localIds.length === 0) {
      return undefined
    }
    let localDataList = []
    for (let i = 0; i < localIds.length; i++) {
      try {
        let localData =  await getLocalImgDataAsync(wx, localIds[i])
        localDataList.push(localData)
      } catch (e) {
        console.error(e)
        throw e
      }
    }
    return localDataList
  }

  async uploadImageList(localIds) {
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

  onSelectImage = async () => {
    const {count, onChange} = this.props
    let residueCount = count - this.state.localIds.length
    if(residueCount < 1) {
      return
    }
    try {
      let selectedLocalIds = await chooseImageAsync(wx, residueCount)
      this.setState({localIds: selectedLocalIds})
      if(window.__wxjs_is_wkwebview) {    //适配iOS WKWebview
        let selectedLocalDataList = await this.getLocalImgDataList(selectedLocalIds)
        this.setState({localDataList: selectedLocalDataList})
      }
      let serverIds = await this.uploadImageList(selectedLocalIds)
      this.setState({serverIds})
      onChange(serverIds)
    } catch (e) {
      Toast.fail("图片选择失败")
    }
  }

  async onReplaceImage(index) {
    const {localIds, localDataList, serverIds} = this.state
    const {onChange} = this.props
    try {
      let result = await chooseImageAsync(wx, 1)
      let selectedLocalId = result[0]
      localIds[index] = selectedLocalId
      this.setState({localIds})
      if(window.__wxjs_is_wkwebview) {  //适配iOS WKWebview
        let localData = await getLocalImgDataAsync(wx, selectedLocalId)
        localDataList[index] = localData
        this.setState({localDataList})
      }
      let serverId = await uploadImageAsync(wx, selectedLocalId)
      serverIds[index] = serverId
      this.setState(serverIds)
      onChange(serverIds)
    } catch (e) {
      console.error(e)
      Toast.fail("图片选择失败")
    }
  }

  async onDeleteImage(e, index) {
    e.preventDefault()
    let {localIds, localDataList, serverIds} = this.state
    const {onChange} = this.props
    try {
      localIds.splice(index, 1)
      if(window.__wxjs_is_wkwebview) {
        localDataList.splice(index, 1)
      }
      serverIds.splice(index, 1)
      this.setState({localIds: localIds, localDataList: localDataList, serverIds})
      onChange(serverIds)
    } catch (e) {
      Toast.fail("删除图片失败")
    }
  }

  renderCover() {
    const {localIds, localDataList} = this.state
    const {count, trip} = this.props
    let imageSrcList = window.__wxjs_is_wkwebview? localDataList : localIds
    if(imageSrcList.length === 0) {
      return(
        <div className={styles.defaultCover} onClick={this.onSelectImage}>
          <img className={styles.icon} src={require('../../asset/images/photo.png')} alt=""/>
          <div className={styles.desc}>{trip}</div>
        </div>
      )
    } else if(imageSrcList.length < count) {
      return(
        <div>
          {
            imageSrcList.map((value, index) => (
              <div key={index} className={styles.cover}>
                <img className={styles.img} src={value} alt="" onClick={() => this.onReplaceImage(index)}/>
                <div className={styles.close} onClick={(e) => this.onDeleteImage(e, index)}>
                  <img className={styles.img} src={require('../../asset/images/close.png')} alt=""/>
                </div>
              </div>
            ))
          }
          <div className={styles.defaultCover} onClick={this.onSelectImage}>
            <img className={styles.icon} src={require('../../asset/images/photo.png')} alt=""/>
            <div className={styles.desc}>{trip}</div>
          </div>
        </div>
      )
    } else {
      return(
        <div>
          {
            imageSrcList.map((value, index) => (
              <div key={index} className={styles.cover}>
                <img className={styles.img} src={value} alt="" onClick={() => this.onReplaceImage(index)}/>
                <div className={styles.close} onClick={(e) => this.onDeleteImage(e, index)}>
                  <img className={styles.img} src={require('../../asset/images/close.png')} alt=""/>
                </div>
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
