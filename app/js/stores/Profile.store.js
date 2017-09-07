import { defer, find, findIndex, pick } from 'lodash';
import {keys, each, filter, sortBy} from 'lodash'
import moment from 'moment-timezone'

import alt from '../alt'
import Config from '../config/'
import History from '../history';

import ProfileSource from '../sources/Profile.source'
import ProfileActions from '../actions/Profile.action'

import NotificationStore from '../stores/Notification.store';
import NotificationActions from '../actions/Notification.action';

var BaseState = {
    profiles: [],
    isLoading: false,
    error: false,
    informedOfInvalidProfile: false
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
            handleUpdate: ProfileActions.UPDATE,
            handleConfirmedProfile: ProfileActions.CONFIRMED_PROFILE
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

        const numInvalidProfiles = filter(profiles, { token_error: 1 }).length;

        if (numInvalidProfiles > 0 && !this.informedOfInvalidProfile) {
            defer(NotificationStore.add, {
                label: 'Please reconnect your social profile for your posts to go through',
                onTimeout: null,
                timeout: 0,
                buttons: [{
                    label: 'Reconnect your profile',
                    onClick: this.dismissNotification
                }]
            })
        }

    	this.setState({
    		isLoading: false,
    		profiles: profiles,
    		error: false
    	});
    }

    dismissNotification = evt => {
        History.push(Config.routes.manageAccounts);
        NotificationActions.dismiss();
        this.setState({
            informedOfInvalidProfile: true
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

    handleConfirmedProfile(response) {
        this.setState({
            confirmedProfile: true
        })
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
    // Ignore the day so that the timeslots are arranged from 12AM to 11:59PM in selected profile's timezone not UTC
    each(keys(profile.slots), day => {
        const todaysDate = moment().format('YYYY-MM-DD');
        profile.slots[day] = profile.slots[day].map(slot => {
            const timeWithProfileTimezone = moment.tz(moment().format('YYYY-MM-DD') + ' ' + slot.timestamp + '+00:00', profile.timezone);
            slot.time = moment.tz(timeWithProfileTimezone.format(`${todaysDate} HH:mm:00Z`), profile.timezone);
            delete slot.timestamp;
            return slot;
        });

        profile.slots[day] = sortBy(profile.slots[day], slot => slot.time.toDate());
    });

    return profile;
}

export default alt.createStore(ProfileStore, 'ProfileStore');
