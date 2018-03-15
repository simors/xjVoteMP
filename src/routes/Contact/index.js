/**
 * Created by yangyang on 2018/3/15.
 */
import React from 'react'
import {Button, WingBlank} from 'antd-mobile'
import styles from './contact.module.scss'

export default class Contact extends React.PureComponent {
  constructor(props) {
    super(props)
  }
  
  gotoPublish = () => {
    const {history} = this.props
    history.push('/publish/type')
  }
  
  render() {
    return (
      <div className={styles.contactContainer}>
        <div className={styles.headImgView}>
          <img className={styles.headImg} src="http://ac-l3cae9l7.clouddn.com/6dfd86182889e33b399c.png" />
          <img className={styles.solognImg} src="http://ac-l3cae9l7.clouddn.com/58a4047010e3f57e8c47.png" />
        </div>
  
        <div className={styles.titleView}>
          <img className={styles.titleImg} src="http://ac-l3cae9l7.clouddn.com/3fe7ded1d22890835c39.png"/>
        </div>
  
        <div className={styles.applicationView}>
          <div className={styles.applicationItem}>
            <img className={styles.applicationImg} src="http://ac-l3cae9l7.clouddn.com/e35b0765a14bc65da5c9.png"/>
            <div className={styles.applicationText}>政企评选</div>
          </div>
          <div className={styles.applicationItem}>
            <img className={styles.applicationImg} src="http://ac-l3cae9l7.clouddn.com/5ecdc52bfcef3f63aa12.png"/>
            <div className={styles.applicationText}>萌宝自拍</div>
          </div>
          <div className={styles.applicationItem}>
            <img className={styles.applicationImg} src="http://ac-l3cae9l7.clouddn.com/cf2a76b6087cd8f72623.png"/>
            <div className={styles.applicationText}>才艺比拼</div>
          </div>
          <div className={styles.applicationItem}>
            <img className={styles.applicationImg} src="http://ac-l3cae9l7.clouddn.com/89de1f61838163148cca.png"/>
            <div className={styles.applicationText}>摄影大赛</div>
          </div>
          <div className={styles.applicationItem}>
            <img className={styles.applicationImg} src="http://ac-l3cae9l7.clouddn.com/8eefc561adf674841256.png"/>
            <div className={styles.applicationText}>人气之星</div>
          </div>
          <div className={styles.applicationItem}>
            <img className={styles.applicationImg} src="http://ac-l3cae9l7.clouddn.com/7b78d8cb46081fda2797.png"/>
            <div className={styles.applicationText}>民主决策</div>
          </div>
        </div>
  
        <div className={styles.btnView}>
          <Button type="primary" onClick={this.gotoPublish}>创建投票</Button>
        </div>
  
        <div className={styles.titleView}>
          <img className={styles.titleImg} src="http://ac-l3cae9l7.clouddn.com/1a95bc5554a978003efe.png"/>
        </div>
  
        <div className={styles.sampleView}>
          <img style={{width: '100%'}} src="http://ac-l3cae9l7.clouddn.com/ea471f0477f645630492.png" />
        </div>
  
        <div className={styles.titleView}>
          <img className={styles.titleImg} src="http://ac-l3cae9l7.clouddn.com/5382fbfcb4947bb68806.png"/>
        </div>
  
        <div className={styles.bottomGap}>
          <div style={{fontSize: '12px', color: '#fff', lineHeight: 1.5}}>
            <div>长沙小吉网络科技有限公司是一家专注于互联网营销推广的公司，为客户提供专业的推广渠道和互联网推广工具。小吉互动是本公司旗下的一款专业的投票小程序，这款工具创建投票简单、功能完善。主办方拥有宣传展示、报名管理、选手管理、评选周期等权限，让主办方的活动效果和影响力最大化。</div>
            <div>目前我们已为众多行业做过活动支持，在行业中处于领先地位。</div>
            <div>我们以诚信为本，以用户体验至上。我们秉承开放合作的态度，期待与您合作共赢。</div>
          </div>
        </div>
      </div>
    )
  }
}