import alt from '../alt';
import LinkActions from '../actions/Link.action';
import LinkSource from '../sources/Link.source';
import ListStore from '../stores/List.store';
import NotificationStore from '../stores/Notification.store';
import NotificationActions from '../actions/Notification.action';
import ShareDialogActions from '../actions/ShareDialog.action';
import Config from '../config/';
import defer from 'lodash/defer';
import History from '../history';

const BaseState = {
    searchResults: []
};

class LinkStore {
    constructor() {
        Object.assign(this, BaseState);
        this.registerAsync(LinkSource);
        this.bindActions(LinkActions);
        this.exportPublicMethods({});
    }

    onFetchLinks() {
        this.setState({
            searchResults: []
        });
    }

    onFetchedLinks(payload) {
        this.setState({
            searchResults: payload
        });
    }

    onGeneratedLink(payload) {
        console.log(payload);
        defer(ShareDialogActions.open, payload);
    }

    onGenerateLinkError() {
        defer(NotificationStore.add, 'There was an error generating your link. Please try again.');
    }

    onGeneratedMultipleLinks(payload) {
        defer(NotificationStore.add, {
            label: payload.length + ' links have been generated.',
            action: 'Go to Links',
            callback: History.push.bind(this, Config.routes.links)
        });
    }

    onLoading() {
        this.setState({
            searchResults: -1 // flags that it is loading instead of an empty array which means no links found
        });
    }
}

const intentUrls = {
    twitter: 'https://twitter.com/intent/tweet?url=',
    facebook: 'https://www.facebook.com/sharer/sharer.php?u='
};

export default alt.createStore(LinkStore, 'LinkStore');
