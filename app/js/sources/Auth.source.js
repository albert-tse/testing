import alt from '../alt';
import axios from 'axios';
import AuthActions from '../actions/Auth.action';
import Config from '../config'

var AuthSource = {
    authenticateFacebook() {
        return {
            remote(state, credentials) {
                var fbLogin = function () {
                    return new Promise(function (resolve, reject) {
                        FB.getLoginStatus(function (response) {
                            if (response.status === 'connected') {
                                resolve(response.authResponse.accessToken);
                            } else {
                                FB.login(function (response) {
                                    if (response.authResponse) {
                                        resolve(response.authResponse.accessToken);
                                    } else {
                                        reject(new Error('Facebook was unable to authenticate this user.'));
                                    }
                                });
                            }
                        });
                    });
                }

                var exchangeFBToken = function (accessToken) {
                    return axios.get(`${Config.apiUrl}/auth/fb/authenticate/?access_token=${accessToken}`);
                };

                return fbLogin()
                    .then(exchangeFBToken)
                    .then(function (response) {
                        if (response.data && response.data.token && response.data.expires) {
                            return Promise.resolve(response.data);
                        } else {
                            return Promise.reject(new Error('API Failed to return a valid token'));
                        }
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
                var initGoogleAuth = function () {
                    return new Promise(function (resolve, reject) {
                        if (gapi.auth2) {
                            resolve();
                        } else {
                            gapi.load('auth2', function (result) {
                                gapi.auth2.init({
                                    client_id: Config.googleClientId,
                                    scope: Config.googleAuthScope
                                });
                                resolve();
                            });
                        }
                    });
                }

                var authorizeGoogleUser = function () {
                    var GoogleAuth = gapi.auth2.getAuthInstance();
                    if (GoogleAuth.isSignedIn.get()) {
                        return Promise.resolve(GoogleAuth.currentUser.get());
                    } else {
                        return GoogleAuth.signIn();
                    }
                }

                var exchangeGAToken = function (user) {
                    var id_token = user.hg.id_token;
                    return axios.get(`${Config.apiUrl}/auth/google/token?access_token=${id_token}&type=id_token`)
                }

                return initGoogleAuth()
                    .then(authorizeGoogleUser)
                    .then(exchangeGAToken)
                    .then(function (response) {
                        if (response.data && response.data.token && response.data.expires) {
                            Promise.resolve(response.data);
                        } else {
                            Promise.reject(new Error('API Failed to return a valid token'));
                        }
                    });
            },

            success: AuthActions.wasAuthenticated,
            loading: AuthActions.authenticating,
            error: AuthActions.authenticationError
        }
    },

    authenticateTwitter() {
        return {
            remote(state, credentials) {
                var err = new Error('Unimplemented: Can\'t login with twitter credentials yet');
                return new Promise(function (resolve, reject) {
                    reject(err);
                });
            },

            success: AuthActions.wasAuthenticated,
            loading: AuthActions.authenticating,
            error: AuthActions.authenticationError
        }
    },

};

export default AuthSource;
