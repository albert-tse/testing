import React from 'react';
import { render } from 'react-dom'
import { Router, Route, Link, hashHistory } from 'react-router'
import Alt from './alt';

import Legacy from './components/legacy';
import Login from './components/login';

render(
    <Router history={hashHistory}>
    <Route path="/" component={Legacy}></Route>
    <Route path="/login" component={Login}></Route>
  </Router>, document.getElementById('app-container'))
