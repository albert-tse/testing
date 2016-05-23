import alt from '../alt'
import InfluencerActions from '../actions/Influencer.action'


class InfluencerStore {
    constructor() {
        this.influencers = [];

        this.bindListeners({
            influencerChanged: InfluencerActions.INFLUENCER_CHANGED
        });
    }

    // TODO: We will be loading the available influencers for the user store
    availableInfluencersLoaded(influencers) {}

    // This is only updating the legacy global object's selected_partner field
    influencerChanged(influencer) {
        console.log('Influencer Changed', influencer);

        // TODO: BAD BAD legacy code
        if (typeof dashboardApp !== 'undefined') { // XXX: for some reason it doesn't just return falsy value if undefined when inside this function. strict mode?
            dashboard.selected_partner = influencer;
            dashboardApp.refreshMTDTable();
        } else if (feed) {
            feed.selected_partner = influencer;
        }
    }
}

export default alt.createStore(InfluencerStore, 'InfluencerStore');
