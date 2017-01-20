class ProfileActions {
    loadProfiles() {
        this.dispatch();
        ProfileStore.getProfiles();
    }

    loadingProfiles() {
        this.dispatch();
    }

    loadedProfiles(profiles) {
        this.dispatch(profiles);
    }

    loadProfilesError(error) {
        this.dispatch(error);
    }
}

export default alt.createActions(ProfileActions);

import alt from '../alt';
import Config from '../config';
import ProfileStore from '../stores/Profile.store';
