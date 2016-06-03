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
            handleSearch: LinkActions.SEARCH,
            handleSearched: LinkActions.SEARCHED,
            handleSearchError: LinkActions.SEARCH_ERROR,
        });

        this.exportPublicMethods({});
    }

    handleSearch() {
        this.state.searchResults = [];
        this.setState(this.state);
    }

    handleSearched(links) {
        this.state.searchResults = links;
        this.setState(this.state);
    }

    handleSearchError() {

    }
}

export default alt.createStore(LinkStore, 'LinkStore');
