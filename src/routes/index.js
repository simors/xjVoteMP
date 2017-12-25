// We only need to import the modules necessary for initial render
import React from 'react'
import {Route, Switch, Redirect} from 'react-router-dom'
import Home from './Home'
import NoMatch from './NoMatch'
import LoadingPage from './Loading'
import AuthRoute from './AuthRoute'
import ErrorPage from './Error'

const rootRoutes = (
  <Switch>
    <Route path="/loading" component={LoadingPage}/>
    <Route path="/error" component={ErrorPage}/>
    <AuthRoute path="/" component={Home}/>
    <Route component={NoMatch}/>
  </Switch>
)

export default rootRoutes
