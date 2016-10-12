import alt from '../alt';
import ArticleActions from '../actions/Article.action';
import ArticleSource from '../sources/Article.source';
import moment from 'moment';
import Config from '../config/';
import History from '../history';
import _ from 'lodash';

var BaseState = {
    articles: {},
    editingArticle: null
}

var articleIsLoadingObject = {
    isLoading: true
};

var refreshRate = 3 * 60 * 60 * 1000;

class ArticleStore {

    constructor() {
        _.assign(this, BaseState);

        this.registerAsync(ArticleSource);

        this.bindListeners({
            handleLoaded: ArticleActions.LOADED,
            handleError: ArticleActions.ERROR,
            handleToggled: ArticleActions.TOGGLED,
            handleEdit: ArticleActions.EDIT,
            handleEditUTM: ArticleActions.EDIT_UTM
        });

        this.exportPublicMethods({
            getArticle: ::this.getArticle,
            addArticles: ::this.addArticles
        });
    }

    handleLoaded(articles) {
        var currentArticles = this.articles;
        articles.forEach(article => {
            if (article) {
                article.isLoading = false;
                article.createdAt = moment(article.created_at);
                article._cachedAt = (new Date()).getTime();
                currentArticles[article.ucid] = article;
            }
        });

        this.setState({
            articles: currentArticles
        });
    }

    handleError(data) {

    }

    handleToggled(article) {
        const newArticles = Object.assign({}, this.articles);
        newArticles[article.ucid] = article;
        this.setState({ articles: newArticles });
    }

    handleEdit(article) {
        this.setState({
            editingArticle: article
        });
    }

    handleEditUTM(utm) {
        this.setState({
            editingArticle: { ...this.editingArticle, utm: utm } 
        });
    }

    getArticle(ucid) {
        if (this.articles[ucid]) {
            if ((new Date()).getTime() - this.articles._cachedAt > refreshRate) {
                _.defer(() => this.getInstance().fetchArticles([ucid]));
            }
            return this.articles[ucid];
        } else {
            // TODO: is there a better way?
            _.defer(() => this.getInstance().fetchArticles([ucid]));
            var loading = _.assign({}, articleIsLoadingObject);
            loading.ucid = ucid;

            var articles = this.articles;
            articles[ucid] = loading;

            this.setState({
                articles: articles
            });

            return loading;
        }
    }

    addArticles(articles) {
        var newArticles = this.articles;
        articles.forEach(article => {
            newArticles[article.ucid] = article;
        });
        this.setState({
            articles: newArticles
        });
    }
}

export default alt.createStore(ArticleStore, 'ArticleStore');
