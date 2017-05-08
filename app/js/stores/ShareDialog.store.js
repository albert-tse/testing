import moment from 'moment';
import { chain, defer, find, filter, flatten, keyBy, omit, map, sortBy, uniq } from 'lodash';

import alt from '../alt';
import Config from '../config';
import History from '../history';

import LinkStore from './Link.store';
import NotificationStore from './Notification.store';
import ProfileStore from './Profile.store';
import UserStore from './User.store';

import ShareDialogSource from '../sources/ShareDialog.source';

import ShareDialogActions from '../actions/ShareDialog.action';
import LinkActions from '../actions/Link.action';
import ProfileActions from '../actions/Profile.action';

class ShareDialogStore {

    constructor() {
        Object.assign(this, BaseState);
        this.bindActions(ShareDialogActions);
        this.registerAsync(ShareDialogSource);
        this.bindListeners({
            updateProfiles: ProfileActions.loadedProfiles
        });

        this.initializeState();
    }

    /**
     * Set up the share dialog store
     */
    initializeState() {
        const { influencers } = UserStore.getState().user;
        const { profiles } = ProfileStore.getState();

        if (Array.isArray(influencers) && Array.isArray(profiles)) {
            const hydratedInfluencers = this.linkProfilesToInfluencers(profiles, influencers);
            const sortedProfiles = this.getProfilesFrom(hydratedInfluencers);
            const selectedProfiles = this.getProfilesFrom(hydratedInfluencers, true);
            const selectedPlatforms = this.getPlatforms(selectedProfiles);

            Object.assign(this, {
                influencers: hydratedInfluencers,
                profiles: sortedProfiles,
                selectedProfiles,
                selectedPlatforms,
            });
        }
    }

    /**
     * Assign the profiles to the corresponding influencers
     * @param {Array} profiles containing the influencer id to match it to
     * @param {Array} influencers that will contain matching profiles
     * @return {Array} updated influencers
     */
    linkProfilesToInfluencers(profiles, influencers) {
        return influencers.map(function (inf) { return {
                ...inf,
                profiles: chain(profiles).filter({ influencer_id: inf.id }).sortBy('profile_name').value()
            };
        });
    }

    /**
     * When profiles change, update the share dialog and the selected profile if necessary
     * for cases when a profile is disconnected, choose a new one
     * @param {Array} profiles from the server
     */
    updateProfiles(profiles) {
        this.setState(state => {
            if (Array.isArray(state.influencers) && Array.isArray(profiles)) {
                profiles = profiles.map(p => {
                    const platform = Config.platforms[p.platform_id];

                    return { ...p,
                        platformName: (typeof platform !== 'undefined' && 'name' in platform) ? platform.name : 'Unknown'
                    };
                });

                const updatedInfluencers = sortBy(this.linkProfilesToInfluencers(profiles, state.influencers), inf => inf.name);
                const selectedProfiles = this.getProfilesFrom(updatedInfluencers, true);

                return {
                    influencers: updatedInfluencers,
                    profiles: this.getProfilesFrom(updatedInfluencers),
                    selectedProfiles,
                    selectedPlatforms: this.getPlatforms(selectedProfiles)
                };
            }
        });
    }

    onOpen(payload) {
        this.setState({
            isActive: true,
            ...payload
        });
    }

    onEdit(payload) {
        this.setState({
            isActive: true,
            isEditing: true,
            ...payload
        });
    }

    onClose() {
        this.setState(BaseState);
    }

    onSchedule() {
        this.selectedProfiles.forEach(profile => {
            const {
                article: { title, description, image, site_name, ucid },
                isEditing,
                messages,
                scheduledDate
            } = this;

            const platform = profile.platformName.toLowerCase();
            if (platform in this.messages) {
                const payload = {
                    attachmentTitle: title,
                    attachmentDescription: description,
                    attachmentImage: image,
                    attachmentCaption: site_name,
                    influencerId: profile.influencer_id,
                    message: messages[platform].message,
                    platformId: profile.platform_id,
                    profileId: profile.id,
                    scheduledTime: moment(scheduledDate || new Date()).utc().format(),
                    ucid: ucid
                };

                return this.getInstance()[isEditing ? 'edit' : 'schedule'](payload);
            } else {
                return false; // we cannot schedule this invalid post
            }
        });
    }

