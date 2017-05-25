import AuthStore from '../stores/Auth.store';
import FilterStore from '../stores/Filter.store';
import ScheduledPostActions from '../actions/ScheduledPost.action';
import Config from '../config';
import API from '../api.js';
import moment from 'moment';

const ScheduledPostSource = {
    
    getPosts() {
        return {
            remote(state, profileId, startDate, endDate) {

                let { token } = AuthStore.getState();
                
                let DATE_FORMAT = "YYYY-MM-DD HH:mm:ss";
                let start = moment(startDate).format(DATE_FORMAT);
                let end = moment(endDate).format(DATE_FORMAT);

                console.log('Getting posts', `${Config.apiUrl}/scheduler/posts?token=${token}&profileId=${profileId}&scheduledTimeStart=${start}&scheduledTimeEnd=${end}`)

                return API.get(`${Config.apiUrl}/scheduler/posts?token=${token}&profileId=${profileId}&scheduledTimeStart=${start}&scheduledTimeEnd=${end}`);
            },

            success: ScheduledPostActions.gotScheduledPosts,
            error: ScheduledPostActions.gotScheduledPostsError
        }
    },
};

export default ScheduledPostSource;
