import { chain, includes, find, findIndex, filter, map, result, throttle, uniq } from 'lodash';
import { filter as filterFp, flatten, flow, get, head, map as mapFp } from 'lodash/fp';
import moment from 'moment-timezone';

import alt from '../alt';
import Config from '../config';

import ProfileSource from '../sources/Profile.source';

import UserStore from './User.store';
import ProfileStore from './Profile.store';
import InfluencerStore from './Influencer.store';

import ProfileActions from '../actions/Profile.action';
import ProfileSelectorActions from '../actions/ProfileSelector.action';
import UserActions from '../actions/User.action';

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
            hydrate: ProfileActions.loadedProfiles,
            updateProfile: ProfileActions.updatedProfile,
            changeSelectedProfile: UserActions.changeSelectedInfluencer,
        });
        Object.assign(this, BaseState);

        this.exportPublicMethods({
            getProfile: this.getProfile,
            hasConnectedProfiles: this.hasConnectedProfiles,
            getSelectedProfileTimeslots: this.getSelectedProfileTimeslots,
            getSelectedProfileTimezone: this.getSelectedProfileTimezone
        });
    }

    getProfile(id) {
        return chain(this.getState().influencers)
            .map('profiles')
            .flatten()
            .find({ id })
            .value()
    }

    /**
     * Hydrate influencers with connected profiles
     * If influencer is dry, mark it as not connected so they can only generate shortlink
     * @param {array} payload.profiles connected User's influencers
     */
    hydrate(profiles) {
        const { influencers } = InfluencerStore.getState();

        if (Array.isArray(influencers) && influencers.length > 0) {
            profiles = profiles.map(insertPlatformName);
            const hydrated = influencers.map(this.hydrateInfluencer, { profiles });
            let selectedProfile = this.selectedProfile;

            const noProfilesSelected = profiles.length === 0 || !this.selectedProfile || (this.selectedProfile && /^inf/.test(this.selectedProfile.id));

            if (noProfilesSelected && hydrated.length > 0 && hydrated[0].profiles.length > 0) {
                selectedProfile = hydrated[0].profiles[0];
            } else if (map(profiles, 'id').indexOf(this.selectedProfile.id) >= 0) {
                selectedProfile = find(profiles, { id: this.selectedProfile.id });
            }

            this.setState({
                influencers: hydrated,
                selectedProfile
            }, () => {
                if (profiles.length < 1) {
                    this.onSelectValidProfile();
                }
            });
        }
    }

    /**
     * Checks if any of the influencers has profile connected
     * @return {boolean}
     */
    hasConnectedProfiles = () => {
        const connectedProfiles = flow(
            mapFp('profiles'),
            flatten,
            filterFp(function isConnectedProfile(profile) { return !/^inf/.test(profile.id) })
        )(this.influencers);

        return connectedProfiles.length > 0;
    }

    /**
     * Returns the timeslots of the current selected profile
     * @return {array}
     */
    getSelectedProfileTimeslots = () => {
        return this.selectedProfile ? this.selectedProfile.slots : [];
    }

    /**
     * Returns the selected profile's timezone,
     * otherwise guess
     * @return {String}
     */
    getSelectedProfileTimezone = () => {
        return this.selectedProfile ? this.selectedProfile.timezone : moment.tz.guess();
    }

    /**
     * Update local copy of profile that was just updated
     * @param {object} updatedProfile profile that just updated; but we'll get updated profile from state in case it's processed by Profile store
     */
    updateProfile(updatedProfile) {
        this.waitFor(ProfileStore);
        let profile = find(ProfileStore.getState().profiles, { id: updatedProfile.id });
        if (profile) {
            let updatedInfluencers = [...this.influencers];
            const indexOfInfluencerWithUpdatedProfile = findIndex(updatedInfluencers, function hasUpdatedProfile(influencer) {
                return map(influencer.profiles, 'id').indexOf(profile.id) >= 0;
            });

            if (indexOfInfluencerWithUpdatedProfile >= 0) {
                let influencerToUpdate = {...updatedInfluencers[indexOfInfluencerWithUpdatedProfile]};
                const indexOfUpdatedProfile = findIndex(influencerToUpdate.profiles, { id: profile.id });

                if (indexOfUpdatedProfile >= 0) {
                    influencerToUpdate.profiles[indexOfUpdatedProfile] = insertPlatformName(profile);
                    updatedInfluencers[indexOfInfluencerWithUpdatedProfile] = influencerToUpdate;

                    let newState = {
                        influencers: updatedInfluencers
                    };

                    // Update selected profile as well if applicable
                    if (this.selectedProfile && this.selectedProfile.id === profile.id) {
                        newState = {
                            ...newState,
                            selectedProfile: profile
                        };
                    }
                    this.setState(newState);
                } // indexOfUpdatedProfile
            } // indexOfInfluencerWithUpdatedProfile
        } // if profile was found
    }

    changeSelectedProfile(influencerId) {
        const selectedInfluencer = find(this.influencers, { id: influencerId })
        if (selectedInfluencer) {
            this.setState({ selectedProfile: selectedInfluencer.profiles[0] })
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
            .map(insertInfluencerName.bind(influencer))
            .value();

        return {
            ...influencer,
            profiles: [...profiles, {
                id: `inf-${influencer.id}`,
                influencer_id: influencer.id,
                influencerName: influencer.name, // XXX where is this being used?
                profile_name: influencer.name
            }]
            /* This will only add a Generate Link entry if influencer has no profiles
            profiles: profiles.length < 1 ? [{
                id: `inf-${influencer.id}`,
                influencer_id: influencer.id,
                influencerName: influencer.name, // XXX where is this being used?
                profile_name: influencer.name
            }] : profiles */
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
            UserStore.selectInfluencer(selectedProfile.influencer_id)
        } else if (/^inf/.test(profileId)) { // Influencer does not have a profile
            const influencer_id = parseInt(profileId.replace(/inf-/,''))
            this.setState({
                selectedProfile: {
                    id: profileId,
                    influencer_id
                }
            });
            UserStore.selectInfluencer(influencer_id)
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
        if (this.selectedProfile && /^inf/.test(this.selectedProfile.id)) {
            const validProfile = flow(
                mapFp('profiles'),
                flatten,
                filterFp(function isNotPseudo(profile) { return !/^inf/.test(profile.id); }),
                head
            )(this.influencers);

            this.setState({ selectedProfile: validProfile });
        }
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
