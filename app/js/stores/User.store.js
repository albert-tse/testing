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
            if (data.setupUserErrorCode) {
                delete data.setupUserErrorCode;
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
            var code = 'general';
            if (error.data && error.data.error_code) {
                if (error.data.error_code == 'invalid_social_profile') {
                    code = error.data.error_code;
                }
            }
            newState.setupUserErrorCode = code;
        } else {
            newState.setupUserErrorCode = false;
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
