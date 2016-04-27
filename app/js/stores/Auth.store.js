import alt from '../alt'
import AuthActions from '../actions/Auth.action'
import AuthSource from '../sources/Auth.source'
import RouteStore from './Route.store'
import Config from '../config/'
import History from '../history'
import { Router, PropTypes, locationShape, routerShape } from 'react-router'

class AuthStore {

    static config = {
        onDeserialize: function (data) {
            var deauthState = {
                isAuthenticated: false,
                expires: false,
                token: false,
                authError: false
            }

            if (data.isAuthenticated && new Date(data.expires) <= new Date()) {
                return deauthState;
            }

            return data;
        }
    }

    constructor() {
        this.isAuthenticated = false;
        this.expires = false;
        this.token = false;
        this.authError = false;

        this.registerAsync(AuthSource);

        this.bindListeners({
            handleAuthenticated: AuthActions.WAS_AUTHENTICATED,
            handleAuthenticationError: AuthActions.AUTHENTICATION_ERROR,
        });

        this.exportPublicMethods({
            deauthenticate: this.deauthenticate,
            saveSnapshot: this.saveSnapshot
        });
    }

    handleAuthenticated(result) {
        if (result && result.expires && result.token) {
            //Since we are redirecting, we are modifying the state directly and not 
            //calling set state. Set state is useless since all components will be
            //unmounted on redirect.
            this.isAuthenticated = true;
            this.expires = result.expires;
            this.token = result.token;
            this.authError = false;
            this.getInstance().saveSnapshot(this);
            History.push(Config.routes.default);
        } else {
            this.getInstance().saveSnapshot(this);
            this.getInstance().deauthenticate(this, new Error('Auth suceeded but is missing required fields.'));
        }
    }

    handleAuthenticationError(error) {
        this.getInstance().deauthenticate(this, error);
    }

    deauthenticate(store, error) {
        var newState = {
            isAuthenticated: false,
            expires: false,
            token: false,
            authError: false
        }
        if (error) {
            newState.authError = error;
        }
        store.getInstance().saveSnapshot(store);

        if (RouteStore.getState().currentRoute == Config.routes.login) {
            store.setState(newState);
        } else {
            History.push(Config.routes.login);
        }
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
