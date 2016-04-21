import React from 'react'
import Config from '../../config'
import { Header } from '../shared'

class Login extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        window.fbAsyncInit = function () {
            FB.init({
                appId: Config.facebookAppId,
                xfbml: true,
                version: 'v2.5'
            });
        };

        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {
                return;
            }
            js = d.createElement(s);
            js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    }

    facebookLogin() {
        FB.getLoginStatus(function (response) {
            if (response.status === 'connected') {

                // the user is logged in to FB and has authenticated our app
                // In this case we the user doesn't actually need to see
                // the fb login prompt, we can just get their info and log into the site. 

                var signedRequest = response.authResponse.signedRequest;
                console.log('Signed request when already signed in', signedRequest);
            } else {
                // The user is in one of the various un-authorized states
                // Login / AUthorize them with the FB.login call

                FB.login(function (response) {
                    if (response.authResponse) {
                        var signedRequest = response.authResponse.signedRequest;
                        console.log('Signed request when not signed in initially', signedRequest);
                    } else {
                        console.log('User cancelled login or did not fully authorize.');
                    }
                });
            }
        });
    }

    render() {
        return (
            <div id='app'>
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
