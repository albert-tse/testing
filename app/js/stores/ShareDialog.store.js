import alt from '../alt';
import { defer, find, sortBy } from 'lodash';
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
            Object.assign(this, {
                profiles,
                influencers: this.linkProfilesToInfluencers(profiles, influencers)
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
        return influencers.map(inf => ({
            ...inf,
            profiles: profiles.filter(p => p.influencer_id === inf.id)
        }));
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

                return {
                    profiles,
                    influencers: sortBy(this.linkProfilesToInfluencers(profiles, state.influencers), inf => inf.name)
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

    onSchedule(requests) {
        requests.forEach(request => {
            if (this.isEditing) {
                this.getInstance().edit(request);
            } else {
                this.getInstance().schedule(request);
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
                    ...state.profiles.filter(p => p.id !== profileId),
                    selectedProfile
                ], p => p.profile_name);

                // update influencer list
                let selectedInfluencer = find(state.influencers, { id: selectedProfile.influencer_id });

                if (typeof selectedInfluencer !== 'undefined') {
                    selectedInfluencer = {
                        ...selectedInfluencer,
                        profiles: updatedProfiles
                    };

                    const updatedInfluencers = sortBy([
                        ...state.influencers.filter(i => i.id !== selectedInfluencer.id),
                        selectedInfluencer
                    ], inf => inf.name);

                    return {
                        profiles: updatedProfiles,
                        influencers: updatedInfluencers
                    };
                }
            }
        });
    }
}

const BaseState = {
    isActive: false,
    isEditing: false,
    shortlink: '',
    link: {}
};

export default alt.createStore(ShareDialogStore, 'ShareDialogStore');
