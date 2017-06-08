import moment from 'moment';

import alt from '../alt';

import FilterStore from '../stores/Filter.store';
import ProfileSelectorStore from '../stores/ProfileSelector.store';

import FilterActions from '../actions/Filter.action';
import ProfileActions from '../actions/Profile.action';
import ProfileSelectorActions from '../actions/ProfileSelector.action';
import ScheduledPostActions from '../actions/ScheduledPost.action';
import ShareDialogActions from '../actions/ShareDialog.action';

import ScheduledPostSource from '../sources/ScheduledPost.source';

const DAYS_IN_A_WEEK = 7;

/**
 * Keeps track of the state of scheduled posts currently loaded into the app
 * @return {AltStore}
 */
class ScheduledPostStore {

    constructor() {
        Object.assign(this, BaseState);

        this.registerAsync(ScheduledPostSource);
        this.bindActions(ScheduledPostActions);
        this.bindListeners({
            refetch: [ProfileActions.loadedProfiles, ProfileSelectorActions.selectProfile, FilterActions.updateCalendarQueueWeek, ShareDialogActions.scheduledSuccessfully]
        });
    }

    /**
     * Update store with newly fetched scheduled posts returned by
     * API server
     * @param {array} posts from scheduled queue
     */
    onGotScheduledPosts(posts) {
    	let scheduledPosts = posts.data.data;

    	// TODO: we might need article info associated with the post, for edit purposes

    	this.setState({
            posts: scheduledPosts
        });
    }

    /**
     * Instruct store to re-fetch
     * Call this when a new profile is selected so its scheduled queue will be loaded into view
     */
    refetch() {
        this.waitFor(ProfileSelectorStore);
        const { selectedProfile } = ProfileSelectorStore.getState();
        const { calendarQueueWeek } = FilterStore.getState();
        const startDate = moment.utc();
        const endDate = moment.utc().add(calendarQueueWeek * DAYS_IN_A_WEEK ,'days');

        this.getInstance().getPosts(selectedProfile.id, startDate, endDate);
    }
}

var BaseState = {};

export default alt.createStore(ScheduledPostStore, 'ScheduledPostStore');
