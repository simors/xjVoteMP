/**
 * Created by wanpeng on 2017/12/25.
 */
import React from 'react'
import {connect} from 'react-redux'
import {Link, Route, withRouter, Switch} from 'react-router-dom'
import {Button, Steps, WingBlank, WhiteSpace} from 'antd-mobile'
import styles from './publishVote.module.scss'
import PublishIndex from './PublishIndex'
import Organizer from './Organizer'
import Award from './Award'
import Gifts from './Gifts'

const Step = Steps.Step

class PublishVote extends React.PureComponent {
  constructor(props) {
    document.title = "创建活动"
    super(props)
    this.state = {
      currentStep: 1,
      stepOneStatus: 'wait',
      stepTwoStatus: 'wait',
      stepThreeStatus: 'wait',
      stepFourStatus: 'wait',
    }
  }

  renderStepComponent() {
    const {currentStep} = this.state
    switch (currentStep) {
      case 1:
        return(<PublishIndex onNext={this.onNext} />)
      case 2:
        return(<Organizer onNext={this.onNext} onBack={this.onBack} />)
      case 3:
        return(<Award onNext={this.onNext} onBack={this.onBack} />)
      case 4:
        return(<Gifts onBack={this.onBack} />)
      default:
        return(<PublishIndex onNext={this.onNext} />)
    }
  }

  onBack = () => {
    const {currentStep} = this.state
    if(currentStep > 1) {
      this.setState({currentStep: currentStep - 1})
    }
  }

  onNext = () => {
    const {currentStep} = this.state
    if(currentStep < 4) {
      this.setState({currentStep: currentStep + 1})
    }
  }

  render() {
    const {currentStep, stepOneStatus, stepTwoStatus, stepThreeStatus, stepFourStatus} = this.state
    return (
      <div className={styles.page}>
        <WhiteSpace />
        <Steps current={currentStep} direction="horizontal" size="small">
          <Step title={<div className={styles.stepTitle}>简介</div>} status={stepOneStatus}/>
          <Step title={<div className={styles.stepTitle}>主办方</div>} status={stepTwoStatus}/>
          <Step title={<div className={styles.stepTitle}>奖品</div>} status={stepThreeStatus}/>
          <Step title={<div className={styles.stepTitle}>礼品</div>} status={stepFourStatus}/>
        </Steps>
        {this.renderStepComponent()}
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
  }
}

const mapDispatchToProps = {

}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PublishVote))
