import React from 'react'
import { render } from 'react-dom'
import { Router, Route, Link } from 'react-router'
import Alt from './alt'
import AuthStore from './stores/Auth.store'
import Config from './config'
import hashHistory from './history'
import RouteStore from './stores/Route.store'

import Legacy from './components/legacy'
import Login from './components/login'
import Dashboard from './components/dashboard'

//var currentRouteName = this.context.router.getCurrentPathname();

var permissions = {
    none: function (nextState, replace) {
        //If we are on the login page redirect to /, otherwise we don't care
        if (AuthStore.getState().isAuthenticated && nextState.location.pathname == Config.routes.login) {
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
            replace(Config.routes.tos);
        } else if (!AuthStore.getState().isAuthenticated) {
            replace(Config.routes.login);
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

//Override the createElement functions so that we can grab the route info for our route store
var creationIntercept = function (Component, props) {
    //RouteActions.changed(props.route.path);
    RouteStore.changeRoute(props.route.path);

    //Return the compoenent like normal
    return <Component {...props} />;
}

render(
    <Router history={hashHistory} createElement={creationIntercept}>
        <Route path={Config.routes.default} component={Legacy} onEnter={permissions.isAuthenticated}></Route>
        <Route path={Config.routes.explore} component={Legacy} onEnter={permissions.isAuthenticated}></Route>
        <Route path={Config.routes.dashboard} component={Dashboard} onEnter={permissions.isAuthenticated}></Route>
        <Route path={Config.routes.login} component={Login} onEnter={permissions.none}></Route>
    </Router>, document.getElementById('app-container')
);
