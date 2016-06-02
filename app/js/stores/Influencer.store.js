import alt from '../alt';
import InfluencerActions from '../actions/Influencer.action';
import InfluencerSource from '../sources/Influencer.source';
import Config from '../config/';
import _ from 'lodash';

var BaseState = {
    searchedClickTotals: []
}

class InfluencerStore {
    constructor() {
        _.assign(this, BaseState);

        this.registerAsync(InfluencerSource);

        this.bindListeners({
            handleSearchClicks: InfluencerActions.SEARCH_CLICKS,
            handleSearchedClicks: InfluencerActions.SEARCHED_CLICKS,
            handleSearchClicksError: InfluencerActions.SEARCH_CLICKS_ERROR,
        });

        this.exportPublicMethods({});
    }

    handleSearchClicks() {
        this.searchedClickTotals = [];
        this.setState(this);
    }

    handleSearchedClicks(links) {
        this.searchedClickTotals = links;
        this.setState(this);
    }

    handleSearchClicksError() {

    }
}

export default alt.createStore(InfluencerStore, 'LinkStore');
