import alt from '../alt';
import InfluencerActions from '../actions/Influencer.action';
import InfluencerSource from '../sources/Influencer.source';
import UserStore from '../stores/User.store';
import Config from '../config/';
import { find, reduce } from 'lodash';

var BaseState = {
    projectedRevenue: 0
}

class InfluencerStore {
    constructor() {
        Object.assign(this, BaseState);

        this.registerAsync(InfluencerSource);
        this.bindActions(InfluencerActions);
        this.exportPublicMethods({});
    }
   
    gotProjectedRevenue(payload) {
        this.setState({
            projectedRevenue: payload.data.data.projectedRevenue
        });
    }

    projectedRevenueError(error) {
        console.log('projectedRevenueError', error, error.stack);
    }
}

export default alt.createStore(InfluencerStore, 'InfluencerStore');
