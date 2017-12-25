/**
 * Created by wanpeng on 2017/12/22.
 */
//微信公众平台
var WECHAT_MP_APPID = ""
const WECHAT_MP_APPID_DEV = "wx34ac208b373814d2"
const WECHAT_MP_APPID_PRE = ""
const WECHAT_MP_APPID_PRO = "wx8e0c7ea782cd768d"

// 云引擎域名
var LEAN_ENGINE_DOMAIN = ""
const LEAN_ENGINE_DOMAIN_DEV = "http://hudong-dev.leanapp.cn"
const LEAN_ENGINE_DOMAIN_STAGE = ""
const LEAN_ENGINE_DOMAIN_PRO = "http://hudong-pro.leanapp.cn"

// 微信端域名
var CLIENT_DOMAIN = ''
const CLIENT_DOMAIN_DEV = 'http://www.hudong.frp.lvyii.com'
const CLIENT_DOMAIN_STAGE = ''
const CLIENT_DOMAIN_PRO = ''

//LeanCloud环境参数
var LC_APP_ID = ""
var LC_APP_KEY = ""
const LC_DEV_APP_ID = 'AeOiTsPVUSMd8jfNqungDRq1-gzGzoHsz'      //开发环境
const LC_DEV_APP_KEY = '973RYHKEl1oFwbC2VMJXuQ4X'
const LC_STAGE_APP_ID = ''    //预上线环境
const LC_STAGE_APP_KEY = ''
const LC_PRO_APP_ID = 'L3Cae9l7aornoukXME6ycMFD-gzGzoHsz'      //生产环境
const LC_PRO_APP_KEY = 'lH7LPYtJJLJjMnz2MHWrCmKz'

if(__DEV__) {          //开发环境
  LC_APP_ID = LC_DEV_APP_ID
  LC_APP_KEY = LC_DEV_APP_KEY
  WECHAT_MP_APPID = WECHAT_MP_APPID_DEV
  LEAN_ENGINE_DOMAIN = LEAN_ENGINE_DOMAIN_DEV
  CLIENT_DOMAIN = CLIENT_DOMAIN_DEV
} else if(__STAGE__) { //预上线环境
  LC_APP_ID = LC_STAGE_APP_ID
  LC_APP_KEY = LC_STAGE_APP_KEY
  WECHAT_MP_APPID = WECHAT_MP_APPID_PRE
  LEAN_ENGINE_DOMAIN = LEAN_ENGINE_DOMAIN_STAGE
  CLIENT_DOMAIN = CLIENT_DOMAIN_STAGE
} else if(__PROD__) {   //生产环境
  LC_APP_ID = LC_PRO_APP_ID
  LC_APP_KEY = LC_PRO_APP_KEY
  WECHAT_MP_APPID = WECHAT_MP_APPID_PRO
  LEAN_ENGINE_DOMAIN = LEAN_ENGINE_DOMAIN_PRO
  CLIENT_DOMAIN = CLIENT_DOMAIN_PRO
}

var appConfig = {
  APP_NAME: '小吉互动',

  LC_APP_ID: LC_APP_ID,
  LC_APP_KEY: LC_APP_KEY,

  WECHAT_MP_APPID: WECHAT_MP_APPID,
  LEAN_ENGINE_DOMAIN: LEAN_ENGINE_DOMAIN,
  CLIENT_DOMAIN: CLIENT_DOMAIN,
}

module.exports = appConfig
