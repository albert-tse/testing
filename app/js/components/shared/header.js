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
                        <ul className="nav navbar-nav navbar-left show-user">
                            <li className="tab active"><Link id="explore" to="/explore" data-name="explore">Explore</Link></li>
                            <li className="tab"><Link id="my-links" to="/dashboard" data-name="stats">Dashboard</Link></li>
                        </ul>
                        <div className="navbar-text navbar-right">
                            <a type="button" id="settings"><i className="fa fa-lg fa-ellipsis-v"></i></a>
                        </div>
                        <div className="navbar-right">
                            <a id="greeting" className="navbar-text show-user"><i className="fa fa-user"></i></a>
                            <a id="g-signin2" className="navbar-text show-guest"></a>
                            <select id="partner" className="navbar-text show-user"></select>
                        </div>
                    </nav>
                </div>
            </header>
        );
    }
}

export default Header;
