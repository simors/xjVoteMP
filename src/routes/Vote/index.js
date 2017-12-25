/**
 * Created by wanpeng on 2017/12/25.
 */
import * as redux from './redux'
import VoteListPage from './VoteListPage'

/* export saga */
export const voteSaga = redux.voteSaga

/* export reducer */
export const voteReducer = redux.voteReducer

/* export action */
export const voteActions = redux.voteActions

/* export selector */
export const voteSelector = redux.voteSelector

export default VoteListPage
