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
            handleFetchLinksError: LinkActions.FETCH_LINKS_ERROR
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

    handleGenerateLink(payloads) {}

    handleGeneratedLink(payload) {
        // TODO: Not sure why, but the notifications need to be called in a timeout
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

    handleGenerateLinkError() {
        _.defer(NotificationStore.add, 'There was an error generating your link. Please try again.');
    }

    handleGeneratedMultipleLinks(payload) {
        _.defer(NotificationStore.add, payload.length + ' links have been generated.');
    }
}

export default alt.createStore(LinkStore, 'LinkStore');