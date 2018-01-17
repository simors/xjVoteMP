/**
 * Created by wanpeng on 2017/12/25.
 */
import React from 'react'
import {connect} from 'react-redux'
import {Link, Route, withRouter, Switch} from 'react-router-dom'
import {Button, ListView, PullToRefresh} from 'antd-mobile'
import {voteSelector, voteActions, VOTE_SEARCH_TYPE} from '../Vote/index'
import styles from './myvote.module.scss'

class MyVote extends React.PureComponent {
  constructor(props) {
    document.title = "我的投票"
    super(props)
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    })
    this.state = {
      dataSource,
      hasMore: true,
      isLoading: true,
      refreshing: false,
    }
  }

  componentWillMount() {
    const {fetchVotesAction} = this.props
    fetchVotesAction({
      searchType: VOTE_SEARCH_TYPE.PERSONAL,
      orderedBy: 'createdAt',
      limit: 10
    })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.ownerVoteList !== this.props.ownerVoteList) {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(nextProps.ownerVoteList),
      });
    }
  }

  onRefresh = () => {
    const {fetchVotesAction} = this.props
    this.setState({ refreshing: true, isLoading: true })
    fetchVotesAction({
      searchType: VOTE_SEARCH_TYPE.PERSONAL,
      orderedBy: 'createdAt',
      limit: 10,
      success: () => {
        this.setState({refreshing: false, isLoading: false})
      },
      error: (error) => {
        this.setState({refreshing: false, isLoading: false})
        console.error(error)
      },
    })
  }

  onEndReached = (event) => {
    const {fetchVotesAction, ownerVoteList} = this.props
    if (this.state.isLoading && !this.state.hasMore) {
      return;
    }
    const lastCreatedAt = ownerVoteList[ownerVoteList.length - 1].createdAt
    this.setState({isLoading: true})
    fetchVotesAction({
      searchType: VOTE_SEARCH_TYPE.PERSONAL,
      orderedBy: 'createdAt',
      lastTime: lastCreatedAt,
      limit: 10,
      success: () => {
        this.setState({isLoading: false})
      },
      error: (error) => {
        this.setState({isLoading: false})
        console.error(error)
      },
    })
  }

  getStatus(status) {
    switch (status) {
      case 1:
        return "正在编辑"
      case 2:
        return "待支付"
      case 3:
        return "未开始"
      case 4:
        return "正在进行"
      case 5:
        return "已结束"
      case 6:
        return "已结算"
      default:
        return "未知"
    }
  }

  renderStatus(status) {
    switch (status) {
      case 1:
        return(<div style={{color: 'orange'}}>正在编辑</div>)
      case 2:
        return(<div style={{color: 'purple'}}>待支付</div>)
      case 3:
        return(<div style={{color: 'red'}}>未开始</div>)
      case 4:
        return(<div style={{color: 'green'}}>正在进行</div>)
      case 5:
        return(<div style={{color: 'blue'}}>已结束</div>)
      case 6:
        return(<div style={{color: 'black'}}>已结算</div>)
      default:
        return(<div>未知</div>)
    }
  }

  render() {
    const {dataSource} = this.state
    const {history} = this.props
    const row = (rowData, sectionID, rowID) => {
      let itemStyle = {

      }
      return (
        <div className={styles.item} key={rowID} style={itemStyle}>
          <div className={styles.thumb}>
            <img className={styles.img} src={rowData.cover} alt=""/>
          </div>
          <div className={styles.details}>
            <div className={styles.detailRow}>
              <div className={styles.title}>{rowData.title}</div>
            </div>
            <div className={styles.detailRow}>
              <div className={styles.pv}>热度：{rowData.pv}</div>
            </div>
            <div className={styles.detailRow}>
              <div className={styles.profit}>收益：¥ {rowData.profit}</div>
            </div>
            <div className={styles.detailRow}>
              <div className={styles.date}>{rowData.createdAt.split(' ')[0]}</div>
              {this.renderStatus(rowData.status)}
            </div>
          </div>
        </div>
      )
    }
    return (
      <ListView
        dataSource={dataSource}
        renderFooter={() => (<div style={{ padding: 30, textAlign: 'center' }}>
          {this.state.isLoading ? '加载中...' : '全部加载成功'}
        </div>)}
        style={{height: '100vh', overflow: 'auto'}}
        renderRow={row}
        useBodyScroll={false}
        onEndReached={this.onEndReached}
        onEndReachedThreshold={50}
        pullToRefresh={<PullToRefresh
          refreshing={this.state.refreshing}
          onRefresh={this.onRefresh}/>}
      />
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    ownerVoteList: voteSelector.selectOwnerVoteList(state)
  }
}

const mapDispatchToProps = {
  ...voteActions,
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MyVote))
