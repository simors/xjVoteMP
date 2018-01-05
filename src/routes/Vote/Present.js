/**
 * Created by wanpeng on 2018/1/3.
 */
import React from 'react'
import {connect} from 'react-redux'
import {Link, Route, withRouter, Switch} from 'react-router-dom'
import styles from './present.module.scss'

class Present extends React.PureComponent {
  constructor(props) {
    super(props)
    document.title = '送礼物'
  }

  render() {
    return(
      <div className={styles.container}>

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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Present))

