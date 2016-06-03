import alt from '../alt';

class InfluencerActions {
    searchClicks() {
        this.dispatch();
        InfluencerStore.searchClicks();
    }

    searchedClicks(stats) {
        this.dispatch(stats);
    }

    searchClicksError(error) {
        this.dispatch(payload);
    }

    searchLinks() {
        this.dispatch();
        InfluencerStore.searchLinks();
    }

    searchedLinks(stats) {
        this.dispatch(stats);
    }

    searchLinksError(error) {
        this.dispatch(payload);
    }
}

export default alt.createActions(InfluencerActions);

import InfluencerStore from '../stores/Influencer.store';
