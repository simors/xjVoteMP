/**
 * Created by wanpeng on 2017/12/27.
 */
import React from 'react'
import {connect} from 'react-redux'
import styles from './organizer.module.scss'
import {Button} from 'antd-mobile'

class Gifts extends React.PureComponent {
  constructor(props) {
    super(props)
  }

  render() {
    const {onBack} = this.props
    return (
      <div>
        <Button>Gifts</Button>
        <Button onClick={onBack}>上一步</Button>
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

export default connect(mapStateToProps, mapDispatchToProps)(Gifts)
