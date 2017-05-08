import alt from '../alt';
import LinkStore from '../stores/Link.store';
import { defer } from 'lodash';

class ShareDialogActions {

    // This is fired when an article's share button is clicked
    // Or when the share is cancelled (article is null)
    open(payload) {
        this.dispatch(payload);
    }

    edit(payload) {
        this.dispatch(payload);
    }

    close() {
        this.dispatch();
    }

    /**
     * Schedule an array of posts
     * @param {Array} requests contains an array of payload representing each scheduled post
     */
    schedule(requests) {
        this.dispatch(requests);
    }

    /**
     * Remove the scheduled post
     * @param {Object} Payload representing a scheduled post
     */
    deschedule(post) {
        LinkStore.deschedule(post.editPostId);
        this.dispatch(post);
    }

    scheduling() {
        defer(this.dispatch.bind(this));
    }

    scheduledSuccessfully(response) {
        this.dispatch(response);
    }

    descheduledSuccessfully(response) {
        this.dispatch(response);
    }

    errorScheduling(error) {
        console.error('error from API', error);
        this.dispatch(error);
    }

    /**
     * Called from the component when user has selected a profile from the selector
     * @param {number} profileId id of selected profile
     */
    selectProfile(profileId) {
        this.dispatch(profileId);
    }

    /**
     * Called from the component when user deselects a profile
     * @param {number} profileId id of deselected profile
     */
    deselectProfile(profileId) {
        this.dispatch(profileId);
    }

    /**
     * Update the message for given platform
     * @param {object} payload
     * @param {string} payload.platform that message will be posted on
     * @param {string} payload.message content of the post
     */
    updateMessage(payload) {
        this.dispatch(payload);
    }
}

export default alt.createActions(ShareDialogActions);
