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

    render() {
        return (
            <div id='app'>
                <Facebook />
                <Header />
                <div className="container">
                    <div className="jumbotron">
                        <button onClick={this.facebookLogin}> Facebook </button>
                        <a href="#/login"> Google </a>
                        <a href="#/login"> Twitter </a>
                    </div>
                </div>
            </div>
        );
    }
}

export default Login;
