import alt from '../alt'
import AuthActions from '../actions/Auth.action'
import UserSource from '../sources/User.source'
import UserActions from '../actions/User.action'
import Config from '../config/'

var BaseState = {
    isLoaded: false,
    isLoading: false,
    user: false
};

class UserStore {

    static config = {
        onDeserialize: function (data) {
            data.isLoading = false;
            return data;
        }
    }

    constructor() {
        Object.assign(this, BaseState);

        this.registerAsync(UserSource);

        this.bindListeners({
            resetUser: AuthActions.AUTHENTICATE,
            resetUser: AuthActions.AUTHENTICATION_ERROR,
            resetUser: AuthActions.DEAUTHENTICATE,
            resetUser: UserActions.LOAD_USER,
            handleLoadedUser: UserActions.LOADED_USER,
            handleLoadingUser: UserActions.LOADING_USER,
            resetUser: UserActions.LOAD_USER_ERROR,
        });

        this.exportPublicMethods({
            saveSnapshot: this.saveSnapshot
        });
    }

    resetUser() {
        this.setState(BaseState);
        this.getInstance().saveSnapshot(this);
    }

    handleLoadingUser() {
        var newState = _.extend({}, BaseState);
        newState.isLoading = true;
        this.setState(newState);
        this.getInstance().saveSnapshot(this);
    }

    handleLoadedUser(userData) {
        var newState = _.extend({}, BaseState);
        newState.isLoaded = true;
        newState.user = userData;
        this.setState(newState);
        this.getInstance().saveSnapshot(this);
    }

    saveSnapshot(store) {
        if (window.localStorage) {
            localStorage.setItem(Config.userStorageToken, alt.takeSnapshot(store.getInstance()));
        }
    }

}

//We need to create the store before we can bootstrap it
var store = alt.createStore(UserStore, 'UserStore');

//Load our authentication state from localstorage
if (window.localStorage) {
    var snapshot = localStorage.getItem(Config.userStorageToken);
    if (snapshot) {
        alt.bootstrap(snapshot);
    }
}

export default store
