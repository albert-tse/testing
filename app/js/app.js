import Config from './config';

if (Config.sentry && Config.sentry.dsn) {
    Raven.config(Config.sentry.dsn).install();
}

Promise.config({
    cancellation: true
});

import React from 'react';
import { render } from 'react-dom';
import { IndexRoute, Router, Route, Link } from 'react-router';
import Alt from './alt';
import AuthStore from './stores/Auth.store';
import AuthActions from './actions/Auth.action';
import UserStore from './stores/User.store';

import hashHistory from './history';
import RouteStore from './stores/Route.store';

import App from './components/app/App.component';
import { AppBars } from './components/shared/AppBar.component';
import Explore from './components/explore';
import Login from './components/login';
import SignUp from './components/signup';
import Terms from './components/signup/termsOnly';
import Related from './components/related';
import Articles from './components/articles';
import Analytics, { Dashboard, Accounting, GlobalStats } from './components/analytics';
import Settings from './components/settings';
import Links from './components/links';
import Home from './components/home';

//import SharedContent from './components/sharedContent';

var permissions = {
    none: function (nextState, replace) {
        //If we are on the login page redirect to /, otherwise we don't care
        if (AuthStore.getState().isAuthenticated && nextState.location.pathname == Config.routes.login) {
            replace(Config.routes.default);
        }
    },

    setupOnly: function (nextState, replace) {
        if (!AuthStore.getState().isAuthenticated) {
            //If not logged in, redirect to login
            replace(Config.routes.login);
        } else if (!UserStore.getState().user) {
            //If we are logged in but do not have a user. Log out and redirect to login
            AuthActions.deauthenticate();
            replace(Config.routes.login);
        } else if (UserStore.getState().user.tos_version != Config.curTOSVersion && UserStore.getState().user.is_setup) {
            replace(Config.routes.terms);
        } else if (UserStore.getState().user.is_setup) {
            replace(Config.routes.default);
        }
    },

    termsOnly: function (nextState, replace) {
        if (!AuthStore.getState().isAuthenticated) {
            //If not logged in, redirect to login
            replace(Config.routes.login);
        } else if (!UserStore.getState().user) {
            //If we are logged in but do not have a user. Log out and redirect to login
            AuthActions.deauthenticate();
            replace(Config.routes.login);
        } else if (!UserStore.getState().user.is_setup) {
            replace(Config.routes.signup);
        } else if (UserStore.getState().user.tos_version == Config.curTOSVersion) {
            replace(Config.routes.default);
        }
    },

    isAuthenticated: function (nextState, replace) {
        if (!AuthStore.getState().isAuthenticated) {
            //If not logged in, redirect to login
            replace(Config.routes.login);
        } else if (!UserStore.getState().user) {
            //If we are logged in but do not have a user. Log out and redirect to login
            AuthActions.deauthenticate();
            replace(Config.routes.login);
        } else if (!UserStore.getState().user.is_setup) {
            //If are logged in, but have not finished signup, redirect to signup
            replace(Config.routes.signup);
        } else if (UserStore.getState().user.tos_version != Config.curTOSVersion) {
            //If are logged in, but have not finished signup, redirect to signup
            replace(Config.routes.terms);
        }
    },

    //Use the has method instead
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
    RouteStore.changeRoute(props.route.path);

    //Return the compoenent like normal
    return <Component {...props} />;
}

// Extend String class to transform underscored names to camelCase
String.prototype.toCamelCase = function () {
    return this.replace(/_\w/g, function (letters) {
        return letters[1].toUpperCase();
    });
};

//Intialize Auth0 and make it available to the whole app
window.auth0 = new Auth0(Config.auth0Settings);

var tokenRegex = /^#token=(.*)\&expires=(.*)$/;
if(tokenRegex.test(window.location.hash)){
    //If we are passed an auth token via a param
    //Update the localStorage so that it get injected into out AuthStore
    var token = window.location.hash.match(tokenRegex)[1];
    var expires = window.location.hash.match(tokenRegex)[2];

    AuthActions.wasAuthenticated({
        token: token,
        expires: expires
    });
    UserStore.fetchUser().then(function(){
        hashHistory.push(Config.routes.default);
        renderContempo();
    },function(err){
        var newRoute = Config.routes.loginErrorHash;
        newRoute = newRoute.replace(':code', err.data.data.error.error_code);
        newRoute = newRoute.replace(':hash', err.data.data.error.hash);
        AuthStore.deauthenticate();
        hashHistory.push(newRoute);
        window.location.reload();
    });
} else {
    renderContempo();
}

function renderContempo(){
    console.log('Current Contempo Version:', Config.appVersion);

    render(
        <Router history={hashHistory} createElement={creationIntercept}>
            <Route component={App}>
                <Route path={Config.routes.default} component={Home} onEnter={permissions.isAuthenticated}></Route>
                <Route path={Config.routes.success} component={Home} onEnter={permissions.isAuthenticated} isFromSignUp={true}></Route>
                <Route path={Config.routes.explore} component={Explore} onEnter={permissions.isAuthenticated}></Route>
                <Route path={Config.routes.relevant} component={Explore} onEnter={permissions.isAuthenticated}></Route>
                <Route path={Config.routes.trending} component={Explore} onEnter={permissions.isAuthenticated}></Route>
                <Route path={Config.routes.recommended} component={Explore} onEnter={permissions.isAuthenticated}></Route>
                <Route path={Config.routes.curated} component={Explore} onEnter={permissions.isAuthenticated}></Route>
                <Route path={Config.routes.internalCurated} component={Explore} onEnter={permissions.isAuthenticated}></Route>
                <Route path={Config.routes.saved} component={Explore} onEnter={permissions.isAuthenticated}></Route>
                <Route path={Config.routes.list} component={Explore} onEnter={permissions.isAuthenticated}></Route>
                <Route path={Config.routes.analytics} component={Analytics} onEnter={permissions.isAuthenticated}>
                    <IndexRoute component={Accounting} />
                    <Route path={Config.routes.accounting} component={Accounting} />
                    <Route path={Config.routes.dashboard} component={Dashboard} />
                    <Route path={Config.routes.global} component={GlobalStats} />
                </Route>
                <Route path={Config.routes.related} component={Related} onEnter={permissions.isAuthenticated}></Route>
                <Route path={Config.routes.articles} component={Articles} onEnter={permissions.isAuthenticated}></Route>
                <Route path={Config.routes.settings} component={Settings} onEnter={permissions.isAuthenticated}></Route>
                <Route path={Config.routes.links} component={Links} onEnter={permissions.isAuthenticated}></Route>
                <Route path={Config.routes.home} component={Home} onEnter={permissions.isAuthenticated}></Route>
            </Route>
            <Route path={Config.routes.login} component={Login} onEnter={permissions.none}></Route>
            <Route path={Config.routes.loginError} component={Login} onEnter={permissions.none}></Route>
            <Route path={Config.routes.loginErrorHash} component={Login} onEnter={permissions.none}></Route>
            <Route path={Config.routes.signup} component={SignUp} onEnter={permissions.setupOnly}></Route>
            <Route path={Config.routes.terms} component={Terms} onEnter={permissions.termsOnly}></Route>
        </Router>, document.getElementById('app-container')
    );
}
