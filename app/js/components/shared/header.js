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
                    <nav>
                        <ul className="nav navbar-nav navbar-left">
                            <li><Link to="/explore">Explore</Link></li>
                            <li><Link to="/dashboard">Dashboard</Link></li>
                        </ul>
                        <ul className="nav navbar-nav navbar-right">
                            <li><a>Signed in</a></li>
                        </ul>
                    </nav>
                </div>
            </header>
        );
    }
}

export default Header;
