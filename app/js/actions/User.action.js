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

    setupExternalInfluencer(data) {
        this.dispatch(data);
        UserStore.setupExternalInfluencer(data);
    }

    settingupExternalInfluencer() {
        this.dispatch();
    }

    setupExternalInfluencerError() {
        this.dispatch();
    }

    setupExternalInfluencerDone() {
        this.dispatch();
        UserStore.fetchUser();
    }

    updateUser(data) {
        this.dispatch(data);
        UserStore.updateUser(data);
    }

    /**
     * This dispatches an action that would update
     * the UserStore's selected sites
     * @param array selectedSiteIds of the sites that were selected
     */
    updateSelectedSites(selectedSiteIds) {
        this.dispatch(selectedSiteIds);
    }
}

export default alt.createActions(UserActions);

//For actions we will perform our imports last. If we do this first it tends to create dependency loops. 
import alt from '../alt';
import UserStore from '../stores/User.store';
