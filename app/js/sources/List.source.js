import alt from '../alt'
import moment from 'moment'
import AuthStore from '../stores/Auth.store'
import UserStore from '../stores/User.store'
import Config from '../config'
import ListStore from '../stores/List.store'
import ListActions from '../actions/List.action'
import FilterStore from '../stores/Filter.store'
import API from '../api.js'

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
    },

    getRecommendedList: function(state, options) {
        var { token } = AuthStore.getState();
        var site_ids = _.map(FilterStore.getState().sites, 'id').join();

        var payload = {
            date_start: moment(0).format(),
            date_end: moment().startOf('day').add(1, 'days').format(),
            order: 'desc',
            sort: 'creation_date desc',
            trending: true,
            relevant: true,
            site_ids: site_ids,
            token: token,
            skipDate: false
        };

        return API.get(`${Config.apiUrl}/articles/search-beta`, {
            params: payload
        }).then(function (data) {
            return Promise.resolve([
                {
                    "list_id": "recommended",
                    "list_name": "Top Performing Articles",
                    "list_type_id": 0,
                    "created_at": "2016-09-21T00:10:39.000Z",
                    "owner_id": 0,
                    "owner_name": "Generated",
                    "permissions": [/* Permissions? We don't need no stinking permissions. */],
                    "articles": _.map(data.data.articles, function(el){
                        el.added_to_list_date = el.published_date;
                        return el;
                    })
                }
            ]);
        });
    },

    getCuratedExternal: function(){
        var token = AuthStore.getState().token;
        return API.get(`${Config.apiUrl}/articleLists/?list_types=[3]&include_public=true&token=${token}`)
            .then(function(response) {
                return Promise.resolve(response.data.data);
            });
    },

    getCuratedInternal: function(){
        var token = AuthStore.getState().token;
        return API.get(`${Config.apiUrl}/articleLists/?list_types=[4]&token=${token}`)
            .then(function(response) {
                return Promise.resolve(response.data.data);
            });
    },

    getTopPerforming: function() {
        const { token } = AuthStore.getState();
        const site_ids = _.map(FilterStore.getState().sites, 'id').join();
        const payload = {
            date_start: moment().subtract(7,'d').startOf('day').format(),
            date_end: moment().startOf('day').add(1, 'days').format(),
            order: 'desc',
            relevant: false,
            site_ids: site_ids,
            size: 50,
            sort: 'stat_type_95 desc', // sort by performance
            skipDate: false,
            token: token,
            trending: false
        };

        return API.get(`${Config.apiUrl}/articles/search-beta`, {
            params: payload
        }).then(data => {
            return Promise.resolve([
                {
                    list_id: 'topPerforming',
                    list_type_id: 0,
                    list_name: 'Top Performing',
                    created_at: moment().startOf('day').format(),
                    owner_id: 0,
                    owner_name: 'Generated',
                    permissions: [],
                    articles: data.data.articles.map(article => ({ ...article, added_to_list_date: article.publish_date }))
                }
            ]);
        });
    }
}

const createList = (list_name, list_type) => {
    const token = AuthStore.getState().token;
    let grantees = [{
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
                }else if(listName == 'recommended'){
                    return SpecialListQueries.getRecommendedList();
                }else if(listName == 'curated-external'){
                    return SpecialListQueries.getCuratedExternal();
                }else if(listName == 'curated-internal'){
                    return SpecialListQueries.getCuratedInternal();
                } else if (listName === 'topPerforming') {
                    return SpecialListQueries.getTopPerforming();
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

    getUserLists() {
        return {
            remote(state,) {
                var token = AuthStore.getState().token;
                var grantees = [{
                    grantee_type: 2,
                    grantee_id: UserStore.getState().user.id
                }];
                grantees = JSON.stringify(grantees);
                return API.get(`${Config.apiUrl}/articleLists/?list_types=[1,2,3,4]&grantees=${grantees}&grantee_perm_level=4&token=${token}`)
                    .then(function(response) {
                        return Promise.resolve(response.data.data);
                    });
            },

            success: ListActions.myListsLoaded,
            loading: ListActions.myListsLoading,
            error: ListActions.myListsError
        }
    },

    createList() {
        return {
            remote(state, list_name, list_type) {
                return createList(list_name, list_type)
            },

            success: ListActions.loaded,
            loading: ListActions.loading,
            error: ListActions.error
        }
    },

    createAndSaveToList() {
        return {
            remote(state, list_name, list_type, articles) {
                return createList(list_name, list_type)
                    .then(response => {
                        if (Array.isArray(response) && response.length > 0) {
                            const newList = response[0]

                            if (newList.list_id > 0) {
                                return Promise.resolve({
                                    articles,
                                    list: newList.list_id
                                })
                            }
                        } else {
                            return Promise.resolve(response)
                        }
                    })
            },

            success: ListActions.addToList,
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

    removeAllFromList() {
        return {
            remote(state, list) {
                var token = AuthStore.getState().token;

                return API.post(`${Config.apiUrl}/articleLists/${list}/removeAll?token=${token}`)
                    .then(function(response) {
                        return Promise.resolve(response.data.data);
                    });
            },

            success: ListActions.loaded,
            loading: ListActions.loading,
            error: ListActions.error
        }
    },

    renameList() {
        return {
            remote(state, listId, name) {
                var token = AuthStore.getState().token;

                return API.post(`${Config.apiUrl}/articleLists/${listId}/rename?token=${token}`, { name: name })
                    .then(function(response) {
                        return Promise.resolve(response.data.data);
                    });
            },

            success: ListActions.myListsLoaded,
            loading: ListActions.myListsLoading,
            error: ListActions.myListsError
        }
    },

    deleteList() {
        return {
            remote(state, listId) {
                var token = AuthStore.getState().token;

                return API.post(`${Config.apiUrl}/articleLists/${listId}/delete?token=${token}`)
                    .then(function(response) {
                        return Promise.resolve(response.data.data);
                    });
            },

            success: ListActions.deletedList,
            loading: ListActions.myListsLoading,
            error: ListActions.myListsError
        }
    },

    shareList() {
        return {
            remote(state, payload) {
                const { token } = AuthStore.getState();
                const { emails, listId, permissionLevel } = payload;
                const endpoint = `${Config.apiUrl}/articleLists/${listId}/permissions`;

                const requests = emails.map(email => {
                    return API.post(endpoint, {
                        token,
                        permissionLevel,
                        targetEmail: email
                    });
                });

                return Promise.all(requests).then(responses => {
                    return responses;
                });
            },

            success: ListActions.sharedList,
            error: ListActions.sharedList
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
