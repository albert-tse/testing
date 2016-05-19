import React from 'react';
import { render } from 'react-dom';
import { Router, Route, Link } from 'react-router';
import Alt from './alt';
import AuthStore from './stores/Auth.store';
import AuthActions from './actions/Auth.action';
import UserStore from './stores/User.store';
import Config from './config';
import hashHistory from './history';
import RouteStore from './stores/Route.store';

import App from './components/app/App.component';
import { AppBars } from './components/shared/AppBar.component';
import { Toolbars } from './components/toolbar';
import ExploreAppBar from './components/shared/Explore.AppBar.container';
import Legacy from './components/legacy';
import Login from './components/login';
import SignUp from './components/signup';
import SharedContent from './components/sharedContent';
import DashboardLegacy from './components/sharedContent/legacy';
import Saved from './components/saved';
import Related from './components/related';
import Settings from './components/settings';

var permissions = {
    none: function(nextState, replace) {
        //If we are on the login page redirect to /, otherwise we don't care
        if (AuthStore.getState().isAuthenticated && nextState.location.pathname == Config.routes.login) {
            replace(Config.routes.default);
        }
    },

    pendingOnly: function(nextState, replace) {
        if (!AuthStore.getState().isAuthenticated) {
            //If not logged in, redirect to login
            replace(Config.routes.login);
        } else if (!UserStore.getState().user) {
            //If we are logged in but do not have a user. Log out and redirect to login
            AuthActions.deauthenticate();
            replace(Config.routes.login);
        } else if (UserStore.getState().user.tos_version == Config.curTOSVersion) {
            replace(Config.routes.default);
        }
    },

    isAuthenticated: function(nextState, replace) {
        if (!AuthStore.getState().isAuthenticated) {
            //If not logged in, redirect to login
            replace(Config.routes.login);
        } else if (!UserStore.getState().user) {
            //If we are logged in but do not have a user. Log out and redirect to login
            AuthActions.deauthenticate();
            replace(Config.routes.login);
        } else if (UserStore.getState().user.tos_version != Config.curTOSVersion) {
            //If are logged in, but have not finished signup, redirect to signup
            replace(Config.routes.signup);
        }
    },

    //Use the has method instead
    hasPermissions: function(permissions, nextState, replace) {
        //TODO Verifies that the user had the given set of permissions
    },

    //Helper function to use when assigning perms to a route
    has: function(permissions) {
        return function(nextState, replace) {
            this.hasPermissions(permissions, nextState, replace);
        }
    }
}

//Override the createElement functions so that we can grab the route info for our route store
var creationIntercept = function(Component, props) {
    RouteStore.changeRoute(props.route.path);

    //Return the compoenent like normal
    return <Component {...props} />;
}

//TODO Delete the legacy dashboard route
render(
    <Router history={hashHistory} createElement={creationIntercept}>
        <Route component={App}>
            <Route path={Config.routes.default} components={{ main: Legacy, appBar: ExploreAppBar }} onEnter={permissions.isAuthenticated}></Route>
            <Route path={Config.routes.explore} components={{ main: Legacy, appBar: ExploreAppBar }} onEnter={permissions.isAuthenticated}></Route>
            <Route path={Config.routes.saved} components={{ main: Saved, appBar: AppBars.Saved }} onEnter={permissions.isAuthenticated}></Route>
            <Route path={Config.routes.trending} components={{ main: Legacy, appBar: ExploreAppBar }} onEnter={permissions.isAuthenticated}></Route>
            <Route path={Config.routes.recommended} components={{ main: Legacy, appBar: ExploreAppBar }} onEnter={permissions.isAuthenticated}></Route>

            <Route path={Config.routes.shared} components={{ main: SharedContent, appBar: Toolbars.Shared }} onEnter={permissions.isAuthenticated}></Route>
            <Route path={Config.routes.related} components={{ main: Related, appBar: Toolbars.Related }} onEnter={permissions.isAuthenticated}></Route>
            <Route path={Config.routes.settings} components={{ main: Settings, appBar: Toolbars.Settings }} onEnter={permissions.isAuthenticated}></Route>

            <Route path='/legacydashboard' components={{ main: DashboardLegacy, appBar: AppBars.Shared }} onEnter={permissions.isAuthenticated}></Route>
        </Route>
        <Route path={Config.routes.login} component={Login} onEnter={permissions.none}></Route>
        <Route path={Config.routes.signup} component={SignUp} onEnter={permissions.pendingOnly}></Route>
    </Router>, document.getElementById('app-container')
);
