import alt from '../alt';
import AppActions from '../actions/App.action';

class ScheduledPostActions {
    
    getScheduledPosts(profileId, start, end) {
        return ScheduledPostStore.getPosts(profileId, start, end);
    }

    gotScheduledPosts(payload) {
        this.dispatch(payload);
    }

    gotScheduledPostsError(error) {
        console.error('Error loading scheduled posts', error);
    }
}

export default alt.createActions(ScheduledPostActions);

import ScheduledPostStore from '../stores/ScheduledPost.store';