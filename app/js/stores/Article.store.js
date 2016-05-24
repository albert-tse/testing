import alt from '../alt'
import ArticleActions from '../actions/Article.action'
import ArticleSource from '../sources/Article.source'
import moment from 'moment'
import Config from '../config/'
import History from '../history'

var BaseState = {
    articles: {}
}

var articleIsLoadingObject = {
    isLoading: true
};

class ArticleStore {

    constructor() {
        _.assign(this, BaseState);

        this.registerAsync(ArticleSource);

        this.bindListeners({
            handleLoad: ArticleActions.LOAD,
            handleLoading: ArticleActions.LOADING,
            handleLoaded: ArticleActions.LOADED,
            handleError: ArticleActions.ERROR,
        });

        this.exportPublicMethods({
            getArticle: ::this.getArticle
        });
    }

    handleLoad(articles) {
    }

    handleLoading(articles) {
        this.setState({
            articles: {}
        });
    }

    handleLoaded(articles) {
        var currentArticles = this.articles;
        articles.forEach(article => {
            if (article) {
                article.isLoading = false;
                article.createdAt = moment(article.created_at);
                currentArticles[article.ucid] = article;
            }
        });

        this.setState({
            articles: currentArticles
        });
    }

    handleError(data) {

    }

    getArticle(ucid) {
        if (this.articles[ucid]) {
            return this.articles[ucid];
        } else {
            var loading = _.assign({}, articleIsLoadingObject);
            loading.ucid = ucid;
            return loading;
        }
    }
}

export default alt.createStore(ArticleStore, 'ArticleStore');
