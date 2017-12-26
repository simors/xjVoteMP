/**
 * Created by wanpeng on 2017/12/25.
 */
import React from 'react'
import {connect} from 'react-redux'
import {Link, Route, withRouter, Switch} from 'react-router-dom'
import {Button} from 'antd-mobile'

class Wallet extends React.PureComponent {
  constructor(props) {
    document.title = "钱包"
    super(props)
  }


  render() {
    return (
      <div>
        <Button>钱包</Button>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Wallet))
