import alt from '../alt';
import LinkActions from '../actions/Link.action';
import LinkSource from '../sources/Link.source';
import NotificationStore from '../stores/Notification.store';
import NotificationActions from '../actions/Notification.action';
import Config from '../config/';
import _ from 'lodash';

var BaseState = {
    searchResults: []
}

class LinkStore {
    constructor() {
        _.assign(this, BaseState);

        this.registerAsync(LinkSource);

        this.bindListeners({
            handleGenerateLink: LinkActions.GENERATE_LINK,
            handleGeneratedLink: LinkActions.GENERATED_LINK,
            handleGenerateLinkError: LinkActions.GENERATE_LINK_ERROR,
            handleGeneratedMultipleLinks: LinkActions.GENERATED_MULTIPLE_LINKS,
            handleFetchLinks: LinkActions.FETCH_LINKS,
            handleFetchedLinks: LinkActions.FETCHED_LINKS,
            handleFetchLinksError: LinkActions.FETCH_LINKS_ERROR,
            handleLoading: LinkActions.LOADING
        });

        this.exportPublicMethods({});
    }

    handleFetchLinks() {
        this.setState({
            searchResults: []
        });
    }

    handleFetchedLinks(payload) {
        this.setState({
            searchResults: payload
        });
    }

    handleFetchLinksError(payload) {}

    handleGenerateLink(payload) {}

    handleGeneratedLink(payload) {
        if ('platform' in payload && /facebook|twitter/i.test(payload.platform)) {
            let element = document.createElement('a');
            element.target = '_blank';
            element.href = intentUrls[payload.platform] + payload.shortlink;
            element.dispatchEvent(new Event('click'));
        } else {
            _.defer(NotificationStore.add, {
                label: payload.shortlink,
                action: 'Copy',
                callback: (evt) => {
                    var textField = document.createElement('input');
                    document.body.appendChild(textField);
                    textField.value = payload.shortlink;
                    textField.select();
                    document.execCommand('copy');
                    document.body.removeChild(textField);
                }
            });
        }
    }

    handleGenerateLinkError() {
        _.defer(NotificationStore.add, 'There was an error generating your link. Please try again.');
    }

    handleGeneratedMultipleLinks(payload) {
        _.defer(NotificationStore.add, payload.length + ' links have been generated.');
    }

    handleLoading() {
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
