import React from 'react'
import Config from '../../config'
import AuthActions from '../../actions/Auth.action'
import AuthStore from '../../stores/Auth.store'
import AltContainer from 'alt-container'
import LoginComponent from './login.component'

class Login extends React.Component {

    constructor(props) {
        super(props);
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
    }]

    componentDidMount() {}

    render() {
        return (
            <AltContainer store={ AuthStore }>
                <LoginComponent authTypes={ this.AuthTypes }/>
            </AltContainer>
        );
    }
}

export default Login;
