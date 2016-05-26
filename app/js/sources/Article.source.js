import alt from '../alt';
import axios from 'axios';
import ArticleActions from '../actions/Article.action';
import AuthStore from '../stores/Auth.store';
import Config from '../config';

var ArticleSource = {

    fetchArticles() {
        return {
            remote(state, articles) {
                var ucidList = articles.join(); // _.join(articles, ',');
                var token = AuthStore.getState().token;

                return axios.get(`${Config.apiUrl}/articles/?ucids=${ucidList}&token=${token}`)
                    .then(function (result) {
                        return result.data.data;
                    });
            },

            local(state, articles) {
                var found = articles.map(articleId => state.articles[articleId]).filter(Boolean);
                return found.length === articles.length ? found : null;
            },

            success: ArticleActions.loaded,
            loading: ArticleActions.loading,
            error: ArticleActions.error
        }
    }
};

export default ArticleSource;
