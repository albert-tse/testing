import alt from '../alt'
import AuthActions from '../actions/Auth.action'
import UserSource from '../sources/User.source'
import UserActions from '../actions/User.action'
import Config from '../config/'

var BaseState = {
    isLoaded: false,
    isLoading: false,
    user: false,
    loadedAt: false,
    selectedInfluencer: {}
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
        this.bindActions(UserActions);
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

        if (this.selectedInfluencer) {
            newState.selectedInfluencer = _.assign({}, this.selectedInfluencer);
        }

        this.setState(newState);
        this.getInstance().saveSnapshot(this);
    }

    resetUser() {
        var newState = _.extend({}, BaseState);
        if (this.selectedInfluencer) {
            newState.selectedInfluencer = _.assign({}, this.selectedInfluencer);
        }

        this.setState(newState);
        this.getInstance().saveSnapshot(this);
    }

    handleLoadingUser() {}

    handleLoadedUser(userData) {
        var newState = _.extend({}, BaseState);
        newState.isLoaded = true;
        newState.user = userData;
        Object.assign(newState, { selectedSites: userData.selectedSites || _.map(userData.sites, 'id') });

        if (this.selectedInfluencer.id) {
            //We have an influencer selected, as long as the influencer is still valid, lets keep it
            var curId = this.selectedInfluencer.id;
            var influencer = _.find(userData.influencers, function (el) {
                return el.id == curId;
            });

            if (!influencer) {
                influencer = _.assign({}, userData.influencers[0]);
            }

            newState.selectedInfluencer = influencer;
        } else {
            //No influencer set, lets select the first one.
            newState.selectedInfluencer = _.assign({}, userData.influencers[0]);
        }

        newState.loadedAt = (new Date()).getTime();

        this.setState(newState);
        this.getInstance().saveSnapshot(this);
    }

    saveSnapshot(store) {
        if (window.localStorage) {
            localStorage.setItem(Config.userStorageToken, alt.takeSnapshot(store.getInstance()));
        }
    }

    onChangeSelectedInfluencer(influencer) {
        var selectedInfluencer = _.find(this.user.influencers, { id: influencer });
        if (selectedInfluencer) {
            this.setState({
                selectedInfluencer: selectedInfluencer
            });
            this.getInstance().saveSnapshot(this);
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
