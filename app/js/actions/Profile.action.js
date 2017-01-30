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

    confirmProfile(profile_id, influencer_id, platform_profile_id, profile_picture, profile_name) {
        this.dispatch(profile_id, influencer_id, platform_profile_id, profile_picture, profile_name);
        ProfileStore.confirmProfile(profile_id, influencer_id, platform_profile_id, profile_picture, profile_name);
    }

    confirmProfileError(error) {
        this.dispatch(error);
    }
}

export default alt.createActions(ProfileActions);

import alt from '../alt';
import Config from '../config';
import ProfileStore from '../stores/Profile.store';
