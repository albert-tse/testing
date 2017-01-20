import pick from 'lodash/pick';

import alt from '../alt'
import ProfileSource from '../sources/Profile.source'
import ProfileActions from '../actions/Profile.action'
import Config from '../config/'

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
            handleLoadProfilesError: ProfileActions.LOAD_PROFILES_ERROR
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
    	console.log('Hi Albert');
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

}

export default alt.createStore(ProfileStore, 'ProfileStore');
