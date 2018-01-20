/**
 * Created by wanpeng on 2017/12/25.
 */
import * as redux from './redux'
import VoteListPage from './VoteListPage'
import Vote from './Vote'
import VoteDetail from './VoteDetail'
import Player from './Player'
import Present from './Present'
import SearchPlayer from './SearchPlayer'
import ManPlayer from './ManPlayer'

/* export saga */
export const voteSaga = redux.voteSaga

/* export reducer */
export const voteReducer = redux.voteReducer

/* export action */
export const voteActions = redux.voteActions

/* export selector */
export const voteSelector = redux.voteSelector

export default VoteListPage
export { Vote, VoteDetail, Player, Present, SearchPlayer, ManPlayer }

export const VOTE_SEARCH_TYPE = redux.VOTE_SEARCH_TYPE
export const VOTE_STATUS = redux.VOTE_STATUS
