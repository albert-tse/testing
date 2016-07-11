import AltContainer from 'alt-container'
import React, { Component } from 'react'
import Config from '../../config'
import AuthActions from '../../actions/Auth.action'
import AuthStore from '../../stores/Auth.store'
import LoginComponent from './login.component'
import History from '../../history'

export default class Login extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        AuthStore.listen(this.onAuthChange);
        console.log('Auth0', Auth0);
        var auth0 = new Auth0({
            domain:       'contempo.auth0.com',
            clientID:     'Gxf9SQijfhGRw4Agk8tRjINWH7MOZUpA',
            callbackURL:  'http://contempo.dev:9000/#/login',
            callbackOnLocationHash: true
          });
        window.auth0 = auth0;
    }

    componentWillUnmount() {
        AuthStore.unlisten(this.onAuthChange);
    }

    onAuthChange() {
        if (AuthStore.getState().isAuthenticated) {
            //If the auth state change, redirect to default.
            setTimeout(function () { History.push(Config.routes.default) }, 1);
        }
    }

    render() {
        return (
            <AltContainer store={ AuthStore }>
                <LoginComponent authTypes={ this.AuthTypes }/>
            </AltContainer>
        );
    }

    AuthTypes = [{
        text: 'Facebook',
        action: function () {
            AuthActions.authenticate({ method: 'facebook' });
        }
    }, {
        text: 'Google',
        action: function () {
            AuthActions.authenticate({ method: 'google' });
        }
    }, {
        text: 'Twitter',
        action: function () {
            AuthActions.authenticate({ method: 'twitter' });
        }
    }];
}
