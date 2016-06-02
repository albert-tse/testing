import alt from '../alt';
import InfluencerActions from '../actions/Influencer.action';
import InfluencerSource from '../sources/Influencer.source';
import Config from '../config/';
import _ from 'lodash';

var BaseState = {
    searchedClickTotals: [],
    searchedLinkTotals: []
}

class InfluencerStore {
    constructor() {
        _.assign(this, BaseState);

        this.registerAsync(InfluencerSource);

        this.bindListeners({
            handleSearchClicks: InfluencerActions.SEARCH_CLICKS,
            handleSearchedClicks: InfluencerActions.SEARCHED_CLICKS,
            handleSearchClicksError: InfluencerActions.SEARCH_CLICKS_ERROR,
            handleSearchLinks: InfluencerActions.SEARCH_LINKS,
            handleSearchedLinks: InfluencerActions.SEARCHED_LINKS,
            handleSearchLinksError: InfluencerActions.SEARCH_LINKS_ERROR,
        });

        this.exportPublicMethods({});
    }

    handleSearchClicks() {
        this.searchedClickTotals = [];
        this.setState(this);
    }

    handleSearchedClicks(clicks) {
        this.searchedClickTotals = clicks.data;
        this.setState(this);
    }

    handleSearchClicksError() {

    }

    handleSearchLinks() {
        this.searchedLinkTotals = [];
        this.setState(this);
    }

    handleSearchedLinks(links) {
        this.searchedLinkTotals = links.data;
        this.setState(this);
    }

    handleSearchLinksError() {

    }
}

export default alt.createStore(InfluencerStore, 'LinkStore');
