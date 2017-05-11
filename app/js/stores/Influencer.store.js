import { find, filter, map, reduce } from 'lodash';

import alt from '../alt';
import Config from '../config/';

import UserStore from './User.store';
import ProfileStore from './Profile.store';

import InfluencerActions from '../actions/Influencer.action';
import InfluencerSource from '../sources/Influencer.source';

var BaseState = {
    projectedRevenue: 0,
    influencers: [],
    profiles: []
}

class InfluencerStore {
    constructor() {
        Object.assign(this, BaseState);

        this.registerAsync(InfluencerSource);
        this.bindActions(InfluencerActions);
        this.exportPublicMethods({});

        UserStore.listen(this.hydrate);
        ProfileStore.listen(this.hydrate);
    }

    /**
     * When new profiles are loaded, link each one to existing influencer
     */
    hydrate = () => {
        const profileState = ProfileStore.getState();
        const userState = UserStore.getState();

        this.setState(function (prevState) {
            const areResourcesLoaded = userState.isLoaded && !userState.isLoading && !profileState.isLoading;
            const { user: { influencers } } = userState;
            const { profiles } = profileState;

            if (
                areResourcesLoaded &&
                prevState.influencers !== influencers &&
                prevState.profiles !== profiles
            ) {
                console.log(profileState.profiles);
                return { jigga: 'what', profiles: profileState.profiles };
            }
        });
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
