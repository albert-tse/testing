import React from 'react'
import { Link } from 'react-router'
import Config from '../../config'
import GA from './googleAnalytics'
import AuthStore from '../../stores/Auth.store'
import AuthActions from '../../actions/Auth.action'

class Header extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            auth: AuthStore.getState()
        };
    }

    componentDidMount() {
        AuthStore.listen(this.onAuthChange.bind(this));
    }

    componentWillUnmount() {
        AuthStore.unlisten(this.onAuthChange.bind(this));
    }

    onAuthChange(authState) {
        var state = this.state;
        state.auth = authState;

        this.setState(state);
    }

    generateNavbar() {
        var navBar = false;

        if (this.state.auth.isAuthenticated) {
            navBar =
                <nav className="navbar-collapse">
                    <ul className="nav navbar-nav navbar-left">
                        <li><Link id="explore" to="/explore">Explore</Link></li>
                        <li><Link id="my-links" to="/dashboard">Dashboard</Link></li>
                    </ul>
                    <div className="navbar-right">
                        <i id="login-icon" className="fa fa-user navbar-text"> </i>
                        <a id="g-signin2" className="navbar-text"></a>
                    </div>
                </nav>;
        }

        return navBar;
    }

    render() {
        return (
            <header id="header" className="navbar navbar-fixed-top navbar-default">
                <GA />
                <div className="container-fluid">
                    <div className="navbar-header">
                        <Link className="navbar-brand" to="/">
                            <strong>Content Portal</strong>
                        </Link>
                    </div>
                    { this.generateNavbar() }
                </div>
            </header>
        );
    }
}

export default Header;
