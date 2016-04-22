import React from 'react'
import { Link } from 'react-router'
import Config from '../../config'

class Header extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <header id="header" className="navbar navbar-fixed-top navbar-default">
                <div className="container-fluid">
                    <div className="navbar-header">
                        <Link className="navbar-brand" to="/">
                            <strong>Content Portal</strong>
                        </Link>
                    </div>
                    <nav className="navbar-collapse">
                        <ul className="nav navbar-nav navbar-left">
                            <li className="tab active"><Link id="explore" to="/explore" data-name="explore">Explore</Link></li>
                            <li className="tab"><Link id="my-links" to="/dashboard" data-name="stats">Dashboard</Link></li>
                        </ul>
                        <div className="navbar-right">
                            <i id="login-icon" className="fa fa-user navbar-text"> </i>
                            <a id="g-signin2" className="navbar-text"></a>
                        </div>
                    </nav>
                </div>
            </header>
        );
    }
}

export default Header;
