import AuthStore from '../stores/Auth.store';
import FilterStore from '../stores/Filter.store';
import ScheduledPostActions from '../actions/ScheduledPost.action';
import Config from '../config';
import API from '../api.js';
import moment from 'moment';

/**
 * Fetches scheduled posts of a given profile from API server
 * @return {object}
 */
const ScheduledPostSource = {

    /**
     * Fetches scheduled posts of the profile whose id matches profileId
     * limit response within the specified start/end dates
     * @param {object} state of store
     * @param {number} profileId identifies which profile to fetch scheduled posts for
     * @param {Date} startDate scheduled posts must be newer than this date
     * @param {Date} endDate scheduled posts must not pass this date
     * @return {object}
     */
    getPosts() {
        return {
            remote(state, profileId, startDate, endDate) {
                const { token } = AuthStore.getState();
                const DATE_FORMAT = "YYYY-MM-DD HH:mm:ss";
                const start = moment.utc(startDate).format(DATE_FORMAT);
                const end = moment.utc(endDate).format(DATE_FORMAT);

                return API.get(`${Config.apiUrl}/scheduler/posts?token=${token}&profileId=${profileId}&scheduledTimeStart=${start}&scheduledTimeEnd=${end}`)
                    .then(response => {
                        return {
                            ...response,
                            startDate,
                            endDate
                        }
                    });
            },

            success: ScheduledPostActions.gotScheduledPosts,
            loading: ScheduledPostActions.gettingScheduledPosts,
            error: ScheduledPostActions.gotScheduledPostsError
        }
    },
};

export default ScheduledPostSource;
