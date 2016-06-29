import alt from '../alt'
import AuthActions from '../actions/Auth.action'
import UserStore from '../stores/User.store'
import Config from '../config'
import API from '../api.js';

var processAuthResponse = function (authData) {
    if (authData.data && authData.data.token && authData.data.expires) {
        return UserStore.fetchUser(authData.data.token)
            .then(function () {
                return Promise.resolve(authData.data);
            });
    } else {
        return Promise.reject(new Error('Auth API Failed to return a valid token'));
    }
}

var AuthSource = {
    authenticateFacebook() {
        return {
            remote(state, credentials) {
                var token = null;

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
                                }, {scope: Config.facebookPermissions});
                            }
                        });
                    });
                }

                var exchangeFBToken = function (accessToken) {
                    token = accessToken;
                    return API.get(`${Config.apiUrl}/auth/fb/authenticate/?access_token=${accessToken}`);
                }

                var userDNECheck = function (error) {
                    if (!(error.data && error.data.error_code == "user_not_found" && token)) {
                        return Promise.reject(error);
                    }
                }

                var createUser = function (auth_data) {
                    if (!auth_data) {
                        return API.post(`${Config.apiUrl}/auth/create-user/facebook`, `access_token=${token}`, {
                            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                        }).then(processAuthResponse);
                    } else {
                        return auth_data;
                    }
                }

                return fbLogin()
                    .then(exchangeFBToken)
                    .then(processAuthResponse)
                    .catch(userDNECheck)
                    .then(createUser);
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
                var id_token = null;

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
                    id_token = user.hg.id_token;
                    return API.get(`${Config.apiUrl}/auth/google/token?access_token=${id_token}&type=id_token`)
                }

                var userDNECheck = function (error) {
                    if (!(error.data && error.data.error_code == "user_not_found" && id_token)) {
                        return Promise.reject(error);
                    }
                }

                var createUser = function (auth_data) {
                    if (!auth_data) {
                        return API.post(`${Config.apiUrl}/auth/create-user/google`, `access_token=${id_token}&type=id_token`, {
                            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                        }).then(processAuthResponse);
                    } else {
                        return auth_data;
                    }
                }

                return initGoogleAuth()
                    .then(authorizeGoogleUser)
                    .then(exchangeGAToken)
                    .then(processAuthResponse)
                    .catch(userDNECheck)
                    .then(createUser);
            },

            success: AuthActions.wasAuthenticated,
            loading: AuthActions.authenticating,
            error: AuthActions.authenticationError
        }
    },

    authenticateTwitter() {
        return {
            remote(state, credentials) {
                var oauth_token = null;
                var oauth_verifier = null;
                var oauth_token_secret = null;

                var fetchRequestToken = function () {
                    return API.get(`${Config.apiUrl}/auth/twitter/getOAuthToken`);
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
                                            .fromPairs()
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
                    oauth_token = response.oauth_token;
                    oauth_verifier = response.oauth_verifier;
                    return API.get(`${Config.apiUrl}/auth/twitter/authenticate?oauth_token=${response.oauth_token}&oauth_verifier=${response.oauth_verifier}`)
                }

                var userDNECheck = function (error) {
                    if (error.data && error.data.error_code == "user_not_found" && error.data.error_data && error.data.error_data.oauth_token && error.data.error_data.oauth_token_secret) {
                        oauth_token_secret = error.data.error_data.oauth_token_secret;
                        oauth_token = error.data.error_data.oauth_token;
                    } else {
                        return Promise.reject(error);
                    }
                }

                var createUser = function (auth_data) {
                    if (!auth_data) {
                        return API.post(`${Config.apiUrl}/auth/create-user/twitter`, `oauth_token=${oauth_token}&oauth_secret=${oauth_token_secret}`, {
                            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                        }).then(processAuthResponse);
                    } else {
                        return auth_data;
                    }
                }

                return fetchRequestToken()
                    .then(showTwitterPopup)
                    .then(waitForPopupReply)
                    .then(exchangeTwitToken)
                    .then(processAuthResponse)
                    .catch(userDNECheck)
                    .then(createUser);
            },

            success: AuthActions.wasAuthenticated,
            loading: AuthActions.authenticating,
            error: AuthActions.authenticationError
        }
    },

};

export default AuthSource;
