import { defer, find, findIndex, pick } from 'lodash';

import alt from '../alt'
import Config from '../config/'
import moment from 'moment-timezone'
import {keys, each} from 'lodash'

import ProfileSource from '../sources/Profile.source'
import ProfileActions from '../actions/Profile.action'

var BaseState = {
    profiles: [],
    isLoading: false,
    error: false
};

class ProfileStore {

    constructor() {
        Object.assign(this, BaseState);

        this.registerAsync(ProfileSource);
        this.bindActions(ProfileActions);
        this.bindListeners({
            handleLoadProfiles: ProfileActions.LOAD_PROFILES,
            handleLoadingProfiles: ProfileActions.LOADING_PROFILES,
            handleLoadedProfiles: ProfileActions.LOADED_PROFILES,
            handleLoadProfilesError: ProfileActions.LOAD_PROFILES_ERROR,
            handleUpdate: ProfileActions.UPDATE
        });
    }

    handleLoadProfiles() {
    	/*Nothing to see here*/
    }

    handleLoadingProfiles() {
    	this.setState({
    		isLoading: true
    	});
    }

    handleLoadedProfiles(profiles) {

        profiles = profiles.map(p => {
            const existingProfile = find(this.profiles, { id: p.id });

            each(keys(p.slots), day => {
                p.slots[day] = p.slots[day].map(slot => {
                    slot.time = moment('1970-01-02 ' + slot.timestamp, 'UTC');
                    delete slot.timestamp;
                    return slot;
                });
            });

            return !existingProfile ? p : {
                ...existingProfile,
                ...p
            };
        });

    	this.setState({
    		isLoading: false,
    		profiles: profiles,
    		error: false
    	});
    }

    handleLoadProfilesError(error) {
    	this.setState({
    		isLoading: false,
    		profiles: [],
    		error: error
    	});
    }

    handleUpdate(profiles) {
        this.setState({
            profiles: profiles
        });
    }

    /**
     * Update profile according to payload sent by API server
     * @param {object} updatedProfile is the profile we want to update
     */
    onUpdatedProfile(updatedProfile) {
        let profiles = [...this.profiles];
        const indexOfUpdatedProfile = findIndex(profiles, { id: updatedProfile.id });

        if (indexOfUpdatedProfile >= 0) {
            profiles[indexOfUpdatedProfile] = updatedProfile;
            this.setState({ profiles });
        }
    }

    /**
     * This is called whenever a time slot is deleted
     * @param {object} response from API server
     */
    onDeletedTimeSlots(response) {
        defer(ProfileActions.loadProfiles);
    }

    /**
     * This is called whenever time slot is added
     * @param {object} response from API server
     */
    onAddedTimeSlot(response) {
        defer(ProfileActions.loadProfiles);
    }

}

export default alt.createStore(ProfileStore, 'ProfileStore');
