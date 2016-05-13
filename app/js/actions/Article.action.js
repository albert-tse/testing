import alt from '../alt';

class ArticleActions {

    //Action used to signify that a given articles share button has been pressed
    share(article) {
        this.dispatch(article);
    }

    //Used to signify that we should load a series of articles
    load(articles) {
        this.dispatch(articles);
        ArticleStore.fetchArticles(articles);
    }

    //Used to signify that we are loading a list of articles from the remote server
    loading(articles) {
        this.dispatch(articles);
    }

    //Used to signify that we successfully fetched a list of articles from the server
    loaded(articles) {
        this.dispatch(articles);
    }

    //Signify that we had an error while loading a list of articles. 
    //Error data contains a list of the requested articles, with and
    //error attached to each article. 
    error(data) {
        this.dispatch(data);
    }

    generateKey(platform) {
        this.dispatch(platform);
        ArticleStore.generateKey();
    }
}

export default alt.createActions(ArticleActions);

import ArticleStore from '../stores/Article.store';
