import alt from '../alt'
import AuthActions from '../actions/Auth.action'
import UserSource from '../sources/User.source'
import UserActions from '../actions/User.action'
import Config from '../config/'

var BaseState = {
    isLoaded: false,
    isLoading: false,
    user: false,
    selectedSites: []
};

class UserStore {

    static config = {
        onDeserialize: function (data) {
            data.isLoading = false;
            return data;
        }
    };

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
            handleLoadingUser: UserActions.SETTINGUP_EXTERNAL_INFLUENCER,
            handleSetupUserDone: UserActions.SETUP_EXTERNAL_INFLUENCER_DONE,
            handleSetupUserDone: UserActions.SETUP_EXTERNAL_INFLUENCER_ERROR,
        });

        this.exportPublicMethods({
            saveSnapshot: this.saveSnapshot
        });
    }

    handleSetupUserDone() {
        var newState = _.extend({}, BaseState);
        newState.isLoading = false;
        this.setState(newState);
        this.getInstance().saveSnapshot(this);
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
        Object.assign(newState, { selectedSites: userData.selectedSites || _.map(userData.sites, 'id') });
        this.setState(newState);
        this.getInstance().saveSnapshot(this); 

        // TODO: Since we are not on the same page as legacy, window.feed is undefined
        // in order to pass the selectedSites to feed.search.site_ids
        // I'm going to set a global variable window.site_ids
        // Remove when legacy is dead
        window.site_ids = Array.isArray(userData.selectedSites) ? userData.selectedSites.join() : '';
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

        // TODO: also remove this after removing legacy
        var selectedSites = JSON.parse(snapshot).UserStore.selectedSites.join();
        window.site_ids = selectedSites;
    }
}

export default store
