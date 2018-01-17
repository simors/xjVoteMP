/**
 * Created by wanpeng on 2017/12/25.
 */
import React from 'react'
import {connect} from 'react-redux'
import {Button, ListView, PullToRefresh, WhiteSpace, WingBlank} from 'antd-mobile'
import styles from './voteListPage.module.scss'
import {voteActions, VOTE_STATUS, voteSelector} from './redux'

class VoteListPage extends React.PureComponent {
  constructor(props) {
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
      status: [VOTE_STATUS.WAITING, VOTE_STATUS.STARTING, VOTE_STATUS.DONE, VOTE_STATUS.ACCOUNTED],
      orderedBy: 'createdAt',
      limit: 10,
    })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.voteList !== this.props.voteList) {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(nextProps.voteList),
      });
    }
  }

  onRefresh = () => {
    const {fetchVotesAction} = this.props
    this.setState({ refreshing: true, isLoading: true })
    fetchVotesAction({
      status: [VOTE_STATUS.WAITING, VOTE_STATUS.STARTING, VOTE_STATUS.DONE, VOTE_STATUS.ACCOUNTED],
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
    const {fetchVotesAction, voteList} = this.props
    if (this.state.isLoading && !this.state.hasMore) {
      return;
    }
    const lastCreatedAt = voteList[voteList.length - 1].createdAt
    this.setState({isLoading: true})
    fetchVotesAction({
      status: [VOTE_STATUS.WAITING, VOTE_STATUS.STARTING, VOTE_STATUS.DONE, VOTE_STATUS.ACCOUNTED],
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

  render() {
    const {dataSource} = this.state
    const {history} = this.props
    const row = (rowData, sectionID, rowID) => {
      let itemStyle = {

      }

      return (
        <div key={rowID} className={styles.voteItem} style={itemStyle}>
          <div className={styles.cover} onClick={() => {history.push('/vote/' + rowData.id)}}>
            <img className={styles.img} src={rowData.cover || rowData.coverSet[0]} alt=""/>
          </div>
          <WhiteSpace />
          <WingBlank>
            <div className={styles.title}>
              {rowData.title}
            </div>
            <WhiteSpace />
            <div className={styles.desc}>
              <div className={styles.like}>
                <img className={styles.icon} src={require('../../asset/images/like.png')} alt=""/>
                <div className={styles.num}>{rowData.voteNum}</div>
                投票
              </div>
              <div className={styles.hot}>
                <img className={styles.icon} src={require('../../asset/images/hot.png')} alt=""/>
                <div className={styles.num}>{rowData.pv}</div>
                热度
              </div>
            </div>
          </WingBlank>
          <WhiteSpace />
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
  const voteList = voteSelector.selectVoteList(state)
  return {
    voteList,
  }
}

const mapDispatchToProps = {
  ...voteActions,
}

export default connect(mapStateToProps, mapDispatchToProps)(VoteListPage)
