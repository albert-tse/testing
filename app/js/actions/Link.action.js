import alt from '../alt';

class LinkActions {

    // Single link
    generateLink(payload) {
        this.dispatch(payload);
        LinkStore.generateLink(payload);
        ListAction.addToSavedList([payload])
        FilterActions.clearSelection();
    }

    generatedLink(payload) {
        this.dispatch(payload);
        ArticleStore.fetchArticles(payload.link.ucid);
    }

    // Multiple links
    generateMultipleLinks() {
        this.dispatch();
        LinkStore.generateMultipleLinks();
        ListAction.addToSavedList(FilterStore.getState().ucids);
        FilterActions.clearSelection();
    }

    generatedMultipleLinks(payload) {
        this.dispatch(payload);
        ArticleStore.fetchArticles(payload.map(link => link.link.ucid));
    }

    generateLinkError(payload) {
        this.dispatch(payload);
    }

    generatedLinkError(payload) {
        this.dispatch(payload);
    }

    fetchLinks() {
        this.dispatch();
        LinkStore.fetchLinks();
    }

    fetchedLinks(payload) {
        this.dispatch(payload);
    }

    fetchLinksError(payload) {
        this.dispatch(payload);
    }

    loading() {
        this.dispatch();
    }
}

export default alt.createActions(LinkActions);

import LinkStore from '../stores/Link.store';
import ListAction from '../actions/List.action';
import ArticleStore from '../stores/Article.store';
import FilterStore from '../stores/Filter.store';
import FilterActions from '../actions/Filter.action';
