import AuthStore from '../stores/Auth.store';
import ScheduledPostActions from '../actions/ScheduledPost.action';
import Config from '../config';
import API from '../api.js';
import moment from 'moment';

const ScheduledPostSource = {
    
    getPosts() {
        return {
            remote(state, profileId, startDate, endDate) {

                var { token } = AuthStore.getState();

                var DATE_FORMAT = "YYYY-MM-DD HH:mm:ss";
                var start = moment(startDate).format(DATE_FORMAT);
                var end = moment(endDate).format(DATE_FORMAT);

                return API.get(`${Config.apiUrl}/scheduler/posts?token=${token}&profileId=${profileId}&start=${start}&end=${end}`);
            },

            success: ScheduledPostActions.gotScheduledPosts,
            error: ScheduledPostActions.gotScheduledPostsError
        }
    },
};

export default ScheduledPostSource;
