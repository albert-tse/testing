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

            p = parseUTCTimeSlots(p);

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
        profiles.map(parseUTCTimeSlots);

        this.setState({
            profiles: profiles
        });
    }

    /**
     * Update profile according to payload sent by API server
     * @param {object} updatedProfile is the profile we want to update
     */
    onUpdatedProfile(updatedProfile) {
        updatedProfile = parseUTCTimeSlots(updatedProfile);
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

function parseUTCTimeSlots(profile){
    each(keys(profile.slots), day => {
        profile.slots[day] = profile.slots[day].map(slot => {
            slot.time = moment.tz(moment().format('YYYY-MM-DD') + ' ' + slot.timestamp, 'UTC').tz(profile.timezone);
            delete slot.timestamp;
            return slot;
        });
    });
    return profile;
}

export default alt.createStore(ProfileStore, 'ProfileStore');
