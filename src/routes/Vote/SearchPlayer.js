/**
 * Created by wanpeng on 2018/1/17.
 */
import React from 'react'
import {connect} from 'react-redux'
import {ActivityIndicator} from 'antd-mobile'
import styles from './searchplayer.module.scss'
import {voteActions, voteSelector} from './redux'

class SearchPlayer extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      players: [],
      loading: true
    }
  }

  componentWillMount() {
    let that =  this
    const {searchVotePlayerAction, voteId, searchKey} = this.props
    searchVotePlayerAction({
      voteId: voteId,
      searchKey: searchKey,
      success: (players) => {
        that.setState({players: players, loading: false})
      },
      error: (error) => {
        that.setState({loading: false})
      }
    })
  }

  render() {
    const {players, loading} = this.state
    const {history, voteId} = this.props
    if(loading) {
      return(<ActivityIndicator toast text="正在加载" />)
    }
    if(players.length === 0) {
      return(<div style={{display: 'flex', justifyContent: 'center'}}>未搜索到结果</div>)
    }
    return(
      <div className={styles.container}>
        {
          players.map((value, index) => (
            <div className={styles.item} onClick={() => {history.replace('/player/' + voteId + '/' + value.id)}}>
              <div className={styles.avatar}>
                <img className={styles.img} src={value.album[0]} alt=""/>
              </div>
              <div className={styles.desc}>
                <div className={styles.title}>{value.number}号, {value.name}</div>
                <div className={styles.declaration}>{value.declaration}</div>
                <div className={styles.num}>票数：{value.voteNum}</div>
              </div>
            </div>
          ))
        }
      </div>
    )
  }

}

const mapStateToProps = (state, ownProps) => {
  const {match} = ownProps
  const {voteId, searchKey} = match.params
  return {
    voteId,
    searchKey,
  }
}

const mapDispatchToProps = {
  ...voteActions,
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchPlayer)
