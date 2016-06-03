import alt from '../alt';
import LinkActions from '../actions/Link.action';
import LinkSource from '../sources/Link.source';
import Config from '../config/';
import _ from 'lodash';

var BaseState = {
    searchResults: []
}

class LinkStore {
    constructor() {
        _.assign(this, BaseState);

        this.registerAsync(LinkSource);

        this.bindListeners({
            handleGenerateLink: LinkActions.GENERATE_LINK,
            handleGeneratedLink: LinkActions.GENERATED_LINK,
            handleGenerateLinkError: LinkActions.GENERATE_LINK_ERROR,
        });

        this.exportPublicMethods({});
    }

    handleGenerateLink() {
    }

    handleGeneratedLink(payload) {
        console.log(payload);
    }

    handleGenerateLinkError() {

    }
}

export default alt.createStore(LinkStore, 'LinkStore');
