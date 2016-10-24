import alt from '../alt'
import AuthStore from '../stores/Auth.store'
import UserStore from '../stores/User.store'
import Config from '../config'
import ListStore from '../stores/List.store'
import ListActions from '../actions/List.action'
import API from '../api.js';

var SpecialListQueries = {
    getSavedList: function(){
        var token = AuthStore.getState().token;
        var grantees = [{
            grantee_type: 2,
            grantee_id: UserStore.getState().user.id
        }];
        grantees = JSON.stringify(grantees);
        return API.get(`${Config.apiUrl}/articleLists/?list_types=[1]&grantees=${grantees}&grantee_perm_level=1&token=${token}`)
            .then(function(response) {
                return Promise.resolve(response.data.data);
            });
    }
}

var ListSource = {

    loadSavedList() {
        return {
            remote() {
                return SpecialListQueries.getSavedList();
            },

            success: ListActions.loaded,
            loading: ListActions.loading,
            error: ListActions.error
        }
    },

    loadSpecialList() {
        return {
            remote(state, listName) {
                if(listName == 'saved'){
                    return SpecialListQueries.getSavedList();
                }
            },

            success: ListActions.loaded,
            loading: ListActions.loading,
            error: ListActions.error
        }
    },

    loadLists() {
        return {
            remote(state, listIds) {
                var token = AuthStore.getState().token;
                return API.get(`${Config.apiUrl}/articleLists/?list_ids=${JSON.stringify(listIds)}&token=${token}`)
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
                return API.post(`${Config.apiUrl}/articleLists/?token=${token}`, {
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

                if (typeof list === 'object') {
                    return Promise.reject(new Error('Error: You did not pass an appropriate list id', list));
                } else {
                    return API.post(`${Config.apiUrl}/articleLists/${list}/add?token=${token}`, { ucids: ucidList })
                        .then(function(response) {
                            var retVal = response.data.data;
                            retVal.added = ucidList.split(',');
                            return Promise.resolve(retVal);
                        });
                }
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

                return API.post(`${Config.apiUrl}/articleLists/${list}/remove?token=${token}`, { ucids: ucidList })
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
                return API.get(`${Config.apiUrl}/articles/find-similar?ucid=${ucid}&token=${token}`)
                    .then(function(response) {
                        var fakeList = {
                            "list_id": 'related_to_' + ucid,
                            "list_name": "Related To " + ucid,
                            "list_type_id": -1,
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
