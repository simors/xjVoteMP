/**
 * Created by wanpeng on 2018/1/19.
 */
import React from 'react'
import {Link, Route, withRouter, Switch} from 'react-router-dom'
import styles from './manplayer.module.scss'
import {connect} from 'react-redux'
import {Button, ListView, PullToRefresh, SwipeAction, Modal, Toast} from 'antd-mobile'
import {voteActions, voteSelector} from './redux'

class ManPlayer extends React.PureComponent {
  constructor(props) {
    super(props)
    document.title = "选手管理"
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    })
    this.state = {
      dataSource,
      hasMore: true,
      isLoading: false,
      refreshing: false,
    }
  }

  componentWillMount() {
    const {fetchVotePlayersAction, voteId} = this.props
    fetchVotePlayersAction({
      voteId: voteId,
      limit: 10,
      success: (length) => {
      },
    })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.playerList !== this.props.playerList) {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(nextProps.playerList),
      });
    }
  }

  onRefresh = () => {
    const {fetchVotePlayersAction, voteId, playerList} = this.props
    this.setState({ refreshing: true, isLoading: true })

    fetchVotePlayersAction({
      voteId: voteId,
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
    const {fetchVotePlayersAction, playerList, voteId} = this.props
    if (this.state.isLoading && !this.state.hasMore) {
      return;
    }
    let lastNumber = playerList[playerList.length - 1].number
    this.setState({isLoading: true})
    fetchVotePlayersAction({
      voteId: voteId,
      lastNumber: lastNumber,
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

  onDeletePlayer(player) {
    Toast.loading('请稍后', 0)
    const {disablePlayerAction, } = this.props
    disablePlayerAction({
      playerId: player.id,
      disable: true,
      success: () => {
        Toast.hide()
      }
    })
  }

  render() {
    const {dataSource} = this.state
    const row = (rowData, sectionID, rowID) => {
      let itemStyle = {

      }
      return (
        <SwipeAction autoClose
                     right={[
                       {
                         text: '删除',
                         onPress: () => Modal.alert('删除', '确认删除「' + rowData.name + "」?", [
                           { text: '取消', onPress: () =>{} },
                           { text: '确认', onPress: () => this.onDeletePlayer(rowData) },
                         ]),
                         style: { backgroundColor: '#F4333C', color: 'white' },
                       },
                     ]}
        >
          <div className={styles.item} key={rowID} style={itemStyle}>
            <div className={styles.thumb}>
              <img className={styles.img} src={rowData.album[0]} alt=""/>
            </div>
            <div className={styles.details}>
              <div className={styles.detailRow}>
                <div>{rowData.number}号, {rowData.name}</div>
              </div>
              <div className={styles.detailRow}>
                <div>{rowData.declaration}</div>
              </div>
              <div className={styles.detailRow}>
                <div style={{color: 'red'}}>票数：{rowData.voteNum}</div>
              </div>
            </div>
          </div>
        </SwipeAction>
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
  const {match} = ownProps
  const {voteId} = match.params
  let playerList = voteSelector.selectVotePlayerList(state, voteId)
  return {
    voteId: voteId,
    playerList,
  }
}

const mapDispatchToProps = {
  ...voteActions,
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ManPlayer))
