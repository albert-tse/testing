import alt from '../alt';
import axios from 'axios';
import AuthStore from '../stores/Auth.store'
import UserActions from '../actions/User.action'
import Config from '../config'

var UserSource = {

    fetchUser() {
        return {
            remote() {

                //Check Auth Store
                //Fetch User
                //Massage the Data
                var AuthState = AuthStore.getState();
                if (!AuthState.isAuthenticated || !AuthState.token) {
                    return Promise.reject(new Error('Unable to fetch user, because there is no authenticated user.'));
                } else {
                    return axios.get(`${Config.apiUrl}/users/me?token=${AuthState.token}`)
                        .then(function (response) {
                            if (response.data && response.data.id) {
                                return Promise.resolve(response.data);
                            } else {
                                return Promise.reject(new Error('Malformed api response'));
                            }
                        });
                }

            },

            success: UserActions.loadedUser,
            loading: UserActions.loadUser,
            error: UserActions.loadUserError
        }
    },

};

export default UserSource;
