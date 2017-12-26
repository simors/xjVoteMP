// We only need to import the modules necessary for initial render
import React from 'react'
import {Route, Switch, Redirect} from 'react-router-dom'
import Home from './Home'
import NoMatch from './NoMatch'
import LoadingPage from './Loading'
import AuthRoute from './AuthRoute'
import ErrorPage from './Error'
import {Wallet, MyVote, BePromoter} from './Me'
import {VoteDetail, PublishVote} from './Vote'

const rootRoutes = (
  <Switch>
    <Route path="/loading" component={LoadingPage}/>
    <Route path="/error" component={ErrorPage}/>
    <AuthRoute path="/wallet" component={Wallet}/>
    <AuthRoute path="/myVote" component={MyVote}/>
    <AuthRoute path="/bePromoter" component={BePromoter}/>
    <AuthRoute path="/voteDetail" component={VoteDetail}/>
      <AuthRoute path="/publishVote" component={PublishVote}/>
    <AuthRoute path="/" component={Home}/>
    <Route component={NoMatch}/>
  </Switch>
)

export default rootRoutes
