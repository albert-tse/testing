import alt from '../alt';
import axios from 'axios';
import ArticleStore from '../stores/Article.store'
import ArticleActions from '../actions/Article.action'
import AuthStore from '../stores/Auth.store'
import Config from '../config'

var ArticleSource = {

    fetchArticles() {
        return {
            remote(state, articles) {
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