    onDeschedule(post) {
        this.getInstance().deschedule(post);
        this.setState({
            isActive: false
        });
    }

    onScheduling() {
        this.setState({
            isActive: false,
            isScheduling: true
        });
    }

    onScheduledSuccessfully(response) {
        this.setState({
            isEditing: false,
            isScheduling: false
        });

        defer(NotificationStore.add, {
            label: 'Scheduled story successfully',
            action: 'Go to My Links',
            callback: History.push.bind(this, Config.routes.links)
        });

        defer(LinkActions.fetchLinks);
    }

    onDescheduledSuccessfully(response) {
        this.setState({
            isEditing: false
        });

        defer(LinkActions.fetchLinks);
    }

    onErrorScheduling() {
        this.setState({
            isScheduling: false
        });
    }

    /**
     * Update the influencer list with selected profile
     * @param {number} profileId of selected profile
     */
    onSelectProfile(profileId) {
        this.toggleProfileSelection(profileId, true);
    }

    /**
     * Update the influencer list with deselected profile
     * @param {number} profileId of deselected profile
     */
    onDeselectProfile(profileId) {
        this.toggleProfileSelection(profileId, false);
    }

    /**
     * Remove a scheduled post from the queue
     * @param {object} payload
     */
    onRemoveScheduledPost(payload) {
        console.log('removing scheduled post', payload);
    }

    /**
     * Update message for given platform
     * @param {string} platform to update
     * @param {string} message to update the platform with
     */
    onUpdateMessage({ platform, message }) {
        this.setState(function (state) {
            if (message.length > 0) {
                return {
                    messages: {
                        ...state.messages,
                        [platform]: {
                            ...state.messages[platform],
                            message
                        }
                    }
                };
            } else {
                return { messages: omit(state.messages, platform) };
            }
        });
    }

    /**
     * Override the headline or description of the story's metadata
     * @param {object} metadata with updated metadata
     */
    onUpdateStoryMetadata(metadata) {
        this.setState(function (state) {
            return {
                article: {
                    ...state.article,
                    ...metadata
                }
            };
        });
    }

    /**
     * Update the scheduled date
     * @param {object} payload containing new scheduled date
     * @param {Date} selectedDate chosen by user from datepicker
     */
    onUpdateScheduledDate({ selectedDate }) {
        this.setState(function (state) {
            return { scheduledDate: selectedDate };
        });
    }

    /**
     * Toggle the value of given profile
     * @param {number} profileId to toggle
     * @param {boolean} markSelected set to true if it should be selected
     */
    toggleProfileSelection(profileId, markSelected) {
        this.setState(state => {
            let selectedProfile = find(state.profiles, { id: profileId });

            if (typeof selectedProfile !== 'undefined') {
                // update profile
                selectedProfile = {
                    ...selectedProfile,
                    selected: markSelected
                };

                const updatedProfiles = sortBy([
                    ...state.profiles.filter(function (p) { return p.id !== profileId; }),
                    selectedProfile
                ], function (p) { return p.profile_name; });

                // update influencer list
                let selectedInfluencer = find(state.influencers, { id: selectedProfile.influencer_id });

                if (typeof selectedInfluencer !== 'undefined') {
                    selectedInfluencer = {
                        ...selectedInfluencer,
                        profiles: updatedProfiles
                    };

                    const updatedInfluencers = sortBy([
                        ...state.influencers.filter(function (i) { return i.id !== selectedInfluencer.id; }),
                        selectedInfluencer
                    ], 'name');

                    const selectedProfiles = this.getProfilesFrom(updatedInfluencers, true);

                    return {
                        profiles: this.getProfilesFrom(updatedInfluencers),
                        influencers: updatedInfluencers,
                        selectedProfiles,
                        selectedPlatforms: this.getPlatforms(selectedProfiles)
                    };
                }
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
}

const BaseState = {
    article: null,
    isActive: false,
    isEditing: false,
    link: {},
    messages: {},
    shortlink: ''
};

export default alt.createStore(ShareDialogStore, 'ShareDialogStore');
