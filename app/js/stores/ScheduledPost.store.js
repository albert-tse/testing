import moment from 'moment';
import { defer, find } from 'lodash';

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
            refetch: [/*ProfileActions.loadedProfiles*/, /*ProfileSelectorActions.selectProfile*/, FilterActions.updateCalendarQueueWeek, ShareDialogActions.scheduledSuccessfully],
            onGettingScheduledPosts: ScheduledPostActions.gettingScheduledPosts
        });
        this.exportPublicMethods({
            refetch: this.refetch,
            getPostByLinkId: this.getPostByLinkId
        });

        const { calendarQueueWeek } = FilterStore.getState();
        this.state = {
            startDate: moment.utc().startOf('day'),
            endDate: moment.utc().add(calendarQueueWeek * DAYS_IN_A_WEEK, 'days')
        }
    }

    /**
     * Update store with newly fetched scheduled posts returned by
     * API server
     * @param {object} response from scheduled queue
     */
    onGotScheduledPosts(response) {
        const { totalScheduledPostsAmount, scheduledPostsWithinRange } = response.data.data;

        let posts = scheduledPostsWithinRange.map(post => ({
            ...post,
            time: moment.tz(post.scheduledTime, 'UTC')
        }));

    	// TODO: we might need article info associated with the post, for edit purposes

        this.setState({
            loading: false,
            posts,
            totalScheduledPostsAmount,
            startDate: response.startDate,
            endDate: response.endDate
        });
    }

    onGettingScheduledPosts() {
        this.setState({ loading: true })
    }

    /**
     * Instruct store to re-fetch
     * Call this when a new profile is selected so its scheduled queue will be loaded into view
     */
    refetch = () => {
        this.waitFor(ProfileSelectorStore);
        const { selectedProfile } = ProfileSelectorStore.getState();
        // const { calendarQueueWeek } = FilterStore.getState();
        // const startDate = moment.utc();
        // const endDate = moment.utc().add(calendarQueueWeek * DAYS_IN_A_WEEK ,'days');
        this.setState({ loading: true });
        defer(this.getInstance().getPosts, selectedProfile.id, this.state.startDate, this.state.endDate);
    }

    getPostByLinkId = linkId => find(this.posts, { linkId })

}

var BaseState = {};

export default alt.createStore(ScheduledPostStore, 'ScheduledPostStore');
