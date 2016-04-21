import React from 'react'
import Config from '../../config'
import { Header } from '../shared'

var x = "This is a string";

class Login extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id='app'>
            	<Header />
                <div className="container">
                	<div className="jumbotron">
                    	This is the login view
                    </div>
                </div>
            </div>
        );
    }
}

export default Login;
