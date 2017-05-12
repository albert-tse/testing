import moment from 'moment';
import { chain, defer, find, filter, findIndex, flatten, keyBy, omit, map, sortBy, uniq } from 'lodash';

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
import UserActions from '../actions/User.action';

class ShareDialogStore {

    constructor() {
        Object.assign(this, BaseState);
        this.bindActions(ShareDialogActions);
        this.registerAsync(ShareDialogSource);
    }

    onOpen(payload) {
        this.setState({
            isActive: true,
            ...payload
        });
    }

    /**
     * When editing a post that has previously been scheduled, pre-fill the share dialog according to
     * the data passed via payload.link
     * @param {object} payload contains link data generated from previous scheduling
     * @param {object} payload.link contains data we will use to pre-fill share dialog form
     */
    onEdit(payload) {
        const platformName = payload.link.platformName.toLowerCase();
        const selectedProfiles = [{
            ...find(this.profiles, { id: payload.link.profileId }),
            selected: true
        }];
        const selectedPlatforms = [platformName];
        const messages = { [platformName]: { message: payload.link.postMessage } };
        const scheduledDate = moment(new Date(`${payload.link.scheduledTime}+0:00`)).format(); // set to UTC so moment can properly display local time
        const influencers = chain(this.influencers)
            .filter({ id: payload.link.influencerId })
            .map(function (influencer) {
                return {
                    ...influencer,
                    profiles: selectedProfiles
                };
            })
            .value();

        const newState = {
            ...this,
            ...payload,
            isActive: true,
            isEditing: true,
            messages,
            article: {
                title: payload.link.attachmentTitle,
                description: payload.link.attachmentDescription,
                image: payload.link.attachmentImage
            },
            scheduledPost: {
                influencers,
                selectedProfiles,
                selectedPlatforms,
                scheduledDate
            }
        };

        this.setState(newState);
    }

    onClose() {
        this.setState(BaseState);
    }

    onSchedule() {
        const store = this.isEditing ? this.scheduledPost : this;

        store.selectedProfiles.forEach(profile => {
            const {
                scheduledDate
            } = store;

            const {
                article: { title, description, image, site_name, ucid },
                messages,
                isEditing
            } = this;

            const platform = profile.platformName.toLowerCase();

            if (platform in messages) {
                const payload = {
                    attachmentTitle: title,
                    attachmentDescription: description,
                    attachmentImage: image,
                    attachmentCaption: site_name,
                    editPostId: isEditing ? this.link.scheduledPostId : null,
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
        if (this.link && this.link.scheduledPostId >= 0) {
            this.getInstance().deschedule({ editPostId: this.link.scheduledPostId });
            this.setState(BaseState);
        }
    }

    onScheduling() {
        this.setState({
            isActive: false,
            isScheduling: true
        });
    }

    onScheduledSuccessfully(response) {
        this.setState(BaseState);

        defer(function () {
            LinkActions.fetchLinks().then(function (response) {
                NotificationStore.add({
                    label: 'Scheduled story successfully',
                    action: 'Go to My Links',
                    callback: History.push.bind(this, Config.routes.links)
                });
            });
        });
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
            if (state.isEditing) {
                return { scheduledPost: { ...state.scheduledPost, scheduledDate: selectedDate } };
            } else {
                return { scheduledDate: selectedDate };
            }
        });
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
