/**
 * Created by wanpeng on 2017/12/27.
 */
import React from 'react'
import {connect} from 'react-redux'
import styles from './imageselector.module.scss'
import wx from 'tencent-wx-jssdk'
import {appStateAction, appStateSelector} from '../../utils/appstate'
import {WhiteSpace} from 'antd-mobile'
import {getMobileOperatingSystem} from '../../utils/OS'



class ImageSelector extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      localIds: [],
    }
  }

  // componentWillMount() {
  //   const {getJsApiConfig, entryURL} = this.props
  //   const OS = getMobileOperatingSystem()
  //   let jssdkURL = window.location.href
  //   if(OS === 'iOS') {
  //     //微信JS-SDK Bug: SPA(单页应用)ios系统必须使用首次加载的url初始化jssdk
  //     jssdkURL = entryURL
  //   }
  //   getJsApiConfig({
  //     debug: __DEV__? true: false,
  //     jsApiList: ['chooseImage', 'previewImage', 'getLocalImgData', 'uploadImage'],
  //     url: jssdkURL,
  //     success: this.getJsApiConfigSuccess,
  //     error: (error) => {console.log(error)}
  //   })
  // }

  // getJsApiConfigSuccess = (configInfo) => {
  //   wx.config(configInfo)
  //   console.log("wxjs_is_wkwebview:", window.__wxjs_is_wkwebview)
  // }

  onSelectImage = () => {
    let that = this
    const {count, onChange} = this.props

    wx.ready(function () {
      wx.chooseImage({
        "count": count,
        sizeType: ['original', 'compressed'],
        "sourceType": ['album', 'camera'],
        "success": function (res) {
          that.setState({localIds: res.localIds})
          onChange(res.localIds)
        }
      })
    })

    wx.error(function (err) {
      alert(err)
    })
  }

  renderCover() {
    const {localIds} = this.state
    if(localIds.length === 0) {
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
            localIds.map((value, index) => (
              <div key={index} className={styles.cover}>
                <img className={styles.img} src={value} alt=""/>
                <WhiteSpace />
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
