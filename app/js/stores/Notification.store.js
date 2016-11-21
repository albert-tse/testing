import React from 'react';
import { Button, IconButton } from 'react-toolbox';
import alt from '../alt';

class NotificationStore {

    constructor() {
        Object.assign(this, BaseState);
        this.bindActions(NotificationActions);
        this.bindListeners({
            onClick: NotificationActions.ON_CLICK
        });
        this.exportPublicMethods({
            dismiss: ::this.onDismiss,
            add: ::this.onAdd
        });
    }

    onDismiss() {
        this.dequeue();
    }

    onAdd(payload) {
        payload = typeof payload !== 'string' ? payload : { label: payload };
        let notificationPayload = Object.assign({
            onClick: this.onClick.bind(this, true)
        }, defaults, payload);

        this.setState({
            active: true,
            queue: [...this.queue, notificationPayload]
        });
    }

    onClick(triggerCallback) {
        var notification = this.queue[0];

        if ('callback' in notification && triggerCallback) {
            notification.callback.call(this)
        }

        this.dequeue();
    }

    dequeue() {
        this.setState({ active: false });
        return _.delay(::this.showNext, 1000);
    }

    showNext() {
        this.queue.shift();
        if (this.queue.length > 0) {
            this.setState({ active: true });
        }
    }

}

const defaults = {
    onTimeout: NotificationActions.dismiss,
    timeout: 5000,
    action: 'ok',
    type: 'accept'
};

const BaseState = {
    active: false,
    queue: []
};

export default alt.createStore(NotificationStore, 'NotificationStore');
import NotificationActions from '../actions/Notification.action';
