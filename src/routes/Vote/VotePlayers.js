/**
 * Created by wanpeng on 2018/1/3.
 */
import React from 'react'
import {connect} from 'react-redux'
import {Link, Route, withRouter, Switch} from 'react-router-dom'
import styles from './voteplayers.module.scss'
import {Grid, Button, WingBlank} from 'antd-mobile'
import {voteSelector, voteActions} from './redux'


class VotePlayers extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      hasMore: false
    }
  }

  componentWillMount() {
    const {voteId, fetchVotePlayersAction} = this.props
    console.log("voteId", voteId)
    fetchVotePlayersAction({
      voteId: voteId,
      limit: 10,
      success: (length) => {
        if(length === 10) {
          this.setState({hasMore: true})
        }
      },
    })
  }

  renderHasMoreBtn = () => {
    if(this.state.hasMore === false) {
      return(null)
    }
    return (
      <div>
        <WingBlank>
          <Button type="primary" onClick={this.onLoadMore}>加载更多</Button>
        </WingBlank>
      </div>
    )
  }

  onLoadMore = () => {
    const {voteId, fetchVotePlayersAction, playerList} = this.props
    let lastNumber = playerList[playerList.length - 1].number
    fetchVotePlayersAction({
      voteId: voteId,
      lastNumber: lastNumber,
      limit: 10,
      success: (length) => {
        if(length < 10) {
          this.setState({hasMore: false})
        }
      },
    })
  }

  gotoPlayer(playerId) {
    const {history} = this.props
    history.push('/vote/player/' + playerId)
  }


  renderItem = (dataItem) => {
    return(
      <div className={styles.playItem} onClick={() => this.gotoPlayer(dataItem.id)}>
        <div className={styles.cover}>
          <img className={styles.img} src={dataItem.album[0]} alt=""/>
        </div>
        <div className={styles.text}>
          <div className={styles.trip}>
            <div className={styles.num}>{dataItem.number + '号'}</div>
            <div className={styles.name}>{dataItem.name}</div>
          </div>
          <Button type="primary" size="small" inline>投票</Button>
        </div>
      </div>
    )
  }

  render() {
    const {playerList} = this.props
    return (
      <div className={styles.container}>
        <Grid
          data={playerList}
          columnNum={2}
          renderItem={this.renderItem}
          hasLine={false}
          square={false}
        />
        {this.renderHasMoreBtn()}
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const voteId = ownProps.voteId
  let playerList = voteSelector.selectVotePlayerList(state, voteId)
  return {
    playerList,
  }
}

const mapDispatchToProps = {
  ...voteActions,
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(VotePlayers))

