import alt from '../alt'
import ArticleActions from '../actions/Article.action'
import ArticleSource from '../sources/Article.source'
import Config from '../config/'
import History from '../history'

var BaseState = {
    articles: []
}

class ArticleStore {

    static config = {}

    constructor() {
        _.assign(this, BaseState);

        this.registerAsync(ArticleSource);

        this.bindListeners({
            handleLoad: ArticleActions.LOAD,
            handleLoading: ArticleActions.LOADING,
            handleLoaded: ArticleActions.LOADED,
            handleError: ArticleActions.ERROR,
        });

        this.exportPublicMethods({});
    }

    handleLoad(articles) {

    }

    handleLoading(articles) {

    }

    handleLoaded(articles) {
        console.log(articles);
    }

    handleError(data) {

    }


}

export default alt.createStore(AuthStore, 'ArticleStore');
