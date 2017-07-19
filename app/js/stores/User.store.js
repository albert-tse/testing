import pick from 'lodash/pick';

import alt from '../alt'
import AuthActions from '../actions/Auth.action'
import UserSource from '../sources/User.source'
import UserActions from '../actions/User.action'
import ProfileStore from '../stores/Profile.store';
import ProfileActions from '../actions/Profile.action';
import API from '../api.js';
import Config from '../config/'

var BaseState = {
    isLoaded: false,
    isLoading: false,
    user: {},
    loadedAt: false,
    selectedInfluencer: {},
    appVersion: Config.appVersion,
    influencers: [],
    profile: {
        url: '',
        platform: '',
        error: false
    },
    completedOnboardingAt: {
        explore: false
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
            resetUser: [AuthActions.AUTHENTICATE,AuthActions.AUTHENTICATION_ERROR,UserActions.LOAD_USER_ERROR,AuthActions.DEAUTHENTICATE],
            handleLoadedUser: UserActions.LOADED_USER,
            handleLoadingUser: [UserActions.LOADING_USER,UserActions.SETTINGUP_EXTERNAL_INFLUENCER, UserActions.ACCEPT_TOS],
            handleSetupSuccess: UserActions.SETUP_EXTERNAL_INFLUENCER_DONE,
            handleCloseWelcomeModal: UserActions.CLOSE_WELCOME_MODAL,
            handleSetupUserDone: [UserActions.SETUP_EXTERNAL_INFLUENCER_ERROR, UserActions.ACCEPTED_TOS,UserActions.ACCEPT_TOS_ERROR],
            handleCompletedOnboarding: UserActions.COMPLETED_ONBOARDING,
            updateSchedulingOption: ProfileActions.LOADED_PROFILES
        });

        this.exportPublicMethods({
            saveSnapshot: this.saveSnapshot,
            update: this.update,
            getOnboardingStepsFor: this.getOnboardingStepsFor,
            userHasPermission: this.userHasPermission,
            getSiteBudgetPercents: this.getSiteBudgetPercents
        });
    }

    /**
     * Returns with version and nextStep state of onboarding
     * activity of the User at the given view
     * @param {String} view is the page that the onboarding steps will be added
     * @return {Object} version and nextStep
     */
    getOnboardingStepsFor(view) {
        const onboardSteps = Config.onboardSteps[view];
        const user = this.getState().user;
        const completedOnboardingAt = typeof user === 'object' &&
            'completedOnboardingAt' in user &&
            user.completedOnboardingAt[view];

        if (!completedOnboardingAt) {
            return onboardSteps.steps;
        } else if (! 'steps' in onboardSteps || completedOnboardingAt && completedOnboardingAt.completed) { // no joyride steps found on this view
            return [];
        } else if  (onboardSteps.version !== completedOnboardingAt.version) { // joyride steps changed or user has never onboarded here
            return onboardSteps.steps;
        }
    }

    updateOnboardProgressPassed(payload) {
        if ('completedOnboardingAt' in payload) {
            this.setState({
                user: Object.assign({}, this.user, pick(payload, 'completedOnboardingAt'))
            });
        }
    }

    handleCloseWelcomeModal(){
        this.setState({
            showSignupModal: false
        });
        this.getInstance().saveSnapshot(this);
    }

    handleSetupSuccess(error){
        if(!error){
            var store = this;
            setTimeout(function(){
                store.setState({
                    showSignupModal: true
                });
            }, 2000);
        }

        this.handleSetupUserDone(error);
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

        const completedOnboardingAt = newState.user.completed_onboarding_at ?
            JSON.parse(newState.user.completed_onboarding_at) : {};


        const updatedUser = { ...newState.user, completedOnboardingAt: completedOnboardingAt };

        newState = {
            ...newState,
            user: updatedUser,
        };

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

    update(changes) {
        this.profile = Object.assign({}, this.profile, changes);
    }

    handleCompletedOnboarding(view) {
        this.setState({
            completedOnboardingAt: { ...this.completedOnboardingAt, ...view }
        });
        this.getInstance().saveSnapshot(this);
    }

    /**
     * Update the option to schedule posts if user connects at least one profile and
     * has permission to shcedule
     * @param {Array} profiles they currently connected with
     */
    updateSchedulingOption(profiles) {
        this.setState({
            hasConnectedProfiles: profiles.length > 0
        });
    }

    // Returns true if the current user has the specified permission name
    userHasPermission(permissionName) {
        const user = this.getState().user;
        return user && user.permissions && user.permissions.indexOf(permissionName) >= 0;
    }

    getSiteBudgetPercents() {
        const sites = [ ...this.getState().user.sites ]; // create a copy of sites
        let budgetPercents = {};

        sites.forEach(site => {
            if (site.budgetPercent) {
                budgetPercents[site.id] = parseFloat(site.budgetPercent.toFixed(2));
            }
        });

        return budgetPercents;
    }

}

//We need to create the store before we can bootstrap it
var store = alt.createStore(UserStore, 'UserStore');

//Load our authentication state from localstorage
if (window.localStorage) {

    var snapshot = localStorage.getItem(Config.userStorageToken);
    if (snapshot) {
        var savedState = JSON.parse(snapshot);

        let userShouldLogOut = API.checkUserShouldLogOut(savedState.UserStore.appVersion, Config.appVersion);

        if (!userShouldLogOut) {
            alt.bootstrap(snapshot);
        }
    }
}

export default store
