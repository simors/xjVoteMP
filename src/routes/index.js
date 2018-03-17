// We only need to import the modules necessary for initial render
import React from 'react'
import {Route, Switch, Redirect} from 'react-router-dom'
import Home from './Home'
import NoMatch from './NoMatch'
import LoadingPage from './Loading'
import AuthRoute from './AuthRoute'
import ErrorPage from './Error'
import {Wallet, MyVote, BePromoter, Withdraw, Invite} from './Me'
import {Vote, Player, Present, SearchPlayer, ManPlayer} from './Vote'
import Publish, {Organizer, Award, Gifts, PublishType} from './Publish'
import Contact from './Contact'
import TabBarDemo from '../components/TabBar/index'

const rootRoutes = (
  <Switch>
    <Route path="/loading" component={LoadingPage}/>
    <Route path="/error" component={ErrorPage}/>
    <Route path="/tabbar" component={TabBarDemo}/>
    <AuthRoute path="/wallet" component={Wallet}/>
    <AuthRoute path="/myVote" component={MyVote}/>
    <AuthRoute path="/withdraw" component={Withdraw}/>
    <AuthRoute path="/bePromoter" component={BePromoter}/>
    <AuthRoute path="/invite" component={Invite}/>
    <AuthRoute path="/present" component={Present}/>
    <AuthRoute path="/player/:voteId/:playerId" component={Player}/>
    <AuthRoute path="/manPlayers/:voteId" component={ManPlayer} />
    <AuthRoute path="/vote/:voteId/:showType" component={Vote}/>
      <AuthRoute path="/vote/:voteId" component={Vote}/>
    <AuthRoute path="/searchPlayer/:voteId/:searchKey" component={SearchPlayer}/>
    <AuthRoute path="/publish/organizer" component={Organizer}/>
    <AuthRoute path="/publish/award" component={Award}/>
    <AuthRoute path="/publish/gifts" component={Gifts}/>
    <AuthRoute path="/publish/type" component={PublishType}/>
    <AuthRoute path="/publish" component={Publish}/>
    <Route path="/contact" component={Contact}/>
    <AuthRoute path="/" component={Home}/>
    <Route component={NoMatch}/>
  </Switch>
)

export default rootRoutes
