import alt from '../alt';
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

    scheduling() {
        defer(this.dispatch.bind(this));
    }

    scheduledSuccessfully(response) {
        this.dispatch(response);
    }

    errorScheduling(error) {
        console.error('error from API', error);
        this.dispatch(error);
    }
}

export default alt.createActions(ShareDialogActions);
