import React from 'react'
import { render } from 'react-dom'
import { Router, Route, Link } from 'react-router'
import Alt from './alt'
import AuthStore from './stores/Auth.store'
import hashHistory from './history'

import Legacy from './components/legacy'
import Login from './components/login'

//var currentRouteName = this.context.router.getCurrentPathname();

var permissions = {
    none: function (nextState, replace) {
        //If we are on the login page redirect to /, otherwise we don't care
        if (AuthStore.getState().isAuthenticated && nextState.location.pathname == '/login') {
            replace('/');
        }
    },

    pendingOnly: function () {
        //If not logged in redirect to login
        //If not pending redirect to /
        //TODO implement this when we have tos agreement pages
    },

    isAuthenticated: function (nextState, replace) {
        if (AuthStore.getState().isPending) {
            replace('/tos');
        } else if (!AuthStore.getState().isAuthenticated) {
            replace('/login');
        }
    },

    //Use has instead
    hasPermissions: function (permissions, nextState, replace) {
        //TODO Verifies that the user had the given set of permissions
    },

    //Helper function to use when assigning perms to a route
    has: function (permissions) {
        return function (nextState, replace) {
            this.hasPermissions(permissions, nextState, replace);
        }
    }
}

window.res = render(
    <Router history={hashHistory}>
        <Route path="/" component={Legacy} onEnter={permissions.isAuthenticated}></Route>
        <Route path="/explore" component={Legacy} onEnter={permissions.isAuthenticated}></Route>
        <Route path="/dashboard" component={Legacy} onEnter={permissions.isAuthenticated}></Route>
        <Route path="/login" component={Login} onEnter={permissions.none}></Route>
    </Router>, document.getElementById('app-container')
);
