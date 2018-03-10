/**
 * Created by yangyang on 2018/3/10.
 */
import React from 'react'
import {connect} from 'react-redux'
import styles from './imagecarouselselector.module.scss'
import wx from 'tencent-wx-jssdk'
import {appStateAction, appStateSelector} from '../../utils/appstate'
import {Toast, Carousel} from 'antd-mobile'
import {getMobileOperatingSystem} from '../../utils/OS'
import {getLocalImgDataAsync, uploadImageAsync, chooseImageAsync, checkJsApiAsync} from '../../utils/wechatUtil'

class ImageCarouselSelector extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      localIds: props.value || [],
      localDataList: window.__wxjs_is_wkwebview && props.value? props.value : [],    //适配iOS WKWebview
      serverIds: props.value || [],
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
      debug: __DEV__? false: false,
      jsApiList: ['chooseImage', 'previewImage', 'getLocalImgData', 'uploadImage'].toString(),
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
  
  renderCarousel() {
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
    } else {
      return (
        <div>
          <Carousel autoplay infinite selectedIndex={0}>
            {
              imageSrcList.map((value, index) => (
                <div key={index} className={styles.cover} onClick={this.onSelectImage}>
                  <img className={styles.img} src={value} alt=""/>
                </div>
              ))
            }
          </Carousel>
        </div>
      )
    }
  }
  
  render() {
    return (
      <div className={styles.container}>
        {this.renderCarousel()}
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

export default connect(mapStateToProps, mapDispatchToProps)(ImageCarouselSelector)
