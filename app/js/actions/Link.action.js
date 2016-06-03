import alt from '../alt';

class LinkActions {
    generatedLink(payload) {
        this.dispatch(payload);
    }
}

export default alt.createActions(LinkActions);

import LinkStore from '../stores/Link.store';
