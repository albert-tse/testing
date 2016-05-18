import alt from '../alt'
import ArticleActions from '../actions/Article.action'
import ArticleSource from '../sources/Article.source'
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

    }

    handleLoaded(articles) {
        var thisInst = this;
        _.forEach(articles, function (article) {
            if (article) {
                article.isLoading = false;
                article.created_at = moment(article.created_at);
                thisInst.articles[article.ucid] = article;
            }
        });

        this.setState(this);
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
