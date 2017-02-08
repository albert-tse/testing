import alt from '../alt';
import LinkActions from '../actions/Link.action';
import LinkSource from '../sources/Link.source';
import ListStore from '../stores/List.store';
import NotificationStore from '../stores/Notification.store';
import ArticleStore from '../stores/Article.store';
import NotificationActions from '../actions/Notification.action';
import ShareDialogActions from '../actions/ShareDialog.action';
import Config from '../config/';
import { defer, find } from 'lodash';
import History from '../history';

const BaseState = {
    searchResults: []
};

class LinkStore {
    constructor() {
        Object.assign(this, BaseState);
        this.registerAsync(LinkSource);
        this.bindActions(LinkActions);
        this.exportPublicMethods({
            deschedule: this.deschedule.bind(this)
        });
    }

    onFetchLinks() {
        /*
        this.setState({
            searchResults: []
        });
        */
    }

    onFetchedLinks(payload) {
        this.setState({
            searchResults: payload
        });
    }

    onGeneratedLink(payload) {
        payload = { ...payload, article: ArticleStore.getState().articles[payload.link.ucid] };
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
            isLoading: true
            // searchResults: -1 // flags that it is loading instead of an empty array which means no links found
        });
    }

    /**
     * Remove a scheduled post given a postId
     * @param {int} postId to remove
     */
    deschedule(postId) {
        this.setState({
            searchResults: this.searchResults.filter(post => post.scheduledPostId !== postId)
        }, this.getInstance().fetchLinks);
    }
}

const intentUrls = {
    twitter: 'https://twitter.com/intent/tweet?url=',
    facebook: 'https://www.facebook.com/sharer/sharer.php?u='
};

export default alt.createStore(LinkStore, 'LinkStore');
