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
        });

        this.exportPublicMethods({});
    }

    handleGenerateLink() {
    }

    handleGeneratedLink(payload) {
        //Not sure why, but the notifications need to be called in a timeout
        setTimeout(function(){
            NotificationStore.add({
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
        },1);
    }

    handleGenerateLinkError() {
        setTimeout(function(){
            NotificationStore.add('There was an error generating your link. Please try again.');
        },1);
    }
}

export default alt.createStore(LinkStore, 'LinkStore');
