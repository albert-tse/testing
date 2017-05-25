import { find, pick } from 'lodash';

import alt from '../alt'
import Config from '../config/'

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

}

export default alt.createStore(ProfileStore, 'ProfileStore');
