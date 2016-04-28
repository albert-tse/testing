import alt from '../alt'
import InfluencerActions from '../actions/Influencer.action'


class InfluencerStore {
	constructor() {
		this.influencers = [];

        this.bindListeners({
            influencerChanged: InfluencerActions.INFLUENCER_CHANGED
        });
    }
	   
    // TODO: We will be loading the available influencers for the current user from an InfluencerSource
    availableInfluencersLoaded(influencers) {}

	// This is only updating the legacy global object's selected_partner field
    influencerChanged(influencer) {
    	console.log('Influencer Changed', influencer);

    	// TODO: BAD BAD legacy code
        if (dashboardApp) {
            dashboard.selected_partner = influencer;
            dashboardApp.refreshMTDTable();
        } else if (feed) {
            feed.selected_partner = influencer;
        }
    }
}

export default alt.createStore(InfluencerStore, 'InfluencerStore');