import pick from 'lodash/pick';
import alt from '../alt';
import AuthStore from '../stores/Auth.store'
import UserActions from '../actions/User.action'
import NotificationStore from '../stores/Notification.store'
import Config from '../config'
import API from '../api.js';

var UserSource = {

    fetchUser() {
        return {
            remote(state, token) {
                var AuthState = AuthStore.getState();
                if (token || (AuthState.isAuthenticated && AuthState.token)) {
                    var curToken = token ? token : AuthState.token;
                    return API.get(`${Config.apiUrl}/users/me?token=${curToken}`)
                        .then(function (response) {
                            if (response.data && response.data.id) {
                                return Promise.resolve(response.data);
                            } else {
                                return Promise.reject(new Error('Malformed api response'));
                            }
                        })

                } else {
                    return Promise.reject(new Error('Unable to fetch user, because there is no authenticated user.'));
                }

            },

            success: UserActions.loadedUser,
            loading: UserActions.loadingUser,
            error: UserActions.loadUserError
        }
    },

    updateUser() {
        return {
            remote(state, data) {
                var AuthState = AuthStore.getState();
                if (AuthState.isAuthenticated && AuthState.token) {
                    return API.post(`${Config.apiUrl}/users/updateSettings?token=${AuthState.token}`, data).then(function (resp) {
                        NotificationStore.add('Your settings have been updated.');
                        return Promise.resolve(resp.data);
                    });
                } else {
                    NotificationStore.add('There was an error updating your user.');
                    return Promise.reject(new Error('Unable to update user, because there is no authenticated user.'));
                }
            },

            success: UserActions.loadedUser,
            loading: UserActions.loadingUser,
            error: UserActions.loadUserError
        }
    },

    /**
     * Update the onboarding object for this user
     */
    updateOnboardingSteps() {
        return {
            remote(state, payload) {
                const AuthState = AuthStore.getState();
                if (AuthState.isAuthenticated && AuthState.token) {
                    const updatedOnboarding = {
                        ...state.completedOnboardingAt,
                        [payload.view]: {
                            version: Config.onboardSteps[payload.view].version,
                            completed: payload.completed
                        }
                    };

                    return API.post(`${Config.apiUrl}/users/me/onboarding?token=${AuthState.token}`, updatedOnboarding).then(function (resp) {
                        return resp.data;
                    });
                }
            },

            success: UserActions.updateOnboardProgressPassed,
            error: UserActions.updateOnboardProgressFailed
        }
    },

    acceptTOS() {
        return {
            remote(state) {
                var AuthState = AuthStore.getState();
                if (AuthState.isAuthenticated && AuthState.token) {
                    return API.post(`${Config.apiUrl}/users/acceptTOS?token=${AuthState.token}&version=${Config.curTOSVersion}`)
                    .then(function (resp) {
                        return Promise.resolve();
                    });
                } else {
                    return Promise.reject(new Error('Unable to update user, because there is no authenticated user.'));
                }
            },

            success: UserActions.acceptedTos,
            error: UserActions.acceptTosError
        }
    },

    setupExternalInfluencer() {
        return {
            remote(state, data) {
                var AuthState = AuthStore.getState();
                if (AuthState.isAuthenticated && AuthState.token) {
                    return API.post(`${Config.apiUrl}/users/setupExternalInfluencer?token=${AuthState.token}`, data);
                } else {
                    return Promise.reject(new Error('Unable to update user, because there is no authenticated user.'));
                }
            },

            success: UserActions.setupExternalInfluencerDone,
            loading: UserActions.settingupExternalInfluencer,
            error: UserActions.setupExternalInfluencerError
        }
    }

};

export default UserSource;
