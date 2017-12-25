/**
 * Created by wanpeng on 2017/12/25.
 */
import React from 'react'
import {connect} from 'react-redux'
import {Button} from 'antd-mobile'

class VoteListPage extends React.PureComponent {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        <Button>小吉互动</Button>
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

export default connect(mapStateToProps, mapDispatchToProps)(VoteListPage)
