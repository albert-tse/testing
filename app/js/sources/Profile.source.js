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
            remote(profile_id, influencer_id, platform_profile_id, profile_picture, profile_name) {
                var token = AuthStore.getState().token;

                var url = `${Config.apiUrl}/profiles/confirmProfile?profile_id=${profile_id}&influencer_id=${influencer_id}&token=${token}`;

                if(platform_profile_id != undefined){
                    url += `&platform_profile_id=${encodeURIComponent(platform_profile_id)}`;
                }

                if(profile_picture != undefined){
                    url += `&profile_picture=${encodeURIComponent(profile_picture)}`;
                }
                
                if(profile_name != undefined){
                    url += `&profile_name=${encodeURIComponent(profile_name)}`;
                }
				return API.get(url)
					.then(function(response) {
						return Promise.resolve(response.data.data);
					});
            }
        }
    },
};

export default ProfileSource;
