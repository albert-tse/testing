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
                }

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
                //TODO Figure out how to make sure the pop up window opens 
                // even with a popup blocker. And/or figure out how to detect a blocker. 
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

    authenticateTwitter() {
        return {
            remote(state, credentials) {
                var fetchRequestToken = function () {
                    return axios.get(`${Config.apiUrl}/auth/twitter/getOAuthToken`);
                }

                var showTwitterPopup = function (response) {
                    var url = response.data.oauth_uri;
                    var h = 740;
                    var w = 768;

                    // Fixes dual-screen position                         Most browsers      Firefox
                    var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
                    var dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;

                    var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
                    var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

                    var left = ((width / 2) - (w / 2)) + dualScreenLeft;
                    var top = ((height / 2) - (h / 2)) + dualScreenTop;

                    var newWindow = window.open(url, '', 'scrollbars=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);

                    if (newWindow) {
                        if (window.focus && newWindow.focus) {
                            newWindow.focus();
                        }

                        return Promise.resolve(newWindow);
                    } else {
                        //We couldn't create the popup. Probably due to popup blocker stuff (safari).
                        return Promise.reject(new Error('Failed to open a child window.'));
                    }
                }

                var waitForPopupReply = function (newWindow) {
                    return new Promise(function (resolve, reject) {
                        var checkChildWindow = function () {
                            if (newWindow.closed) {
                                clearInterval(interval);
                                reject(new Error('The user closed the pop up prematurley.'));
                            } else {
                                var childLocation;
                                try {
                                    childLocation = newWindow.document.location;
                                    if (childLocation.hostname) { //Sometimes when the window opens it starts at about:black. We ignore these windows
                                        clearInterval(interval);
                                        var search = childLocation.search.substring(1);;
                                        newWindow.close();
                                        var params = _
                                            .chain(search.split('&'))
                                            .map(function (params) {
                                                var p = params.split('=');
                                                return [p[0], decodeURIComponent(p[1])];
                                            })
                                            .object()
                                            .value();

                                        resolve(params);
                                    }
                                } catch (err) {
                                    //Just squelch the error, it means they are simply still on the Twitter side of things
                                }
                            }
                        }
                        var interval = setInterval(checkChildWindow, 100);
                    });
                }

                var exchangeTwitToken = function (response) {
                    return axios.get(`${Config.apiUrl}/auth/twitter/authenticate?oauth_token=${response.oauth_token}&oauth_verifier=${response.oauth_verifier}`)
                }

                return fetchRequestToken()
                    .then(showTwitterPopup)
                    .then(waitForPopupReply)
                    .then(exchangeTwitToken)
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

};

export default AuthSource;
