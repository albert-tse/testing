class ShareDialogActions {

    // This is fired when an article's share button is clicked
    // Or when the share is cancelled (article is null)
    open(payload) {
        this.dispatch(payload);
    }

    /**
     * Remove the scheduled post
     */
    deschedule(scheduledPost) {
        ShareDialogStore.deschedule(scheduledPost.id);
        this.dispatch(scheduledPost);
    }

    edit(payload) {
        // ProfileSelectorActions.selectProfile(payload.profileId);
        this.dispatch(payload);
    }

    close() {
        this.dispatch();
    }

    /**
     * Schedule at least one post
     */
    schedule() {
        this.dispatch();
    }

    shareNow(request) {
        this.dispatch(request);
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

    /**
     * Override the story's metadata
     * @param {object} payload
     */
    updateStoryMetadata(payload) {
        defer(this.dispatch.bind(this), payload);
    }

    /**
     * Update the schedule date usually returned by the Schedule post button component
     * @param {object} payload containing new scheduled date
     * @param {Date} payload.selectedDate
     */
    updateScheduledDate(payload) {
        this.dispatch(payload);
    }

    /**
     * Commands the store to open share dialog with scheduled time set to given timeslot
     * and only open if an article is being shown
     * @param {moment} payload is the timeslotObject
     */
    openShareDialogWithTimeslot(payload) {
        this.dispatch(payload);
    }
}

export default alt.createActions(ShareDialogActions);

import alt from '../alt';
import ShareDialogStore from '../stores/ShareDialog.store';
import { defer } from 'lodash';
import ProfileSelectorActions from './ProfileSelector.action';
