/**
 * Created by yangyang on 2017/9/3.
 */
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link, Route, withRouter, Switch} from 'react-router-dom'
import './style.scss'
import {Button} from 'antd-mobile'


class Home extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    let {match} = this.props
    return (
      <div>
        <Button type="primary">antd-mobile</Button>
      </div>
    )
  }
}

const mapStateToProps = (appState, ownProps) => {
  return {
  }
}

const mapDispatchToProps = {
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Home))
