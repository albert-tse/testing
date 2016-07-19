import alt from '../alt';

class ShareDialogActions {

    // This is fired when an article's share button is clicked
    // Or when the share is cancelled (article is null)
    open(payload) {
        this.dispatch(payload);
    }

    close() {
        this.dispatch();
    }
}

export default alt.createActions(ShareDialogActions);
