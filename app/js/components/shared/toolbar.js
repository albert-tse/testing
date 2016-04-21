import React from 'react'
import { Link } from 'react-router'
import Config from '../../config'

class Toolbar extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id="toolbar" className="navbar navbar-fixed-top navbar-default">
                <h1>I am a toolbar</h1>
            </div>
        );
    }
}

export default Toolbar;
