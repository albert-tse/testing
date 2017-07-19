import defer from 'lodash/defer';

import alt from '../alt'
import moment from 'moment-timezone'
import AuthStore from '../stores/Auth.store'
import UserStore from '../stores/User.store';
import Config from '../config'
import ProfileActions from '../actions/Profile.action'
import API from '../api.js'

const timezones = moment.tz.names();

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
             * @param {object} state current state of profiles store
             * @param {object} profileToUpdate profile to update
             */
            remote(state, profileToUpdate) {
                const { token } = AuthStore.getState();
                const url = `${Config.apiUrl}/profiles/${profileToUpdate.id}?token=${token}`;

                return API.put(url, profileToUpdate).then(function updateProfileResponse(response) {
                    if (response.status === 200) {
                        const { data: updatedProfile } = response.data;
                        return updatedProfile;
                    } else {
                        return Promise.reject(response);
                    }
                });
            },
            success: ProfileActions.updatedProfile,
            loading: ProfileActions.updatingProfile,
            error: ProfileActions.updatingProfileFailed
        }
    },

    /**
     * Deletes an array of time slots given set of id's
     * @param {object} payload contains profileId to update and the timeslot id to remove
     * @param {number} payload.profileId identifies profile to update
     * @param {array} payload.timeSlots contains profile ids to delete
     * @return {object}
     */
    deleteTimeSlots() {
        return {
            remote(state, {profileId, timeSlots}) {
                const { token } = AuthStore.getState();
                const url = `${Config.apiUrl}/profiles/${profileId}/slots?token=${token}`;
                const data = {
                    slots: timeSlots
                };

                return API.delete(url, { data }).then(function deleteTimeSlotsResponse(response) {
                    if (response.status === 200) {
                        return response;
                    } else {
                        return Promise.reject(response);
                    }
                });
            },

            success: ProfileActions.deletedTimeSlots,
            error: ProfileActions.deletingTimeSlotsFailed
        };
    },

    /**
     * Adds a timeslot to specified profile
     * @return {object}
     */
    addTimeSlot() {
        /**
         * @param {object} state of profiles store
         * @param {object} payload contains profile to update and timeslot info
         * @param {number} payload.profileId determines which profile to add new time slot to
         * @param {object} request contains object specifying the hours (24-hour format) of the timeslots and which days they will be on
         */
        return {
            remote(state, { profileId, request }) {
                const { token } = AuthStore.getState();
                const url = `${Config.apiUrl}/profiles/${profileId}/slots?token=${token}`;
                const data = {
                    slots: request
                };

                return API.post(url, data).then(function addTimeSlotResponse(response) {
                    if (response.status === 200) {
                        return response.data;
                    } else {
                        return Promise.reject(response);
                    }
                });
            },

            success: ProfileActions.addedTimeSlot,
            error: ProfileActions.addingTimeSlotFailed
        };
    }
};

export default ProfileSource;
