var minUserReloadDelay = 600000;

class UserActions {

    //Signify that we are about to load new user data
    loadUser() {
        this.dispatch();
        UserStore.fetchUser();
    }

    //Signify that we are loading new user data
    loadingUser() {
        this.dispatch();
    }

    //Signify that we have successfully loaded a new user
    loadedUser(userData) {
        this.dispatch(userData);
    }

    //Signify that there was an error fetching user info
    loadUserError() {
        this.dispatch();
    }

    lazyReloadUserInfo() {
        var loadedAt = UserStore.getState().loadedAt;
        if (loadedAt) {
            if ((new Date()).getTime() - loadedAt > minUserReloadDelay) {
                this.dispatch();
                UserStore.fetchUser();
            }
        }
    }

    setupExternalInfluencer(data) {
        this.dispatch(data);
        UserStore.setupExternalInfluencer(data);
    }

    settingupExternalInfluencer() {
        this.dispatch();
    }

    setupExternalInfluencerError(payload) {
        this.dispatch(payload);
    }

    setupExternalInfluencerDone() {
        this.dispatch();
        UserStore.fetchUser();
    }

    updateUser(data) {
        this.dispatch(data);
        UserStore.updateUser(data);
    }

    changeSelectedInfluencer(influencer) {
        this.dispatch(influencer);
    }

    acceptTos(payload) {
        this.dispatch(payload);
        UserStore.acceptTOS();
    }

    acceptedTos(payload) {
        this.dispatch(payload);
        UserStore.fetchUser();
    }

    acceptTosError(payload) {
        this.dispatch(payload);
    }

    verifyProfileUrl({ url }) {
        // Disect the url into profile's username and platform
        let username = url.match(/[.\-\w]+$/);
        username = Array.isArray(username) && username[0];
        let platform = url.replace(username, '').replace(/https?:\/\/|www\./g, '');

        UserStore.verifyProfile({ username, platform, url });
        this.dispatch({ platform, url });
    }

    verifyingProfileUrl() {
        this.dispatch();
    }

    /**
     * Dispatch this indicating whether or not the given profile url is valid
     * @param Object payload
     */
    markProfileUrlVerified(payload) {
        this.dispatch(payload);
    }

    profileNotFound(payload) {
        this.dispatch(payload);
    }

    completedOnboarding(view) {
        this.dispatch(view);
    }
}

export default alt.createActions(UserActions);

//For actions we will perform our imports last. If we do this first it tends to create dependency loops. 
import alt from '../alt';
import UserStore from '../stores/User.store';
