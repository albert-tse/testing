import alt from '../alt';
import AppActions from '../actions/App.action';

class InfluencerActions {
    
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

    monthlyPayoutError(error) {
        console.error('Error: Could not get payout for the selected influencer', error);
    }

    gotDailyClicks(payload) {
        this.dispatch(payload);
    }
}

export default alt.createActions(InfluencerActions);

import InfluencerStore from '../stores/Influencer.store';
