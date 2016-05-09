import alt from '../alt';
import axios from 'axios';
import AuthStore from '../stores/Auth.store'
import Config from '../config'
import ListStore from '../stores/List.store'
import ListActions from '../actions/List.action'

var ArticleSource = {

    fetchList() {
        return {
            remote(state, list) {
                var listParams = '';

                if (list == 'saved') {
                    listParams = '&list_type_id=1'
                }

                var token = AuthStore.getState().token;

                return axios.get(`${Config.apiUrl}/articleLists/?token=${token}${listParams}`);
            },

            success: ListActions.loaded,
            loading: ListActions.loading,
            error: ListActions.error
        }
    },

    addToList() {
        return {
            remote(state, articles, list) {
                /*var ucidList = _.join(articles, ',');
                var token = AuthStore.getState().token;

                return axios.get(`${Config.apiUrl}/articles/?ucids=${ucidList}&token=${token}`);*/
            },

            success: ListActions.loaded,
            loading: ListActions.loading,
            error: ListActions.error
        }
    },

    removeFromList() {
        return {
            remote(state, articles, list) {
                /*var ucidList = _.join(articles, ',');
                var token = AuthStore.getState().token;

                return axios.get(`${Config.apiUrl}/articles/?ucids=${ucidList}&token=${token}`);*/
            },

            success: ListActions.loaded,
            loading: ListActions.loading,
            error: ListActions.error
        }
    },
};

export default ArticleSource;
