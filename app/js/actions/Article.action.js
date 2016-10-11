import alt from '../alt';

class ArticleActions {

    //Action used to signify that a given articles share button has been pressed
    share(article) {
        this.dispatch(article);
    }

    generatedLink(payload) {
        this.dispatch(payload);
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

    // When an article is selected, broadcast it
    selected(articlePayload) {
        this.dispatch(articlePayload);
    }

    // When an article is deselected, broadcast too
    deselected(articlePayload) {
        this.dispatch(articlePayload);
    }

    // Toggle enable/disable article
    toggle(payload) {
        ArticleStore.toggle(payload);
    }

    toggled(articleToUpdate) {
        articleToUpdate && this.dispatch(articleToUpdate);
    }

}

export default alt.createActions(ArticleActions);

import ArticleStore from '../stores/Article.store';
