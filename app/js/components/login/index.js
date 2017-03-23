import AltContainer from 'alt-container'
import React, { Component } from 'react'
import Config from '../../config'
import AuthActions from '../../actions/Auth.action'
import AuthStore from '../../stores/Auth.store'
import LoginComponent from './login.component'
import PublisherLoginComponent from './publisher.component'
import History from '../../history'

export default class Login extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        AuthStore.listen(this.onAuthChange);
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
            <AltContainer
                store={ AuthStore }
                inject={{
                    error_code: this.props.params.code,
                    hash: this.props.params.hash,
                    route_state: this.props.params.state,
                    authTypes: this.AuthTypes
                }}
                component={LoginComponent}
            >
            </AltContainer>
        );
    }

    AuthTypes = [{
        text: 'Facebook',
        action: function (role, referral) {
            auth0.login({
              connection: 'facebook',
              scope: 'openid name email',
              state: `role=${role}&ref=${referral}`
            });
        }
    }, {
        text: 'Google',
        action: function (role, referral) {
            auth0.login({
              connection: 'google-oauth2',
              scope: 'openid name email',
              state: `role=${role}&ref=${referral}`
            });
        }
    }, {
        text: 'Twitter',
        action: function (role, referral) {
            auth0.login({
              connection: 'twitter',
              scope: 'openid name email',
              state: `role=${role}&ref=${referral}`
            });
        }
    }];
}
