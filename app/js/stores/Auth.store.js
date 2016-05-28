import alt from '../alt'
import AuthActions from '../actions/Auth.action'
import AuthSource from '../sources/Auth.source'
import RouteStore from './Route.store'
import Config from '../config/'
import History from '../history'
import _ from 'lodash';

var BaseState = {
    isAuthenticated: false,
    authenticating: false,
    expires: false,
    token: false,
    authError: false
}

class AuthStore {

    static config = {
        onDeserialize: function (data) {
            if (!data.isAuthenticated || new Date(data.expires) <= new Date()) {
                return _.extend({}, BaseState);
            } else {
                data.authenticating = false;
                data.authError = false;

                return data;
            }
        }
    }

    constructor() {
        _.assign(this, BaseState);

        this.registerAsync(AuthSource);

        this.bindListeners({
            handleAuthenticate: AuthActions.AUTHENTICATE,
            handleAuthenticated: AuthActions.WAS_AUTHENTICATED,
            handleAuthenticationError: AuthActions.AUTHENTICATION_ERROR,
            handleDeauthenticate: AuthActions.DEAUTHENTICATE,
        });

        this.exportPublicMethods({
            deauthenticate: this.deauthenticate,
            saveSnapshot: this.saveSnapshot
        });
    }

    handleAuthenticate() {
        var state = this.getInstance().getState();
        state.authenticating = true;
        this.setState(state);
    }

    handleAuthenticated(result) {
        if (result && result.expires && result.token) {
            var newState = _.extend({}, BaseState);

            newState.isAuthenticated = true;
            newState.authenticating = false;
            newState.expires = result.expires;
            newState.token = result.token;
            newState.authError = false;

            this.setState(newState);
            this.getInstance().saveSnapshot(this);
        } else {
            this.getInstance().saveSnapshot(this);
            this.getInstance().deauthenticate(this, new Error('Auth suceeded but is missing required fields.'));
        }
    }

    handleAuthenticationError(error) {
        this.getInstance().deauthenticate(this, error);
    }

    handleDeauthenticate() {
        this.getInstance().deauthenticate(this);
    }

    deauthenticate(store, error) {
        var newState = _.extend({}, BaseState);
        if (error) {
            newState.authError = error;
        }
        store.setState(newState);
        store.getInstance().saveSnapshot(store);
    }

    saveSnapshot(store) {
        if (window.localStorage) {
            localStorage.setItem(Config.authStorageToken, alt.takeSnapshot(store.getInstance()));
        }
    }

}

//We need to create the store before we can bootstrap it
var store = alt.createStore(AuthStore, 'AuthStore');

//Load our authentication state from localstorage
if (window.localStorage) {
    var snapshot = localStorage.getItem(Config.authStorageToken);
    if (snapshot) {
        alt.bootstrap(snapshot);
    }
}

export default store
