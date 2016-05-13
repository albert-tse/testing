import alt from '../alt'
import axios from 'axios'
import AuthStore from '../stores/Auth.store'
import UserStore from '../stores/User.store'
import Config from '../config'
import ListStore from '../stores/List.store'
import ListActions from '../actions/List.action'

var ListSource = {

    loadSavedList() {
        return {
            remote() {
                var token = AuthStore.getState().token;
                var grantees = [{
                    grantee_type: 2,
                    grantee_id: UserStore.getState().user.id
                }];
                grantees = JSON.stringify(grantees);
                return axios.get(`${Config.apiUrl}/articleLists/?list_types=[1]&grantees=${grantees}&grantee_perm_level=1&token=${token}`)
                    .then(function (response) {
                        return Promise.resolve(response.data.data);
                    });
            },

            success: ListActions.loaded,
            loading: ListActions.loading,
            error: ListActions.error
        }
    },

    addToList() {
        return {
            remote(state, articles, list) {
                var ucidList = _.join(articles, ',');
                var token = AuthStore.getState().token;

                return axios.post(`${Config.apiUrl}/articleLists/${list}/add?token=${token}`, {ucids: ucidList})
                    .then(function (response) {
                        return Promise.resolve(response.data.data);
                    });
            },

            success: ListActions.loaded,
            loading: ListActions.loading,
            error: ListActions.error
        }
    },

    removeFromList() {
        return {
            remote(state, articles, list) {
                var ucidList = _.join(articles, ',');
                var token = AuthStore.getState().token;

                return axios.post(`${Config.apiUrl}/articleLists/${list}/remove?token=${token}`, {ucids: ucidList})
                    .then(function (response) {
                        return Promise.resolve(response.data.data);
                    });
            },

            success: ListActions.loaded,
            loading: ListActions.loading,
            error: ListActions.error
        }
    },
};

export default ListSource;
