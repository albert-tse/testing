import alt from '../alt'
import moment from 'moment'
import AuthStore from '../stores/Auth.store'
import Config from '../config'
import ProfileActions from '../actions/Profile.action'
import API from '../api.js'

var ProfileSource = {

    getProfiles() {
        return {
            remote() {
				var token = AuthStore.getState().token;
				return API.get(`${Config.apiUrl}/profiles/?token=${token}`)
					.then(function(response) {
						return Promise.resolve(response.data.data);
					});
            },

            success: ProfileActions.loadedProfiles,
            loading: ProfileActions.loadingProfiles,
            error: ProfileActions.loadProfilesError
        }
    },

    getFBPages() {
        return {
            remote(profile_id) {
				var token = AuthStore.getState().token;
				return API.get(`${Config.apiUrl}/profiles/getFBPages?profile_id=${profile_id}&token=${token}`)
					.then(function(response) {
						return Promise.resolve(response.data.data);
					});
            }
        }
    },

    confirmProfile() {
        return {
            remote(profile_id, influencer_id, platform_profile_id) {
				var token = AuthStore.getState().token;
				return API.get(`${Config.apiUrl}/profiles/?profile_id=${profile_id}&influencer_id=${influencer_id}&platform_profile_id=${platform_profile_id}&token=${token}`)
					.then(function(response) {
						return Promise.resolve(response.data.data);
					});
            }
        }
    },
};

export default ProfileSource;
