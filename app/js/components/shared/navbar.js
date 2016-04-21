import React from 'react'

import config from '../../config'

class Navbar extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id='app'>
                <nav className="navbar navbar-default navbar-fixed-top">
                    <div className="container-fluid">
                        This is the navbar
                    </div>
                </nav>
            </div>
        );
    }
}

export default Navbar;
