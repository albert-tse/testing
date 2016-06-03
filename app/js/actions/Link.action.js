import alt from '../alt';

class LinkActions {
    generateLink(payload) {
        this.dispatch(payload);
        LinkStore.generateLink(payload);
    }

    generatedLink(payload) {
        this.dispatch(payload);
    }

    generateLinkError(payload) {
        this.dispatch(payload);
    }
}

export default alt.createActions(LinkActions);

import LinkStore from '../stores/Link.store';
