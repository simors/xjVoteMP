/**
 * Created by wanpeng on 2017/12/27.
 */
import React from 'react'
import {connect} from 'react-redux'
import styles from './publishIndex.module.scss'
import {Button, WhiteSpace, WingBlank} from 'antd-mobile'

class PublishIndex extends React.PureComponent {
  constructor(props) {
    super(props)
  }

  render() {
    const {onNext} = this.props
    return (
      <div>
        <WingBlank>
          <Button type="primary" onClick={onNext}>下一步</Button>
        </WingBlank>
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

export default connect(mapStateToProps, mapDispatchToProps)(PublishIndex)
