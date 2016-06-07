import alt from '../alt';

class LinkActions {
    generateLink(payload) {
        this.dispatch(payload);
        LinkStore.generateLink(payload);
        ListAction.addToSavedList([payload])
    }

    generatedLink(payload) {
        this.dispatch(payload);
        ArticleStore.fetchArticles(payload.link.ucid);
    }

    generateLinkError(payload) {
        this.dispatch(payload);
    }
}

export default alt.createActions(LinkActions);

import LinkStore from '../stores/Link.store';
import ListAction from '../actions/List.action';
import ArticleStore from '../stores/Article.store';
