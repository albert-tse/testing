import { defer } from 'lodash';

class ProfileActions {
    loadProfiles() {
        UserStore.getState().isSchedulingEnabled && defer(ProfileStore.getProfiles);
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

    update(profiles) {
        this.dispatch(profiles);
    }

    deleteProfile(profile_id) {
        this.dispatch(profile_id);
        ProfileStore.deleteProfile(profile_id);
    }

    deleteProfileError(error) {
        this.dispatch(error);
    }

    /**
     * Updates a profile with a new timezone
     * @param {object} payload to be sent to API server
     * @param {number} payload.profileId identifies profile to be updated
     * @param {string} payload.timezone new timezone to assign to profile
     */
    updateTimezone(payload) {
        ProfileStore.updateProfile(payload);
    }

    /**
     * Updates a profile
     * @param {object} payload profile id and set of properties to extend profile with
     * @param {boolean} bypassRemote set to true if you only want to update locally
     */
    updateProfile(payload, bypassRemote = false) {
        ProfileStore.updateProfile(payload, bypassRemote);
    }

    /**
     * Dispatched when Profile is updated
     * @param {object} response from the API server
     */
    updatedProfile(response) {
        this.dispatch(response);
    }

    /**
     * Dispatched once request is started
     */
    updatingProfile() {
        this.dispatch();
    }

    /**
     * Dispatched when profile failed to update
     * @param {object} response contains the error message
     */
    updatingProfileFailed(response) {
        this.dispatch(response);
    }
}

export default alt.createActions(ProfileActions);

import alt from '../alt';
import Config from '../config';
import ProfileStore from '../stores/Profile.store';
import UserStore from '../stores/User.store';
