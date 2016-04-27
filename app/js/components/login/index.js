import React from 'react'
import Config from '../../config'
import AuthActions from '../../actions/Auth.action'
import AuthStore from '../../stores/Auth.store'
import { Header, Facebook } from '../shared/index'

class Login extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {}

    facebookLogin() {
        AuthActions.authenticate({ method: 'facebook' });
    }

    googleLogin() {
        AuthActions.authenticate({ method: 'google' });
    }

    twitterLogin() {
        AuthActions.authenticate({ method: 'twitter' });
    }

    render() {
        return (
            <div id='app'>
                <Facebook />
                <Header />
                <div className="container">
                    <div className="jumbotron">
                        <button onClick={this.googleLogin}> Google </button>
                        <button onClick={this.facebookLogin}> Facebook </button>
                        <button onClick={this.twitterLogin}> Twitter </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default Login;
