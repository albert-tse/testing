import { chain, includes, find, findIndex, filter, map, result, throttle, uniq } from 'lodash';
import { filter as filterFp, flatten, flow, get, head, map as mapFp } from 'lodash/fp';

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
            const hydrated = influencers.map(this.hydrateInfluencer, { profiles });
            let selectedProfile = this.selectedProfile;
            if (!this.selectedProfile && hydrated.length > 0 && hydrated[0].profiles.length > 0) {
                selectedProfile = hydrated[0].profiles[0];
            }

            this.setState({
                influencers: hydrated,
                selectedProfile
            });
        }
    }

    /**
     * Associate each influencer with profiles
     * and assign "Other Platform" profile if none are asosciated with it
     * @param {object} influencer to associate profiles to
     * @param {object} this contains array of profiles to link from
     * @param {array} this.profiles is the array of profiles available
     * @return {object}
     */
    hydrateInfluencer(influencer) {
        const profiles = chain(this.profiles)
            .filter({ influencer_id: influencer.id })
            .map(insertPlatformName)
            .map(insertInfluencerName.bind(influencer))
            .value();

        return {
            ...influencer,
            profiles: profiles.length < 1 ? [{ influencer_id: influencer.id, influencerName: influencer.name }] : profiles
        };
    }

    /**
     * Directs a profile to be marked as selected given a profile id
     * @param {nummber} profileId identifies the profile
     */
    onSelectProfile(profileId) {
        const profiles = this.getProfilesFrom(this.influencers);
        const selectedProfile = find(profiles, { id: profileId });

        if (includes(profiles, selectedProfile)) {
            this.setState({ selectedProfile });
        } else if (/^inf/.test(profileId)) { // Influencer does not have a profile
            this.setState({
                selectedProfile: {
                    id: profileId,
                    influencer_id: parseInt(profileId.replace(/inf-/,''))
                }
            });
        }
    }

    /**
     * Filter out profiles that don't match the given keywords
     * @param {string} keywords
     */
    onSearchProfiles(keywords) {
        this.setState({ keywords });
        this.filterProfiles();
    }

    /**
     * Select a valid profile
     */
    onSelectValidProfile() {
        const validProfile = flow(
            mapFp('profiles'),
            flatten,
            filterFp(function isNotPseudo(profile) { return !/^inf/.test(profile.id); }),
            head
        )(this.influencers);

        this.setState({ selectedProfile: validProfile });
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
            .map(insertPlatformName)
            .value();

        return onlySelected ? filter(profiles, { selected: true }) : profiles;
    }

    /**
     * Filter the profiles list to only show those whose name
     * matches the keywords entered
     */
    filterProfiles = throttle(() => {
        this.setState(state => {
            if (state.keywords.length > 0) {
                const filteredProfiles = state.getProfilesFrom(state.influencers).filter(profile => {
                    return new RegExp(state.keywords,'gi').test(profile.profile_name)
                });

                const filteredInfluencers = chain(filteredProfiles)
                    .map(profile => find(state.influencers, { id: profile.influencer_id }))
                    .uniqBy('id')
                    .value();

                return {
                    visibleInfluencers: filteredInfluencers,
                    visibleProfiles: filteredProfiles
                };
            } else {
                return {
                    visibleInfluencers: null,
                    visibleProfiles: null
                };
            }
        });
    }, 50, { leading: true });

}

const BaseState = {
    influencers: [],
    selectedProfile: null,
    keywords: '',
    visibleProfiles: null,
    visibleInfluencers: null
};

export default alt.createStore(ProfileSelectorStore, 'ProfileSelectorStore');


/**
 * add platform name to the passed object
 * @param {object} profile contains platform id to check
 * @return {object} profile's platform name
 */
function insertPlatformName(profile) {
    const platform = Config.platforms[profile.platform_id];
    return {
        ...profile,
        platformName: (typeof platform !== 'undefined' && 'name' in platform) ? platform.name : undefined
    };
}

/**
 * Adds influencer's name given the influencer_id set inside profile object and
 * influencer object passed by context
 * @param {object} profile that will get a new property containing influencer name
 * @context {object} this contains influencer's properties
 * @return {object}
 */
function insertInfluencerName(profile) {
    return {
        ...profile,
        influencerName: this.name
    }
}
