import alt from '../alt';
import ScheduledPostActions from '../actions/ScheduledPost.action';
import ScheduledPostSource from '../sources/ScheduledPost.source';

var BaseState = {};

class ScheduledPostStore {
    constructor() {
        Object.assign(this, BaseState);

        this.registerAsync(ScheduledPostSource);
        this.bindActions(ScheduledPostActions);
        this.exportPublicMethods({});
    }

    onGotScheduledPosts(posts) {

    	console.log('got posts', posts);
    	let scheduledPosts = posts.data.data;

    	// TODO: we need the shortlink associated with this scheduled post
    	// TODO: we might need article info associated with the post, for edit purposes

    	this.setState({
            posts: scheduledPosts
        });
    }
}

export default alt.createStore(ScheduledPostStore, 'ScheduledPostStore');
