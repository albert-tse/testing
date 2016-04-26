import alt from '../alt';
import axios from 'axios';
import AuthActions from '../actions/Auth.action';
import Config from '../config'

var AuthSource = {
    authenticateFacebook() {
        return {
            remote(state, credentials) {
                return new Promise(function (resolve, reject) {
                    //Exchange an access token for an api token
                    var exchangeFBToken = function (accessToken) {
                        axios.get(`${Config.apiUrl}/auth/fb/authenticate/?access_token=${accessToken}`).then(function (response) {
                            if (response.data && response.data.token && response.data.expires) {
                                return resolve(response.data);
                            } else {
                                return reject(new Error('API Failed to return a valid token'));
                            }
                        }, reject);
                    };

                    //Use FBJS to get a user access token
                    FB.getLoginStatus(function (response) {
                        if (response.status === 'connected') {
                            exchangeFBToken(response.authResponse.accessToken);
                        } else {
                            FB.login(function (response) {
                                if (response.authResponse) {
                                    exchangeFBToken(response.authResponse.accessToken);
                                } else {
                                    reject(new Error('Facebook was unable to authenticate this user.'));
                                }
                            });
                        }
                    });

                });
            },

            success: AuthActions.wasAuthenticated,
            loading: AuthActions.authenticating,
            error: AuthActions.authenticationError
        }
    },

    authenticateGoogle() {
        return {
            remote(state, credentials) {
                console.log('Unimplemented: Can\'t login with credentials yet', state, this);
                return axios.get(`${Config.apiUrl}/auth/google/token?access_token=1234`);
            },

            success: AuthActions.wasAuthenticated,
            loading: AuthActions.authenticating,
            error: AuthActions.authenticationError
        }
    },

    authenticateTwitter() {
        return {
            remote(state, credentials) {
                console.log('Unimplemented: Can\'t login with credentials yet', state, this);
                return axios.get(`${Config.apiUrl}/auth/google/token?access_token=1234`);
            },

            success: AuthActions.wasAuthenticated,
            loading: AuthActions.authenticating,
            error: AuthActions.authenticationError
        }
    },

};

export default AuthSource;
