import React from 'react';
import { render } from 'react-dom'
import { Router, Route, Link, hashHistory } from 'react-router'
import App from './components/app';
import Alt from './alt';

/*render(<App />, document.getElementById('app-container'));*/

render(
    <Router history={hashHistory}>
    <Route path="/" component={App}>
    </Route>
  </Router>, document.getElementById('app-container'))
