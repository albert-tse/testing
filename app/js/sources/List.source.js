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
                var ucidList = _.join(articles, ',');
                var token = AuthStore.getState().token;

                return axios.get(`${Config.apiUrl}/articles/?ucids=${ucidList}&token=${token}`);
            },

            success: UserActions.loaded,
            loading: UserActions.loading,
            error: UserActions.error
        }
    },

    addToList() {
        return {
            remote(state, articles, list) {
                var ucidList = _.join(articles, ',');
                var token = AuthStore.getState().token;

                return axios.get(`${Config.apiUrl}/articles/?ucids=${ucidList}&token=${token}`);
            },

            success: UserActions.loaded,
            loading: UserActions.loading,
            error: UserActions.error
        }
    },

    reamoveFromList() {
        return {
            remote(state, articles, list) {
                var ucidList = _.join(articles, ',');
                var token = AuthStore.getState().token;

                return axios.get(`${Config.apiUrl}/articles/?ucids=${ucidList}&token=${token}`);
            },

            success: UserActions.loaded,
            loading: UserActions.loading,
            error: UserActions.error
        }
    },
};

export default ArticleSource;
