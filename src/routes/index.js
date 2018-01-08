// We only need to import the modules necessary for initial render
import React from 'react'
import {Route, Switch, Redirect} from 'react-router-dom'
import Home from './Home'
import NoMatch from './NoMatch'
import LoadingPage from './Loading'
import AuthRoute from './AuthRoute'
import ErrorPage from './Error'
import {Wallet, MyVote, BePromoter, Withdraw} from './Me'
import {Vote, Player, Present} from './Vote'
import Publish, {Organizer, Award, Gifts} from './Publish'

const rootRoutes = (
  <Switch>
    <Route path="/loading" component={LoadingPage}/>
    <Route path="/error" component={ErrorPage}/>
    <AuthRoute path="/wallet" component={Wallet}/>
    <AuthRoute path="/myVote" component={MyVote}/>
    <AuthRoute path="/withdraw" component={Withdraw}/>
    <AuthRoute path="/bePromoter" component={BePromoter}/>
    <AuthRoute path="/vote/player/present/:playerId" component={Present}/>
    <AuthRoute path="/vote/player/:playerId" component={Player}/>
    <AuthRoute path="/vote/:voteId" component={Vote}/>
    <Route path="/publish/organizer" component={Organizer}/>
    <Route path="/publish/award" component={Award}/>
    <Route path="/publish/gifts" component={Gifts}/>
    <Route path="/publish" component={Publish}/>
    <AuthRoute path="/" component={Home}/>
    <Route component={NoMatch}/>
  </Switch>
)

export default rootRoutes
