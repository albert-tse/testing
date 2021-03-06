import alt from '../alt';
import ArticleActions from '../actions/Article.action';
import ArticleSource from '../sources/Article.source';
import UserStore from '../stores/User.store';
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
            handleEditUTM: ArticleActions.EDIT_UTM,
            handleUpdated: ArticleActions.UPDATED,
            handleOpenArticleView: ArticleActions.OPEN_ARTICLE_VIEW
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

    handleUpdated({ statusText }) {
        if (statusText.toLowerCase() === 'ok') {
            this.setState({
                articles: { ...this.articles, [this.editingArticle.ucid]: this.editingArticle },
                editingArticle: null
            });
        }
    }

    handleOpenArticleView(payload) {
        this.setState({ viewing: payload });
    }

    getArticle(ucid) {
        if (this.articles[ucid]) {
            if ((new Date()).getTime() - this.articles._cachedAt > refreshRate) {
                this.getInstance().fetchArticles([ucid])
            }

            const article = this.articles[ucid];

            return article;
        } else {
            // TODO: is there a better way?
            _.defer(() => this.getInstance().fetchArticles([ucid]));
            var loading = _.assign({}, articleIsLoadingObject);
            loading.ucid = ucid;

            var articles = this.articles;
            articles[ucid] = loading;

            _.defer(
                () => this.setState({articles: articles})
            );

            return loading;
        }
    }

    addArticles(articles) {
        var newArticles = this.articles;
        const siteBudgetPercents = UserStore.getSiteBudgetPercents();
        articles.forEach(article => {
            newArticles[article.ucid] = {
                ...article,
                capPercentage: siteBudgetPercents[article.site_id]
            };
        });

        this.setState({
            articles: newArticles
        });
    }
}

export default alt.createStore(ArticleStore, 'ArticleStore');
