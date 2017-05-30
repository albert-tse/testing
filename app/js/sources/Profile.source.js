import alt from '../alt'
import moment from 'moment'
import AuthStore from '../stores/Auth.store'
import UserStore from '../stores/User.store';
import Config from '../config'
import ProfileActions from '../actions/Profile.action'
import API from '../api.js'

var ProfileSource = {

    getProfiles() {
        return {
            remote() {
                var token = AuthStore.getState().token;
                return API.get(`${Config.apiUrl}/profiles/?token=${token}`)
                    .then(response => Promise.resolve(response.data.data));
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
            remote(state, profile_id, influencer_id, platform_profile_id, profile_picture, profile_name) {
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
            },

            success: ProfileActions.loadedProfiles,
            loading: ProfileActions.loadingProfiles,
            error: ProfileActions.confirmProfileError
        }
    },

    deleteProfile() {
        return {
            remote(state, profile_id) {
                var token = AuthStore.getState().token;

                var url = `${Config.apiUrl}/profiles/${profile_id}?token=${token}`;

                return API.delete(url)
                    .then(function(response) {
                        return Promise.resolve(response.data.data);
                    });
            },

            success: ProfileActions.loadedProfiles,
            loading: ProfileActions.loadingProfiles,
            error: ProfileActions.deleteProfileError
        }
    },

    /**
     * Updates a profile given profileId
     * @return {object}
     */
    updateProfile() {
        return {
            /**
             * @param {object} payload to update profile with
             * @param {number} payload.profileId identifies profile to update
             */
            remote(state, payload, bypassRemote) {
                console.log('updateProfile', state, payload, bypassRemote);
                return Promise.resolve(payload);
            },
            success: ProfileActions.updatedProfile,
            loading: ProfileActions.updatingProfile,
            error: ProfileActions.updatingProfileFailed
        }
    }
};

export default ProfileSource;
