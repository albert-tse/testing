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
                    .then(function(response) {
                        return Promise.resolve(response.data.data);
                    });
            },

            success: ListActions.loaded,
            loading: ListActions.loading,
            error: ListActions.error
        }
    },

    createList() {
        return {
            remote(state, list_name, list_type) {
                var token = AuthStore.getState().token;
                var grantees = [{
                    grantee_type: 2,
                    grantee_id: UserStore.getState().user.id
                }];
                grantees = JSON.stringify(grantees);
                return axios.post(`${Config.apiUrl}/articleLists/?token=${token}`, {
                        list_type_id: list_type,
                        list_name: list_name
                    })
                    .then(function(response) {
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

                return axios.post(`${Config.apiUrl}/articleLists/${list}/add?token=${token}`, { ucids: ucidList })
                    .then(function(response) {
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

                return axios.post(`${Config.apiUrl}/articleLists/${list}/remove?token=${token}`, { ucids: ucidList })
                    .then(function(response) {
                        return Promise.resolve(response.data.data);
                    });
            },

            success: ListActions.loaded,
            loading: ListActions.loading,
            error: ListActions.error
        }
    },

    getRelatedArticlesList() {
        return {
            remote(state, ucid) {
                var token = AuthStore.getState().token;
                return axios.get(`${Config.apiUrl}/articles/find-similar?ucid=${ucid}&token=${token}`)
                    .then(function(response) {
                        var fakeList = {
                            "list_id": 'related_to_' + ucid,
                            "list_name": "Related To " + ucid,
                            "list_type_id": 1,
                            "created_at": "2016-05-16T18:57:03.000Z",
                            "owner_id": 0,
                            "owner_name": "Unknown",
                            "permissions": [{
                                "grantee_type": "2",
                                "grantee_id": 0,
                                "grantee_permission_level": 3,
                                "grantee_name": "Global"
                            }],
                            "articles": _.map(response.data.data.hits.hit, function(el) {
                                return {
                                    "list_id": 'related_to_' + ucid,
                                    "ucid": el.fields.ucid[0],
                                    "article_url": el.fields.url[0],
                                    "article_title": el.fields.title[0]
                                }
                            })
                        }

                        return Promise.resolve([fakeList]);
                    });
            },

            success: ListActions.loaded,
            loading: ListActions.loading,
            error: ListActions.error
        }
    },
};

export default ListSource;
