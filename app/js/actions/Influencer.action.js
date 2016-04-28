class InfluencerActions {

	// When the selected influencer is changed
	influencerChanged(data) {
		this.dispatch(data);
	}
}

export default alt.createActions(InfluencerActions);

//For actions we will perform our imports last. If we do this first it tends to create dependency loops. 
import alt from '../alt';
import InfluencerStore from '../stores/Influencer.store';