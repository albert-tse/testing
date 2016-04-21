import React from 'react';
import { render } from 'react-dom'
import { Router, Route, Link, useRouterHistory } from 'react-router'
import Alt from './alt';
import { createHashHistory } from 'history'
const hashHistory = useRouterHistory(createHashHistory)({ queryKey: false })

import Legacy from './components/legacy';
import Login from './components/login';

console.log(hashHistory);

render(
    <Router history={hashHistory}>
        <Route path="/" component={Legacy}></Route>
        <Route path="/explore" component={Legacy}></Route>
        <Route path="/dashboard" component={Legacy}></Route>
        <Route path="/login" component={Login}></Route>
    </Router>, document.getElementById('app-container')
);
