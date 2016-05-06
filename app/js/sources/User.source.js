import alt from '../alt';
import axios from 'axios';
import AuthStore from '../stores/Auth.store'
import UserActions from '../actions/User.action'
import Config from '../config'

var UserSource = {

    fetchUser() {
        return {
            remote(state, token) {
                var AuthState = AuthStore.getState();
                if (token || (AuthState.isAuthenticated && AuthState.token)) {
                    var curToken = token ? token : AuthState.token;
                    return axios.get(`${Config.apiUrl}/users/me?token=${curToken}`)
                        .then(function (response) {
                            if (response.data && response.data.id) {
                                return Promise.resolve(response.data);
                            } else {
                                return Promise.reject(new Error('Malformed api response'));
                            }
                        });
                } else {
                    return Promise.reject(new Error('Unable to fetch user, because there is no authenticated user.'));

                }

            },

            success: UserActions.loadedUser,
            loading: UserActions.loadingUser,
            error: UserActions.loadUserError
        }
    },

    setupExternalInfluencer() {
        return {
            remote(state, data) {
                var AuthState = AuthStore.getState();
                if (AuthState.isAuthenticated && AuthState.token) {
                    return axios.post(`${Config.apiUrl}/users/setupExternalInfluencer?token=${AuthState.token}`, data);
                } else {
                    return Promise.reject(new Error('Unable to update user, because there is no authenticated user.'));
                }
            },

            success: UserActions.setupExternalInfluencerDone,
            loading: UserActions.settingupExternalInfluencer,
            error: UserActions.setupExternalInfluencerError
        }
    },

};

export default UserSource;
