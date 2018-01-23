/**
 * Created by wanpeng on 2017/12/27.
 */
import React from 'react'
import {connect} from 'react-redux'
import {Link, Route, withRouter, Switch} from 'react-router-dom'
import styles from './gifts.module.scss'
import {Button, Grid, WhiteSpace, WingBlank, Radio, Toast} from 'antd-mobile'
import {voteActions, voteSelector} from '../Vote'

class Gifts extends React.Component {
  constructor(props) {
    document.title = "礼品及期限"
    super(props)
    this.state = {
      selectGifts: [],
    }
  }

  componentWillMount() {
    const {fetchGiftsAction} = this.props
    fetchGiftsAction({
      success: () => {},
      error: (error) => {}
    })
  }

  onBack = () => {
    const {history} = this.props
    history.goBack()
  }

  onClickRadio(giftId) {
    let selectGifts = this.state.selectGifts
    if(selectGifts.length === 6) {
      Toast.fail("最多6个礼品")
      return
    }
    if(selectGifts.includes(giftId)) {
      this.setState({selectGifts: selectGifts.filter(value => value != giftId)})
    } else {
      selectGifts.push(giftId)
      this.setState({selectGifts: selectGifts})
    }
  }

  renderItem = (dataItem) => {
    return(
      <div className={styles.giftItem}>
        <img className={styles.img} src={dataItem.photo} alt=""/>
        <div className={styles.name}>{dataItem.name}</div>
        <div className={styles.price}>{dataItem.price}点</div>
        <Radio className={styles.radio}
               checked={this.state.selectGifts.includes(dataItem.id)}
               onChange={() => this.onClickRadio(dataItem.id)} />
      </div>
    )
  }

  render() {
    const {gifts} = this.props
    return (
      <div className={styles.container}>
        <WingBlank>
          <WhiteSpace />
          <Grid
            activeStyle={false}
            data={gifts}
            renderItem={this.renderItem}
            columnNum={3}
            hasLine={false}
            square={false}
          />
        </WingBlank>
        <Button onClick={this.onBack}>上一步</Button>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    gifts: voteSelector.selectTotalGift(state),
  }
}

const mapDispatchToProps = {
  ...voteActions,
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Gifts))
