/**
 * Created by wanpeng on 2018/1/6.
 */
import React from 'react'
import {connect} from 'react-redux'
import styles from './dealrecord.scss'
import {meActions, meSelector} from '../../routes/Me'
import {ListView} from 'antd-mobile'

class DealRecord extends React.PureComponent {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    const {fetchDealRecordAction} = this.props
    fetchDealRecordAction({
      limit: 10,
    })
  }

  render() {

  }
}

const mapStateToProps = (state, ownProps) => {
  let dealList = meSelector.selectDealList(state)
  return {
    dealList: dealList
  }
}

const mapDispatchToProps = {
  ...meActions,
}

export default connect(mapStateToProps, mapDispatchToProps)(DealRecord)
