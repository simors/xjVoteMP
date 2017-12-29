/**
 * Created by wanpeng on 2017/12/27.
 */
import React from 'react'
import {connect} from 'react-redux'
import styles from './imageselector.module.scss'
import wx from 'tencent-wx-jssdk'
import {appStateAction} from '../../utils/appstate'
import {WhiteSpace} from 'antd-mobile'

class ImageSelector extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      fileList: [],
    }
  }

  componentWillMount() {
    const {getJsApiConfig} = this.props
    getJsApiConfig({
      debug: __DEV__? true: false,
      jsApiList: ['chooseImage', 'previewImage', 'getLocalImgData'],
      url: window.location.href,
      success: this.getJsApiConfigSuccess,
      error: (error) => {console.log(error)}
    })
  }

  getJsApiConfigSuccess = (configInfo) => {
    wx.config(configInfo)
    wx.ready(function () {
      console.log("wx.ready")
      console.log("wxjs_is_wkwebview:", window.__wxjs_is_wkwebview)
    })
    wx.error(function (err) {
      console.error(err)
    })
  }

  onSelectImage = () => {
    let that = this
    const {count} = this.props

    wx.ready(function () {
      wx.chooseImage({
        "count": count,
        sizeType: ['original', 'compressed'],
        "sourceType": ['album', 'camera'],
        "success": function (res) {
          let fileList = []
          res.localIds.forEach((localId) => {
            wx.getLocalImgData({
              "localId": localId,
              "success": function (result) {
                fileList.push(res.localData)
              }
            })
          })
          that.setState({fileList: fileList})
        }
      })
    })

    wx.error(function (err) {
      alert(err)
    })
  }

  renderCover() {
    const {fileList} = this.state
    if(fileList.length === 0) {
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
            fileList.map((value, index) => (
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
  }
}

const mapDispatchToProps = {
  ...appStateAction,
}

export default connect(mapStateToProps, mapDispatchToProps)(ImageSelector)
