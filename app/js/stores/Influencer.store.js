import alt from '../alt';
import InfluencerActions from '../actions/Influencer.action';
import InfluencerSource from '../sources/Influencer.source';
import Config from '../config/';
import _ from 'lodash';

var BaseState = {
    searchedClickTotals: [],
    searchedLinkTotals: [], 
    testInfluencers: {
        isLoading: false,
        isLoaded: false,
        influencers: [],
        error: false
    }
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
        this.setState({
            searchedClickTotals: []
        });
    }

    handleSearchedClicks(clicks) {
        this.setState({
            searchedClickTotals: clicks.data
        });
    }

    handleSearchClicksError() {

    }

    handleSearchLinks() {
        this.setState({
            searchedLinkTotals: []
        });
    }

    handleSearchedLinks(links) {
        this.setState({
            searchedLinkTotals: links.data
        });
    }

    handleSearchLinksError() {

    }
}

export default alt.createStore(InfluencerStore, 'InfluencerStore');
