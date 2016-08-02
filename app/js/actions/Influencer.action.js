import alt from '../alt';
import AppActions from '../actions/App.action';

class InfluencerActions {
    searchClicks() {
        this.dispatch();
        InfluencerStore.searchClicks();
    }

    searchedClicks(payload) {
        this.dispatch(payload);
    }

    searchClicksError(payload) {
        this.dispatch(payload);
    }

    searchLinks() {
        this.dispatch();
        InfluencerStore.searchLinks();
    }

    searchedLinks(payload) {
        AppActions.loaded();
        this.dispatch(payload);
    }

    searchLinksError(payload) {
        this.dispatch(payload);
    }

    getProjectedRevenue() {
        this.dispatch();
        InfluencerStore.projectedRevenue();
    }

    gotProjectedRevenue(payload) {
        this.dispatch(payload);
    }

    projectedRevenueError(payload) {
        this.dispatch(payload);
    }
}

export default alt.createActions(InfluencerActions);

import InfluencerStore from '../stores/Influencer.store';
