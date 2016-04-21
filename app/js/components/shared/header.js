import React from 'react'
import { Link } from 'react-router'
import Config from '../../config'

class Header extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <nav id='Header' className="navbar navbar-default">
                <div className="container-fluid">
                    <div className="navbar-header">
                        <Link className="navbar-brand" to="/">
                            <img alt="Brand" src="images/logo.svg" />
                        </Link>
                    </div>
                </div>
            </nav>
        );
    }
}

export default Header;
