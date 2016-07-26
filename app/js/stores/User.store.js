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
    selectedInfluencer: {},
    appVersion: Config.appVersion,
    profile: {
        url: '',
        platform: '',
        error: false,
        isVerifying: false,
        isVerified: false
    }
};

class UserStore {

    static config = {
        onDeserialize: function (data) {
            data.isLoading = false;
            if (data.setupUserError) {
                delete data.setupUserError;
            }
            return data;
        }
    };

    constructor() {
        Object.assign(this, BaseState);

        this.registerAsync(UserSource);
        this.bindActions(UserActions);
        this.bindListeners({
            resetUser: [AuthActions.AUTHENTICATE,AuthActions.AUTHENTICATION_ERROR,UserActions.LOAD_USER_ERROR,UserActions.LOAD_USER,AuthActions.DEAUTHENTICATE],
            handleLoadedUser: UserActions.LOADED_USER,
            handleLoadingUser: [UserActions.LOADING_USER,UserActions.SETTINGUP_EXTERNAL_INFLUENCER, UserActions.ACCEPT_TOS],
            handleSetupUserDone: [UserActions.SETUP_EXTERNAL_INFLUENCER_DONE, UserActions.SETUP_EXTERNAL_INFLUENCER_ERROR, UserActions.ACCEPTED_TOS,UserActions.ACCEPT_TOS_ERROR],
        });

        this.exportPublicMethods({
            saveSnapshot: this.saveSnapshot
        });
    }

    handleSetupUserDone(error) {
        var newState = {
            isLoading: false
        }

        if (error) {
            if(error instanceof Error){
                newState.setupUserError = {
                    error_message: error.message,
                    error_code: error.code,
                    hash: false
                };
            } else {
                newState.setupUserError = error.data.data.error;
            }
        } else {
            newState.setupUserError = false;
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

    verifyingProfileUrl() {
        this.profile = Object.assign({}, this.profile, {
            isVerifying: true,
            isVerified: false,
            error: false,
        });
    }

    markProfileUrlVerified(payload) {
        let changes = {
            isVerifying: false
        };

        if (payload.data.profile_exists) {
            changes.isVerified = true; // Dispatch an action here when results are in
        } else {
            console.error('Error: profile_exists was not returned by the API server');
            Object.assign(changes, {
                isVerified: false,
                error: 'We connot verify this profile at the moment.'
            });
        }

        this.profile = Object.assign({}, this.profile, changes);
    }

    profileNotFound(payload) {
        if (!payload.data.profile_exists) {
            this.profile = Object.assign({}, this.profile, {
                isVerified: false,
                isVerifying: false,
                error: "Sorry, we couldn't view your profile. Please verify the URL."
            });
        }
    }

}

//We need to create the store before we can bootstrap it
var store = alt.createStore(UserStore, 'UserStore');

//Load our authentication state from localstorage
if (window.localStorage) {
    var snapshot = localStorage.getItem(Config.userStorageToken);
    if (snapshot) {
        var savedState = JSON.parse(snapshot);
        if (savedState.UserStore.appVersion === Config.appVersion) {
            alt.bootstrap(snapshot);
        }
    }
}

export default store
