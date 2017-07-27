import React from 'react'
import {render} from 'react-dom'
import { Provider } from 'react-redux'
import { Router,Route, IndexRoute,browserHistory} from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import DevTools from './src/scripts/components/root/devtools'
import configureStore from './src/scripts/components/root/lib/store'
import NotFound from 'src/scripts/components/notfound'
import Dashboard from 'src/scripts/components/dashboard'
//{process.env.NODE_ENV === 'developer'?<DevTools />:''}
const store = configureStore()
const history = syncHistoryWithStore(browserHistory, store,{
  selectLocationState : state => state.get("routing").toJS()
})
render(
  <Provider store={store}>
  	<Router history={history} >
        <Route path="/" component={Dashboard}>
            <IndexRoute component={Dashboard} />
            <Route path="dashboard" component={Dashboard} />
        </Route>
  		<Route path="*" component={NotFound} />
  	</Router>
  </Provider>,
  document.getElementById('app')
);