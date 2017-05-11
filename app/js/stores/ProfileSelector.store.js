import { filter, map } from 'lodash';

import alt from '../alt';

import UserStore from './User.store';
import ProfileStore from './Profile.store';
import ProfileActions from '../actions/Profile.action';

import ProfileSelectorActions from '../actions/ProfileSelector.action';
import ProfileSource from '../sources/Profile.source';

/**
 * Manages the state of which profiles are currently selected
 * Keeps track of state across Share Dialog, Profile dropdown, and sidebar in Calendar view
 */
class ProfileSelectorStore {

    /**
     * Listen to actions
     * and initialize with default state
     */
    constructor() {
        this.bindActions(ProfileSelectorActions);
        this.bindListeners({
            hydrate: ProfileActions.loadedProfiles
        });
        Object.assign(this, BaseState);
    }

    /**
     * Hydrate influencers with connected profiles
     * If influencer is dry, mark it as not connected so they can only generate shortlink
     * @param {array} payload.profiles connected User's influencers
     */
    hydrate(profiles) {
        const { user: { influencers } } = UserStore.getState();

        if (Array.isArray(influencers) && influencers.length > 0) {
            const hydrated = map(influencers, function (influencer) {
                return {
                    ...influencer,
                    profiles: filter(profiles, { influencer_id: influencer.id })
                };
            });

            this.setState({ influencers: hydrated });
        }
    }

    onSelectProfile(profile) {
        console.log('selecting profile', profile);
    }

    onDeselectProfile(profile) {
        console.log('deselecting profile', profile);
    }
}

const BaseState = {
    influencers: []
};

export default alt.createStore(ProfileSelectorStore, 'ProfileSelectorStore');
