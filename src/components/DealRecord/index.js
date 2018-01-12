/**
 * Created by wanpeng on 2018/1/6.
 */
import React from 'react'
import styles from './dealrecord.scss'
import {ListView} from 'antd-mobile'

export default class DealRecord extends React.PureComponent {
  constructor(props) {
    super(props)
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    })
    this.state = {
      dataSource: dataSource,
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.record !== this.props.record) {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(nextProps.record),
      });
    }
  }

  render() {
    const {dataSource} = this.state
    const row = (rowData, sectionID, rowID) => {
      let itemStyle = {

      }
      return (
        <div key={rowID} >
        </div>
      )
    }
    return(
      <div>
        <ListView
          dataSource={dataSource}
          renderRow={row}
          useBodyScroll={false}
          onEndReached={this.onEndReached}
          onEndReachedThreshold={50}
        />
      </div>
    )
  }
}

