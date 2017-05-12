import { chain, includes, find, findIndex, filter, map, uniq } from 'lodash';

import alt from '../alt';
import Config from '../config';

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
            const hydrated = map(influencers, influencer => {
                return {
                    ...influencer,
                    profiles: chain(profiles)
                        .map(this.insertPlatformName)
                        .filter({ influencer_id: influencer.id })
                        .value()
                };
            });

            this.setState({ influencers: hydrated });
        }
    }

    /**
     * Directs a profile to be marked as selected given a profile id
     * @param {nummber} profileId identifies the profile
     */
    onSelectProfile(profileId) {
        this.toggleProfileSelection(profileId, true);
    }

    /**
     * Directs a profile to be marked not selected given a profile id
     * @param {number} profileId identifies the profile
     */
    onDeselectProfile(profileId) {
        this.toggleProfileSelection(profileId, false);
    }

    /**
     * Search across influencers' profiles for the profile with the matching id
     * and mark it according to the value given in markSelected
     * @param {number} profileId to match against profiles stored across User's influencers
     * @param {boolean} markSelected determines whether it should be selected or not
     */
    toggleProfileSelection(profileId, markSelected) {
        this.setState(state => {
            const influencers = [...state.influencers]; // create a new copy of influencers so pure Influencer component will update
            const profiles = this.getProfilesFrom(influencers);
            let selectedProfile = find(profiles, { id: profileId }); // this returns a reference to selected profile, but we use let because we will re-set the value to updated profile marked selected/deselected

            if (includes(profiles, selectedProfile)) {
                selectedProfile = {
                    ...selectedProfile,
                    selected: markSelected
                }; // this creates a new profile object so that pure Profile component will update

                let selectedInfluencer = find(influencers, { id: selectedProfile.influencer_id });

                if (includes(influencers, selectedInfluencer)) {
                    const updatedInfluencerProfiles = [...selectedInfluencer.profiles]; // creates a new copy of the profiles array but won't be re-setting the value, because we will update in place to keep indexes the same
                    const indexOfSelectedProfile = findIndex(updatedInfluencerProfiles, { id: profileId });
                    const indexOfSelectedInfluencer = findIndex(influencers, { id: selectedProfile.influencer_id });

                    updatedInfluencerProfiles[indexOfSelectedProfile] = selectedProfile;
                    selectedInfluencer = {
                        ...selectedInfluencer,
                        profiles: updatedInfluencerProfiles
                    };

                    influencers[indexOfSelectedInfluencer] = selectedInfluencer;

                    return { influencers };
                }
            } else {
                return false;
            }
        });
    }

    /**
     * Get all selected profiles from a set of influencers
     * @param {array<object>} influencers containing profiles
     * @param {boolean} onlySelected only return selected profiles, default: False
     * @return {array<object>} selected profiles
     */
    getProfilesFrom(influencers, onlySelected = false) {
        const profiles = chain(influencers)
            .map('profiles')
            .flatten()
            .sortBy('profile_name')
            .map(this.insertPlatformName)
            .value();

        return onlySelected ? filter(profiles, { selected: true }) : profiles;
    }

    /**
     * Get selected platforms from profiles
     * @param {array<object>} profiles
     * @return {array<string>} unique platforms from given profiles
     */
    getPlatforms(profiles) {
        return chain(profiles).map(function (p) {
            return p.platformName.toLowerCase();
        }).uniq().value();
    }

    /**
     * add platform name to the passed object
     * @param {object} profile contains platform id to check
     * @return {object} profile's platform name
     */
    insertPlatformName(profile) {
        const platform = Config.platforms[profile.platform_id];
        return {
            ...profile,
            platformName: (typeof platform !== 'undefined' && 'name' in platform) ? platform.name : 'Unknown'
        };
    }
}

const BaseState = {
    influencers: []
};

export default alt.createStore(ProfileSelectorStore, 'ProfileSelectorStore');
