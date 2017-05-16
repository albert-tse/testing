import alt from '../alt';
import AppActions from '../actions/App.action';

class ScheduledPostActions {
    
    getScheduledPosts() {
        return ScheduledPostStore.getPosts();
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